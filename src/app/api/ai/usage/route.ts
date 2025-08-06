import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CostTracker, UsageMonitor } from "@/lib/ai/cost-tracking";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const costTracker = CostTracker.getInstance();
const usageMonitor = new UsageMonitor();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "month";
    const organizationId = url.searchParams.get("organizationId") || undefined;

    // Get usage dashboard data
    const dashboard = await usageMonitor.getUsageDashboard(
      session.user.id,
      organizationId,
    );

    return NextResponse.json(dashboard);
  } catch (error: any) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Failed to get usage data", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      provider,
      model,
      operation,
      inputTokens,
      outputTokens,
      sessionId,
      agentId,
      organizationId,
    } = body;

    if (
      !provider ||
      !model ||
      !operation ||
      inputTokens === undefined ||
      outputTokens === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Provider, model, operation, inputTokens, and outputTokens are required",
        },
        { status: 400 },
      );
    }

    // Check and record usage
    const result = await usageMonitor.checkAndRecordUsage({
      userId: session.user.id,
      provider,
      model,
      operation,
      inputTokens,
      outputTokens,
      sessionId,
      agentId,
      organizationId,
    });

    if (!result.withinLimits) {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          warnings: result.warnings,
          message: "Usage limit exceeded",
        },
        { status: 429 },
      ); // Too Many Requests
    }

    return NextResponse.json({
      success: true,
      allowed: true,
      usageId: result.recordId,
      warnings: result.warnings,
      cost: costTracker.calculateCost(
        provider,
        model,
        inputTokens,
        outputTokens,
      ),
    });
  } catch (error: any) {
    console.error("Usage recording API error:", error);
    return NextResponse.json(
      { error: "Failed to record usage", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { limits, organizationId } = body;

    if (!limits || typeof limits !== "object") {
      return NextResponse.json(
        {
          error: "Limits object is required",
        },
        { status: 400 },
      );
    }

    // Validate limits
    const validLimits = [
      "dailyTokens",
      "monthlyTokens",
      "dailyCost",
      "monthlyCost",
      "maxRequestsPerHour",
      "maxConcurrentSessions",
    ];
    const providedLimits = Object.keys(limits);

    for (const limit of providedLimits) {
      if (!validLimits.includes(limit)) {
        return NextResponse.json(
          {
            error: `Invalid limit: ${limit}. Valid limits are: ${validLimits.join(", ")}`,
          },
          { status: 400 },
        );
      }

      if (typeof limits[limit] !== "number" || limits[limit] < 0) {
        return NextResponse.json(
          {
            error: `Limit ${limit} must be a non-negative number`,
          },
          { status: 400 },
        );
      }
    }

    await costTracker.setUserLimits(session.user.id, limits, organizationId);

    return NextResponse.json({
      success: true,
      message: "Usage limits updated successfully",
      limits,
    });
  } catch (error: any) {
    console.error("Usage limits update API error:", error);
    return NextResponse.json(
      { error: "Failed to update usage limits", details: error.message },
      { status: 500 },
    );
  }
}
