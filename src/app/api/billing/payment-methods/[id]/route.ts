import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe/config";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: paymentMethodId } = await params;

    // Verify the payment method belongs to the user
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const customerId = (session.user as any).stripeCustomerId;
    if (!customerId || paymentMethod.customer !== customerId) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 },
      );
    }

    // Check if this is the default payment method
    const customer = await stripe.customers.retrieve(customerId);
    if (typeof customer !== "string" && "invoice_settings" in customer) {
      const defaultPaymentMethodId =
        customer.invoice_settings?.default_payment_method;
      if (defaultPaymentMethodId === paymentMethodId) {
        return NextResponse.json(
          { error: "Cannot delete default payment method" },
          { status: 400 },
        );
      }
    }

    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 },
    );
  }
}
