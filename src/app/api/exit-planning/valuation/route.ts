import { NextRequest, NextResponse } from "next/server";
import { exitPlanningAI } from "@/lib/ai/ai-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow unauthenticated for demo purposes, but log warning
    if (!session?.user) {
      console.warn("Unauthenticated valuation request");
    }

    const businessData = await request.json();

    // Validate required fields
    if (!businessData.revenue || !businessData.industry) {
      return NextResponse.json(
        { error: "Missing required fields: revenue and industry" },
        { status: 400 },
      );
    }

    // Use AI for valuation with fallback
    let valuation;
    try {
      const aiResult =
        await exitPlanningAI.generateValuationReport(businessData);
      valuation = {
        estimatedValue: aiResult.estimatedValue || businessData.revenue * 4,
        range: {
          low: aiResult.estimatedValue * 0.75 || businessData.revenue * 3,
          high: aiResult.estimatedValue * 1.25 || businessData.revenue * 5,
        },
        methodology: aiResult.method || "earnings-multiple",
        multiplier: aiResult.multiples?.earnings || 4,
        components: {
          earnings:
            (businessData.revenue * (businessData.profitMargin || 20)) / 100,
          assets: businessData.assets || businessData.revenue * 0.3,
          primaryValue: aiResult.estimatedValue || businessData.revenue * 4,
        },
        confidence: aiResult.confidence || 75,
        aiGenerated: true,
        multiples: aiResult.multiples,
        assumptions: aiResult.assumptions,
      };
    } catch (error) {
      console.error("AI valuation error:", error);
      // Fallback to rule-based calculation
      const { AIApiService } = await import("@/lib/ai-api");

      const fallbackService = new AIApiService();
      const fallbackValuation =
        await fallbackService.calculateValuation(businessData);
      valuation = {
        ...fallbackValuation,
        aiGenerated: false,
      };
    }

    return NextResponse.json({
      success: true,
      data: valuation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Valuation calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate valuation" },
      { status: 500 },
    );
  }
}
