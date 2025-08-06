import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EmailAnalyticsService } from "@/lib/email/analytics/email-analytics";

// Initialize analytics service
const analyticsService = new EmailAnalyticsService();

// Request schemas
const DateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const AnalyticsFiltersSchema = z.object({
  emailTypes: z
    .array(
      z.enum([
        "welcome",
        "onboarding_sequence",
        "exit_readiness_results",
        "document_analysis_complete",
        "task_assignment",
        "task_update",
        "billing_notification",
        "subscription_update",
        "password_reset",
        "security_alert",
        "system_notification",
        "marketing",
      ]),
    )
    .optional(),
  categories: z
    .array(
      z.enum([
        "account",
        "notifications",
        "task_updates",
        "analysis_results",
        "billing",
        "marketing",
        "product_updates",
        "educational",
      ]),
    )
    .optional(),
  userIds: z.array(z.string().uuid()).optional(),
  templateIds: z.array(z.string()).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  status: z
    .array(
      z.enum([
        "pending",
        "sending",
        "sent",
        "failed",
        "bounced",
        "delivered",
        "opened",
        "clicked",
      ]),
    )
    .optional(),
});

const MetricsRequestSchema = z.object({
  dateRange: DateRangeSchema.optional(),
  filters: AnalyticsFiltersSchema.optional(),
});

const PeriodMetricsSchema = z.object({
  period: z.enum(["hour", "day", "week", "month"]),
  count: z.number().int().min(1).max(365),
  filters: AnalyticsFiltersSchema.optional(),
});

// GET - Retrieve email analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || "overview";

    switch (action) {
      case "overview":
        return handleOverviewRequest(searchParams);

      case "metrics":
        return handleMetricsRequest(searchParams);

      case "period":
        return handlePeriodRequest(searchParams);

      case "trends":
        return handleTrendsRequest(searchParams);

      case "templates":
        return handleTemplatesRequest(searchParams);

      case "bounces":
        return handleBouncesRequest(searchParams);

      case "realtime":
        return handleRealtimeRequest();

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Email analytics request failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Analytics request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST - Get analytics with complex filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "metrics":
        return handlePostMetricsRequest(body);

      case "period":
        return handlePostPeriodRequest(body);

      case "comparison":
        return handleComparisonRequest(body);

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Email analytics POST request failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Analytics request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Handler functions
async function handleOverviewRequest(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get("days") || "30");
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const [overallMetrics, realtimeMetrics, topTemplates, engagementTrends] =
    await Promise.all([
      analyticsService.getMetricsByDateRange(startDate, endDate),
      analyticsService.getRealTimeMetrics(),
      analyticsService.getTopPerformingTemplates(5, { startDate, endDate }),
      analyticsService.getEngagementTrends({ startDate, endDate }),
    ]);

  return NextResponse.json({
    success: true,
    overview: {
      period: `${days} days`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      overallMetrics,
      realtimeMetrics,
      topTemplates,
      engagementTrends,
    },
  });
}

async function handleMetricsRequest(searchParams: URLSearchParams) {
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userId = searchParams.get("userId");
  const templateId = searchParams.get("templateId");
  const emailType = searchParams.get("emailType");
  const category = searchParams.get("category");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 },
    );
  }

  const dateRange = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };

  let metrics;

  if (userId) {
    metrics = await analyticsService.getMetricsByUser(userId, dateRange);
  } else if (templateId) {
    metrics = await analyticsService.getMetricsByTemplate(
      templateId,
      dateRange,
    );
  } else if (emailType) {
    metrics = await analyticsService.getMetricsByEmailType(
      emailType as any,
      dateRange,
    );
  } else if (category) {
    metrics = await analyticsService.getMetricsByCategory(
      category as any,
      dateRange,
    );
  } else {
    metrics = await analyticsService.getMetricsByDateRange(
      dateRange.startDate,
      dateRange.endDate,
    );
  }

  return NextResponse.json({
    success: true,
    metrics,
    dateRange,
    filters: { userId, templateId, emailType, category },
  });
}

async function handlePeriodRequest(searchParams: URLSearchParams) {
  const period = searchParams.get("period") as
    | "hour"
    | "day"
    | "week"
    | "month";
  const count = parseInt(searchParams.get("count") || "7");

  if (!period || !["hour", "day", "week", "month"].includes(period)) {
    return NextResponse.json(
      { error: "Valid period is required (hour, day, week, month)" },
      { status: 400 },
    );
  }

  const periodMetrics = await analyticsService.getMetricsByPeriod(
    period,
    count,
  );

  return NextResponse.json({
    success: true,
    period,
    count,
    data: periodMetrics,
  });
}

async function handleTrendsRequest(searchParams: URLSearchParams) {
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 },
    );
  }

  const trends = await analyticsService.getEngagementTrends({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  return NextResponse.json({
    success: true,
    trends,
  });
}

async function handleTemplatesRequest(searchParams: URLSearchParams) {
  const limit = parseInt(searchParams.get("limit") || "10");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const dateRange =
    startDate && endDate
      ? {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      : undefined;

  const topTemplates = await analyticsService.getTopPerformingTemplates(
    limit,
    dateRange,
  );

  return NextResponse.json({
    success: true,
    topTemplates,
    limit,
    dateRange,
  });
}

async function handleBouncesRequest(searchParams: URLSearchParams) {
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const dateRange =
    startDate && endDate
      ? {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      : undefined;

  const bounceReasons = await analyticsService.getBounceReasons(dateRange);

  return NextResponse.json({
    success: true,
    bounceReasons,
    dateRange,
  });
}

async function handleRealtimeRequest() {
  const realtimeMetrics = await analyticsService.getRealTimeMetrics();

  return NextResponse.json({
    success: true,
    realtime: realtimeMetrics,
    timestamp: new Date().toISOString(),
  });
}

async function handlePostMetricsRequest(body: any) {
  const validatedData = MetricsRequestSchema.parse(body);

  const startDate = validatedData.dateRange?.startDate
    ? new Date(validatedData.dateRange.startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const endDate = validatedData.dateRange?.endDate
    ? new Date(validatedData.dateRange.endDate)
    : new Date();

  const metrics = await analyticsService.getMetricsByDateRange(
    startDate,
    endDate,
    validatedData.filters,
  );

  return NextResponse.json({
    success: true,
    metrics,
    dateRange: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    filters: validatedData.filters,
  });
}

async function handlePostPeriodRequest(body: any) {
  const validatedData = PeriodMetricsSchema.parse(body);

  const periodMetrics = await analyticsService.getMetricsByPeriod(
    validatedData.period,
    validatedData.count,
    validatedData.filters,
  );

  return NextResponse.json({
    success: true,
    period: validatedData.period,
    count: validatedData.count,
    data: periodMetrics,
    filters: validatedData.filters,
  });
}

async function handleComparisonRequest(body: any) {
  const schema = z.object({
    currentPeriod: DateRangeSchema,
    comparisonPeriod: DateRangeSchema,
    filters: AnalyticsFiltersSchema.optional(),
  });

  const validatedData = schema.parse(body);

  const [currentMetrics, comparisonMetrics] = await Promise.all([
    analyticsService.getMetricsByDateRange(
      new Date(validatedData.currentPeriod.startDate),
      new Date(validatedData.currentPeriod.endDate),
      validatedData.filters,
    ),
    analyticsService.getMetricsByDateRange(
      new Date(validatedData.comparisonPeriod.startDate),
      new Date(validatedData.comparisonPeriod.endDate),
      validatedData.filters,
    ),
  ]);

  // Calculate percentage changes
  const percentageChanges = {
    sent: calculatePercentageChange(
      comparisonMetrics.sent,
      currentMetrics.sent,
    ),
    delivered: calculatePercentageChange(
      comparisonMetrics.delivered,
      currentMetrics.delivered,
    ),
    opened: calculatePercentageChange(
      comparisonMetrics.opened,
      currentMetrics.opened,
    ),
    clicked: calculatePercentageChange(
      comparisonMetrics.clicked,
      currentMetrics.clicked,
    ),
    deliveryRate: calculatePercentageChange(
      comparisonMetrics.deliveryRate,
      currentMetrics.deliveryRate,
    ),
    openRate: calculatePercentageChange(
      comparisonMetrics.openRate,
      currentMetrics.openRate,
    ),
    clickRate: calculatePercentageChange(
      comparisonMetrics.clickRate,
      currentMetrics.clickRate,
    ),
    bounceRate: calculatePercentageChange(
      comparisonMetrics.bounceRate,
      currentMetrics.bounceRate,
    ),
  };

  return NextResponse.json({
    success: true,
    comparison: {
      current: {
        period: validatedData.currentPeriod,
        metrics: currentMetrics,
      },
      previous: {
        period: validatedData.comparisonPeriod,
        metrics: comparisonMetrics,
      },
      changes: percentageChanges,
    },
  });
}

function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return newValue > 0 ? 100 : 0;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}
