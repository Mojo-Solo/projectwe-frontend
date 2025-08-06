import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { ExitPlanningApplicationService } from "@/application/services/exit-planning-application-service";
import { ExitStrategyService } from "@/domains/exit-planning/services/exit-strategy-service";
import { PrismaExitStrategyRepository } from "@/domains/exit-planning/repositories/exit-strategy-repository";
import { ValuationService } from "@/domains/exit-planning/services/valuation-service";
import { PrismaValuationRepository } from "@/domains/exit-planning/repositories/valuation-repository";
import { DomainEventPublisherFactory } from "@/domains/shared/domain-event-publisher";
import { CreateExitStrategyInput } from "@/domains/exit-planning/entities/exit-strategy";
import { prisma } from "@/lib/prisma-compat";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize domain services
const eventPublisher = DomainEventPublisherFactory.create("database", {
  prisma,
});
const exitStrategyRepository = new PrismaExitStrategyRepository(prisma);
const valuationRepository = new PrismaValuationRepository(prisma);
const exitStrategyService = new ExitStrategyService(
  exitStrategyRepository,
  eventPublisher,
);
const valuationService = new ValuationService(
  valuationRepository,
  eventPublisher,
);
const applicationService = new ExitPlanningApplicationService(
  exitStrategyService,
  exitStrategyRepository,
  valuationService,
);

const createExitStrategySchema = z.object({
  type: z.enum([
    "ACQUISITION",
    "MERGER",
    "IPO",
    "MANAGEMENT_BUYOUT",
    "EMPLOYEE_STOCK_OWNERSHIP_PLAN",
    "LIQUIDATION",
    "FAMILY_SUCCESSION",
    "STRATEGIC_PARTNERSHIP",
  ]),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  objectives: z.array(z.string()).default([]),
  expectedTimeline: z.number().optional(),
  projectId: z.string().uuid().optional(),
});

const updateExitStrategySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  status: z
    .enum([
      "PLANNING",
      "PREPARATION",
      "ACTIVE",
      "ON_HOLD",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  targetValuation: z
    .object({
      low: z.number(),
      mid: z.number(),
      high: z.number(),
      currency: z.string().default("USD"),
      method: z.enum([
        "ASSET_BASED",
        "INCOME_APPROACH",
        "MARKET_APPROACH",
        "DISCOUNTED_CASH_FLOW",
        "COMPARABLE_TRANSACTIONS",
        "RULE_OF_THUMB",
      ]),
      confidence: z.number().min(0).max(1),
      calculatedAt: z.date().default(() => new Date()),
      assumptions: z.array(z.string()).default([]),
      comparables: z.array(z.string()).default([]),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const summary = searchParams.get("summary") === "true";

    if (summary) {
      // Return organization strategies summary
      const result = await applicationService.getOrganizationStrategies(
        session.user.organizationId,
        session.user.id,
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result.data);
    }

    // Get strategies by filters
    let strategies;
    if (status) {
      strategies = await exitStrategyRepository.findByStatus(
        session.user.organizationId,
        status,
      );
    } else if (type) {
      strategies = await exitStrategyRepository.findByType(
        session.user.organizationId,
        type as any,
      );
    } else {
      strategies = await exitStrategyRepository.findByOrganizationId(
        session.user.organizationId,
      );
    }

    return NextResponse.json(strategies);
  } catch (error) {
    console.error("Error fetching exit strategies:", error);
    return NextResponse.json(
      { error: "Failed to fetch exit strategies" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createExitStrategySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const input: CreateExitStrategyInput = {
      type: validation.data.type,
      name: validation.data.name,
      description: validation.data.description,
      objectives: validation.data.objectives || [],
      expectedTimeline: validation.data.expectedTimeline,
      projectId: validation.data.projectId,
      organizationId: session.user.organizationId,
      createdBy: session.user.id,
      lastUpdatedBy: session.user.id,
      // Required fields with defaults
      metadata: {},
      configuration: {},
      teamMembers: [],
      advisors: [],
      status: "PLANNING",
      phases: [],
      readinessFactors: {},
      marketConditions: {},
      industryTrends: [],
      risks: [],
      dueDiligenceStatus: "NOT_STARTED",
      dueDiligenceItems: [],
    };

    const result = await applicationService.createExitStrategy(input);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating exit strategy:", error);
    return NextResponse.json(
      { error: "Failed to create exit strategy" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Strategy ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const validation = updateExitStrategySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const input = {
      ...validation.data,
      lastUpdatedBy: session.user.id,
    };

    const result = await applicationService.updateExitStrategy(id, input);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating exit strategy:", error);
    return NextResponse.json(
      { error: "Failed to update exit strategy" },
      { status: 500 },
    );
  }
}
