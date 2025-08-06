import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/config";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { returnUrl } = body;

    // Get user's Stripe customer ID
    const customerId = (session.user as any).stripeCustomerId;
    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 404 },
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url:
        returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      configuration: STRIPE_CONFIG.portalConfigurationId,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
