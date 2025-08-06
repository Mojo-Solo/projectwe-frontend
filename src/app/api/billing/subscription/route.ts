import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe, getPriceId } from "@/lib/stripe/config";
import { db } from "@/lib/database";
import { subscriptions } from "@/db/schema";
import { and, eq, inArray, desc } from "drizzle-orm";
import type {
  SubscriptionPlan,
  BillingInterval,
  Subscription,
} from "@/types/billing";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getSubscriptionFromDatabase(session.user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 },
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, billingInterval } = body as {
      plan?: SubscriptionPlan;
      billingInterval?: BillingInterval;
    };

    if (!plan || !billingInterval) {
      return NextResponse.json(
        { error: "Plan and billing interval are required" },
        { status: 400 },
      );
    }

    const currentSubscription = await getSubscriptionFromDatabase(
      session.user.id,
    );
    if (!currentSubscription || !currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const priceId = getPriceId(plan, billingInterval);
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or billing interval" },
        { status: 400 },
      );
    }

    // Get current subscription from Stripe to get the item ID
    const stripeSubscription = await stripe.subscriptions.retrieve(
      currentSubscription.stripeSubscriptionId,
    );

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
      },
    );

    // Update subscription in database
    await updateSubscriptionInDatabase(session.user.id, {
      stripePriceId: priceId,
    });

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentSubscription = await getSubscriptionFromDatabase(
      session.user.id,
    );
    if (!currentSubscription || !currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const canceledSubscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    await updateSubscriptionInDatabase(session.user.id, {
      cancelAtPeriodEnd: true,
    });

    return NextResponse.json({
      message: "Subscription will be canceled at the end of the billing period",
      cancelAt: new Date(canceledSubscription.cancel_at! * 1000),
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}

// Helper functions
async function getSubscriptionFromDatabase(userId: string) {
  const subscriptionResult = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return subscriptionResult[0];
}

async function updateSubscriptionInDatabase(
  userId: string,
  updates: Partial<{
    status: "active" | "canceled" | "past_due" | "unpaid";
    cancelAtPeriodEnd: boolean;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripePriceId: string;
  }>,
) {
  await db
    .update(subscriptions)
    .set(updates)
    .where(eq(subscriptions.userId, userId));
}
