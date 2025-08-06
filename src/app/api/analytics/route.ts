import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  analyticsAggregator,
  TimeRange,
} from "@/lib/analytics/data-aggregation";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Convert aggregated data to the format expected by the frontend
function transformAnalyticsData(data: any) {
  return {
    userBehavior: {
      pageViews: data.userEngagement.pageViews,
      uniqueUsers: data.userEngagement.uniqueUsers,
      avgSessionDuration: Math.round(data.userEngagement.avgSessionDuration),
      bounceRate: Math.round(data.userEngagement.bounceRate),
      topPages: data.userEngagement.topPages.map((page: any) => ({
        page: page.path,
        views: page.views,
      })),
      userFlow: [], // This would need additional modeling for user flow data
    },
    documentMetrics: {
      totalDocuments: data.documentUsage.totalDocuments,
      documentsAnalyzed: data.documentUsage.documentsAnalyzed,
      avgProcessingTime: data.documentUsage.avgProcessingTime / 1000, // convert ms to seconds
      documentTypes: data.documentUsage.topDocumentTypes.map((type: any) => ({
        type:
          type.type.charAt(0).toUpperCase() + type.type.slice(1).toLowerCase(),
        count: type.count,
      })),
    },
    aiInteractions: {
      totalQueries: data.aiInteractions.totalQueries,
      avgResponseTime: data.aiInteractions.avgResponseTime,
      satisfactionRate: Math.round(data.aiInteractions.satisfactionRate * 20), // convert 1-5 to percentage
      topQueries: data.aiInteractions.topQueryTypes.map((query: any) => ({
        query: `${query.type} queries`,
        count: query.count,
      })),
    },
    businessMetrics: {
      valuationsCalculated: data.businessMetrics.valuationsCalculated,
      reportsGenerated: data.businessMetrics.reportsGenerated,
      avgValuationTime: data.businessMetrics.avgValuationTime,
      conversionRate: Math.round(data.businessMetrics.conversionRate),
    },
    exitPlanning: data.exitPlanning,
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get time range from query params
    const searchParams = request.nextUrl.searchParams;
    const timeRange = (searchParams.get("range") || "7d") as TimeRange;
    const metricType = searchParams.get("metric");

    // Get organization ID from session or query params
    const organizationId =
      session.user.organizationId || searchParams.get("organizationId");
    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 },
      );
    }

    // Check permissions - allow users to see their own org data, admins can see any org
    if (
      session.user.role !== "admin" &&
      session.user.organizationId !== organizationId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Aggregate analytics data
    const analyticsQuery = {
      organizationId,
      timeRange,
      userId: session.user.role !== "admin" ? session.user.id : undefined,
    };

    let analyticsData;

    // If specific metric requested, return only that metric
    if (metricType) {
      switch (metricType) {
        case "user_engagement":
          analyticsData = {
            userEngagement:
              await analyticsAggregator.aggregateUserEngagement(analyticsQuery),
          };
          break;
        case "document_usage":
          analyticsData = {
            documentUsage:
              await analyticsAggregator.aggregateDocumentUsage(analyticsQuery),
          };
          break;
        case "ai_interactions":
          analyticsData = {
            aiInteractions:
              await analyticsAggregator.aggregateAiInteractions(analyticsQuery),
          };
          break;
        case "business_metrics":
          analyticsData = {
            businessMetrics:
              await analyticsAggregator.aggregateBusinessMetrics(
                analyticsQuery,
              ),
          };
          break;
        case "exit_planning":
          analyticsData = {
            exitPlanning:
              await analyticsAggregator.aggregateExitPlanning(analyticsQuery),
          };
          break;
        default:
          return NextResponse.json(
            { error: "Invalid metric type" },
            { status: 400 },
          );
      }
    } else {
      // Return all metrics
      analyticsData =
        await analyticsAggregator.aggregateAllMetrics(analyticsQuery);
    }

    // Transform data for frontend compatibility
    const transformedData = transformAnalyticsData(analyticsData);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}

// Export analytics data for reports
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { format, timeRange, sections, organizationId } =
      await request.json();

    // Get organization ID from session or request
    const targetOrgId = organizationId || session.user.organizationId;
    if (!targetOrgId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 },
      );
    }

    // Check permissions
    if (
      session.user.role !== "admin" &&
      session.user.organizationId !== targetOrgId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get analytics data for export
    const analyticsQuery = {
      organizationId: targetOrgId,
      timeRange: (timeRange || "7d") as TimeRange,
      userId: session.user.role !== "admin" ? session.user.id : undefined,
    };

    const analyticsData =
      await analyticsAggregator.aggregateAllMetrics(analyticsQuery);

    // Generate export based on format
    if (format === "csv") {
      const { analyticsExportService } = await import(
        "@/lib/analytics/export-service"
      );

      const csvData = analyticsExportService.generateCSV(analyticsData, {
        format: "csv",
        timeRange,
        sections,
        organizationName: session.user.organizationId || "Organization",
      });

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics-${timeRange}-${Date.now()}.csv"`,
        },
      });
    }

    // For PDF or other formats, return the data for client-side processing
    return NextResponse.json({
      data: analyticsData,
      organizationName: session.user.organizationId || "Organization",
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics export error:", error);
    return NextResponse.json(
      { error: "Failed to export analytics data" },
      { status: 500 },
    );
  }
}
