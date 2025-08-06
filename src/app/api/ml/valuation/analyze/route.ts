import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

interface ValuationRequest {
  business_metrics: {
    annual_revenue: number;
    ebitda: number;
    net_income: number;
    total_assets: number;
    total_liabilities: number;
    cash_flow: number;
    revenue_growth_rate: number;
    profit_margin: number;
    asset_turnover: number;
    debt_to_equity: number;
    current_ratio: number;
    return_on_assets: number;
    return_on_equity: number;
    working_capital: number;
    years_in_business: number;
    employee_count: number;
    market_share?: number;
    customer_retention_rate?: number;
    recurring_revenue_percentage?: number;
  };
  market_context: {
    industry: string;
    region: string;
    market_size: number;
    market_growth_rate: number;
    competitive_intensity: number;
    economic_conditions?: string;
    interest_rates?: number;
    market_volatility?: number;
  };
  method?:
    | "multiple_based"
    | "discounted_cash_flow"
    | "asset_based"
    | "market_based"
    | "hybrid_approach";
  organization_id?: string;
  project_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ValuationRequest = await request.json();

    // Validate required fields
    if (!body.business_metrics || !body.market_context) {
      return NextResponse.json(
        {
          error: "Missing required fields: business_metrics and market_context",
        },
        { status: 400 },
      );
    }

    // Add user context to the request
    const enhancedRequest = {
      ...body,
      organization_id: body.organization_id || session.user.organizationId,
      project_id: body.project_id,
    };

    // Forward the request to the ML service
    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/api/v1/valuation/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken || ""}`,
        },
        body: JSON.stringify(enhancedRequest),
      },
    );

    if (!mlResponse.ok) {
      const errorData = await mlResponse
        .json()
        .catch(() => ({ error: "ML service error" }));
      return NextResponse.json(
        { error: errorData.error || "Valuation analysis failed" },
        { status: mlResponse.status },
      );
    }

    const result = await mlResponse.json();

    // Add some Next.js specific metadata
    const enhancedResult = {
      ...result,
      processed_at: new Date().toISOString(),
      user_id: session.user.id,
      organization_id: session.user.organizationId,
      formatted_valuation: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(result.primary_valuation),
    };

    return NextResponse.json(enhancedResult);
  } catch (error) {
    console.error("Valuation analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Business Valuation API",
    description:
      "Comprehensive business valuation using multiple methodologies",
    methods: [
      "multiple_based",
      "discounted_cash_flow",
      "asset_based",
      "market_based",
      "hybrid_approach",
    ],
    required_fields: {
      business_metrics: [
        "annual_revenue",
        "ebitda",
        "net_income",
        "total_assets",
        "total_liabilities",
        "cash_flow",
        "revenue_growth_rate",
        "profit_margin",
        "asset_turnover",
        "debt_to_equity",
        "current_ratio",
        "return_on_assets",
        "return_on_equity",
        "working_capital",
        "years_in_business",
        "employee_count",
      ],
      market_context: [
        "industry",
        "region",
        "market_size",
        "market_growth_rate",
        "competitive_intensity",
      ],
    },
    optional_fields: {
      business_metrics: [
        "market_share",
        "customer_retention_rate",
        "recurring_revenue_percentage",
      ],
      market_context: [
        "economic_conditions",
        "interest_rates",
        "market_volatility",
      ],
    },
  });
}
