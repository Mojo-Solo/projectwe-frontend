import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { exitPlans, buyerInteractions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... buyer profiles and matching logic remain the same

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract search params
    const searchParams = request.nextUrl.searchParams;
    const exitPlanId = searchParams.get("exitPlanId");
    const buyerType = searchParams.get("buyerType");
    const minScore = searchParams.get("minScore");

    let exitPlan = null;
    if (exitPlanId) {
      [exitPlan] = await db
        .select()
        .from(exitPlans)
        .where(
          and(
            eq(exitPlans.id, exitPlanId),
            eq(exitPlans.organizationId, session.user.organizationId),
          ),
        )
        .limit(1);
    }

    // ... matching logic remains the same

    const savedInteractions = await db
      .select()
      .from(buyerInteractions)
      .where(
        and(
          exitPlanId ? eq(buyerInteractions.exitPlanId, exitPlanId) : undefined,
          eq(buyerInteractions.organizationId, session.user.organizationId),
        ),
      );

    // ... response generation remains the same
  } catch (error) {
    // ... error handling remains the same
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { buyerId, exitPlanId, action, notes } = await request.json();

    const [interaction] = await db
      .insert(buyerInteractions)
      .values({
        buyerId,
        exitPlanId,
        organizationId: session.user.organizationId,
        userId: session.user.id,
        action,
        notes,
        status: "active",
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: interaction,
    });
  } catch (error) {
    // ... error handling remains the same
  }
}
