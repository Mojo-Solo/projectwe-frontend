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

const readinessAssessmentSchema = z.object({
  financial: z.object({
    revenue_growth: z.number().min(0).max(100),
    profit_margins: z.number().min(0).max(100),
    cash_flow_stability: z.number().min(0).max(100),
    financial_records_quality: z.enum(["poor", "fair", "good", "excellent"]),
    working_capital_management: z.number().min(0).max(100),
    debt_levels: z.number().min(0).max(100),
  }),
  operational: z.object({
    management_team_strength: z.number().min(0).max(100),
    operational_efficiency: z.number().min(0).max(100),
    system_documentation: z.enum(["poor", "fair", "good", "excellent"]),
    key_person_dependency: z.number().min(0).max(100), // Higher = less dependency
    process_standardization: z.number().min(0).max(100),
    technology_infrastructure: z.number().min(0).max(100),
  }),
  legal: z.object({
    legal_structure_clarity: z.enum(["poor", "fair", "good", "excellent"]),
    compliance_status: z.number().min(0).max(100),
    intellectual_property: z.number().min(0).max(100),
    contracts_documentation: z.enum(["poor", "fair", "good", "excellent"]),
    litigation_risks: z.number().min(0).max(100), // Higher = lower risk
    regulatory_compliance: z.number().min(0).max(100),
  }),
  strategic: z.object({
    market_position: z.number().min(0).max(100),
    competitive_advantages: z.number().min(0).max(100),
    customer_diversification: z.number().min(0).max(100),
    growth_opportunities: z.number().min(0).max(100),
    brand_strength: z.number().min(0).max(100),
    strategic_partnerships: z.number().min(0).max(100),
  }),
  market: z.object({
    market_attractiveness: z.number().min(0).max(100),
    industry_growth_trends: z.number().min(0).max(100),
    buyer_interest_level: z.number().min(0).max(100),
    market_timing: z.number().min(0).max(100),
    economic_conditions: z.number().min(0).max(100),
    comparable_transactions: z.number().min(0).max(100),
  }),
  additional_factors: z
    .object({
      exit_timeline_flexibility: z.number().min(0).max(100),
      owner_readiness: z.number().min(0).max(100),
      tax_optimization: z.number().min(0).max(100),
      succession_planning: z.number().min(0).max(100),
    })
    .optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = readinessAssessmentSchema.safeParse(body);

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

    const result = await applicationService.completeReadinessAssessment(
      params.id,
      validation.data,
      session.user.id,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Return the updated strategy with readiness score
    return NextResponse.json({
      strategy: result.data,
      readinessScore: result.data?.readinessScore,
      recommendations: generateReadinessRecommendations(
        result.data?.readinessScore,
      ),
    });
  } catch (error) {
    console.error("Error completing readiness assessment:", error);
    return NextResponse.json(
      { error: "Failed to complete readiness assessment" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await applicationService.getExitStrategy(
      params.id,
      session.user.id,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const strategy = result.data;
    if (!strategy?.readinessScore) {
      return NextResponse.json({
        readinessScore: null,
        hasAssessment: false,
        message: "No readiness assessment completed for this strategy",
      });
    }

    return NextResponse.json({
      readinessScore: strategy.readinessScore,
      hasAssessment: true,
      assessmentDate: strategy.readinessScore.calculatedAt,
      recommendations: generateReadinessRecommendations(
        strategy.readinessScore,
      ),
      nextSteps: generateNextSteps(strategy.readinessScore),
    });
  } catch (error) {
    console.error("Error fetching readiness assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch readiness assessment" },
      { status: 500 },
    );
  }
}

// Helper function to generate recommendations based on readiness score
function generateReadinessRecommendations(readinessScore: any): string[] {
  if (!readinessScore) return [];

  const recommendations: string[] = [];

  // Financial recommendations
  if (readinessScore.financial < 60) {
    recommendations.push(
      "Improve financial performance and documentation before exit",
    );
    recommendations.push("Consider engaging a CFO or financial advisor");
  }

  // Operational recommendations
  if (readinessScore.operational < 60) {
    recommendations.push(
      "Strengthen operational processes and reduce key person dependencies",
    );
    recommendations.push("Document standard operating procedures");
  }

  // Legal recommendations
  if (readinessScore.legal < 60) {
    recommendations.push("Conduct legal audit and resolve compliance issues");
    recommendations.push("Organize and digitize legal documentation");
  }

  // Strategic recommendations
  if (readinessScore.strategic < 60) {
    recommendations.push("Develop competitive differentiation strategies");
    recommendations.push("Diversify customer base and revenue streams");
  }

  // Market recommendations
  if (readinessScore.market < 60) {
    recommendations.push("Assess market timing and buyer interest");
    recommendations.push("Consider waiting for better market conditions");
  }

  // Overall recommendations
  if (readinessScore.overall >= 80) {
    recommendations.push(
      "Strong exit readiness - consider initiating exit process",
    );
  } else if (readinessScore.overall >= 60) {
    recommendations.push("Good foundation - address key gaps before exit");
  } else {
    recommendations.push(
      "Significant preparation needed before exit consideration",
    );
  }

  return recommendations;
}

// Helper function to generate next steps
function generateNextSteps(readinessScore: any): string[] {
  if (!readinessScore) return [];

  const nextSteps: string[] = [];

  // Prioritize based on lowest scores
  const categories = [
    {
      name: "financial",
      score: readinessScore.financial,
      action: "Engage financial advisor for due diligence preparation",
    },
    {
      name: "operational",
      score: readinessScore.operational,
      action: "Develop management team and document processes",
    },
    {
      name: "legal",
      score: readinessScore.legal,
      action: "Conduct legal audit and resolve outstanding issues",
    },
    {
      name: "strategic",
      score: readinessScore.strategic,
      action: "Strengthen market position and competitive advantages",
    },
    {
      name: "market",
      score: readinessScore.market,
      action: "Research buyer landscape and market conditions",
    },
  ];

  // Sort by score (lowest first) and take top 3
  categories
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .forEach((category) => {
      if (category.score < 70) {
        nextSteps.push(category.action);
      }
    });

  // Add general next steps based on overall score
  if (readinessScore.overall >= 70) {
    nextSteps.push("Begin initial valuation assessment");
    nextSteps.push("Start assembling transaction advisory team");
  }

  return nextSteps;
}
