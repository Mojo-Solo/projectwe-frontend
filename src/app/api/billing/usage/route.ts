import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  workspaces,
  workspaceMembers,
  usageEvents,
  documents,
  subscriptions,
} from "@/db/schema";
import { and, eq, sql, sum, count, gte, lte } from "drizzle-orm";
import { PLANS } from "@/types/billing";
import type { UsageMetrics } from "@/types/billing";

// Force dynamic rendering to prevent static export errors
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization ID from query params or user session
    const { searchParams } = new URL(request.url);
    const organizationId =
      searchParams.get("organizationId") || session.user.organizationId;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 },
      );
    }

    const metrics = await getUsageMetrics(organizationId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching usage metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage metrics" },
      { status: 500 },
    );
  }
}

async function getSubscriptionForOrganization(organizationId: string) {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))
      .limit(1);

    return subscription || null;
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

// Helper function to map Stripe price ID to plan name
function getPlanFromPriceId(stripePriceId: string): string {
  const priceIdToPlan: Record<string, string> = {
    [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!]: "starter",
    [process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!]: "starter",
    [process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID!]: "professional",
    [process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID!]: "professional",
    [process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!]: "enterprise",
    [process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID!]: "enterprise",
  };
  return priceIdToPlan[stripePriceId] || "starter";
}

async function getUsageMetrics(organizationId: string): Promise<UsageMetrics> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [workspaceCount, userCount, aiUsage, storageUsage, subscription] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(workspaces)
        .where(eq(workspaces.organizationId, organizationId)),
      db
        .select({ count: count() })
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, organizationId),
            eq(workspaceMembers.status, "active"),
          ),
        ),
      db
        .select({ sum: sum(usageEvents.amount) })
        .from(usageEvents)
        .where(
          and(
            eq(usageEvents.organizationId, organizationId),
            eq(usageEvents.type, "ai_tokens"),
            gte(usageEvents.createdAt, startOfMonth),
            lte(usageEvents.createdAt, now),
          ),
        ),
      db
        .select({ sum: sum(documents.fileSize) })
        .from(documents)
        .where(eq(documents.organizationId, organizationId)),
      getSubscriptionForOrganization(organizationId),
    ]);

  const planName = subscription
    ? getPlanFromPriceId(subscription.stripePriceId)
    : "starter";
  const plan = (PLANS as any)[planName] || PLANS.starter;
  const limits = plan?.limits || PLANS.starter.limits;

  return {
    organizationId,
    period: {
      start: startOfMonth,
      end: now,
    },
    workspaces: {
      current: workspaceCount[0].count,
      limit: limits.workspaces,
    },
    users: {
      current: userCount[0].count,
      limit: limits.users,
    },
    aiTokens: {
      used: Number(aiUsage[0].sum) || 0,
      limit: limits.aiTokensPerMonth,
    },
    documentStorage: {
      usedGB: (Number(storageUsage[0].sum) || 0) / (1024 * 1024 * 1024),
      limitGB: limits.documentStorageGB,
    },
    updatedAt: now,
  };
}
