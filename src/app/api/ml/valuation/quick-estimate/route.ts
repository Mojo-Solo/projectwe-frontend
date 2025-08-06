import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

interface QuickEstimateRequest {
  annual_revenue: number;
  ebitda: number;
  industry: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: QuickEstimateRequest = await request.json();

    // Validate required fields
    if (!body.annual_revenue || !body.ebitda || !body.industry) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: annual_revenue, ebitda, and industry",
        },
        { status: 400 },
      );
    }

    // Validate numeric fields
    if (body.annual_revenue <= 0 || body.ebitda <= 0) {
      return NextResponse.json(
        { error: "Annual revenue and EBITDA must be positive numbers" },
        { status: 400 },
      );
    }

    // Forward the request to the ML service
    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/api/v1/valuation/quick-estimate?annual_revenue=${body.annual_revenue}&ebitda=${body.ebitda}&industry=${encodeURIComponent(body.industry)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken || ""}`,
        },
      },
    );

    if (!mlResponse.ok) {
      const errorData = await mlResponse
        .json()
        .catch(() => ({ error: "ML service error" }));
      return NextResponse.json(
        { error: errorData.error || "Quick estimate failed" },
        { status: mlResponse.status },
      );
    }

    const result = await mlResponse.json();

    // Add some Next.js specific formatting
    const enhancedResult = {
      ...result,
      processed_at: new Date().toISOString(),
      user_id: session.user.id,
      formatted_estimate: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(result.quick_estimate),
      formatted_range: result.estimate_range.map((value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value),
      ),
      input_data: {
        annual_revenue: body.annual_revenue,
        ebitda: body.ebitda,
        industry: body.industry,
      },
    };

    return NextResponse.json(enhancedResult);
  } catch (error) {
    console.error("Quick valuation estimate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Quick Valuation Estimate API",
    description:
      "Get a quick business valuation estimate using industry multiples",
    method: "POST",
    required_fields: ["annual_revenue", "ebitda", "industry"],
    supported_industries: [
      "technology",
      "healthcare",
      "manufacturing",
      "retail",
      "financial_services",
      "real_estate",
      "energy",
      "telecommunications",
      "consumer_goods",
      "industrial",
    ],
    example_request: {
      annual_revenue: 1000000,
      ebitda: 200000,
      industry: "technology",
    },
  });
}
