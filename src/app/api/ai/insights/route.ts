import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { and, eq, gte, sql } from "drizzle-orm";
import {
  tasks as tasksSchema,
  documents as documentsSchema,
  analyticsEvents as analyticsEventsSchema,
} from "@/db/schema";
import { generateInsight } from "@/lib/ai/insight-generator";

// Force dynamic rendering to prevent static export errors
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [recentTasks, recentDocuments, analyticsData] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasksSchema)
        .where(
          and(
            eq(tasksSchema.organizationId, session.user.organizationId),
            eq(tasksSchema.status, "TODO"),
          ),
        )
        .then((res) => res[0]?.count || 0),
      db
        .select({ count: sql<number>`count(*)` })
        .from(documentsSchema)
        .where(
          and(
            eq(documentsSchema.organizationId, session.user.organizationId),
            gte(
              documentsSchema.createdAt,
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            ),
          ),
        )
        .then((res) => res[0]?.count || 0),
      db
        .select({
          eventType: analyticsEventsSchema.eventType,
          count: sql<number>`count(*)`,
        })
        .from(analyticsEventsSchema)
        .where(
          and(
            eq(
              analyticsEventsSchema.organizationId,
              session.user.organizationId,
            ),
            gte(
              analyticsEventsSchema.timestamp,
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            ),
          ),
        )
        .groupBy(analyticsEventsSchema.eventType),
    ]);

    const insights = [];

    if (recentTasks > 0) {
      insights.push({
        id: `insight-tasks-${Date.now()}`,
        type: "tasks",
        priority: recentTasks > 10 ? "high" : "medium",
        title: "Task Management Update",
        description: `You have ${recentTasks} active tasks. ${recentTasks > 10 ? "Consider prioritizing or delegating some tasks to maintain focus." : "Great job keeping tasks manageable!"}`,
        actionable: true,
        action: {
          label: "View Tasks",
          href: "/dashboard/tasks",
        },
        createdAt: new Date(),
      });
    }

    if (recentDocuments > 0) {
      insights.push({
        id: `insight-docs-${Date.now()}`,
        type: "documents",
        priority: "medium",
        title: "Document Activity",
        description: `${recentDocuments} documents uploaded in the last 30 days. ${recentDocuments > 5 ? "Your document repository is growing well." : "Consider uploading more business documents for better analysis."}`,
        actionable: recentDocuments < 5,
        action:
          recentDocuments < 5
            ? {
                label: "Upload Documents",
                href: "/dashboard/documents",
              }
            : undefined,
        createdAt: new Date(),
      });
    }

    insights.push({
      id: `insight-market-${Date.now()}`,
      type: "market",
      priority: "medium",
      title: "Market Conditions",
      description:
        "Current market conditions show moderate M&A activity in your sector. Consider preparing key documentation to be ready when optimal opportunities arise.",
      actionable: true,
      action: {
        label: "View Market Analysis",
        href: "/dashboard/exit-planning/market-analysis",
      },
      createdAt: new Date(),
    });

    const allInsights = insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (
        priorityOrder[a.priority as keyof typeof priorityOrder] !==
        priorityOrder[b.priority as keyof typeof priorityOrder]
      ) {
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: allInsights.slice(0, 10),
    });
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
