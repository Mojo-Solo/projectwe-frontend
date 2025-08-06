import { NextRequest, NextResponse } from "next/server";
import { exitPlanningAI } from "@/lib/ai/ai-service";
import { getServerSession } from "next-auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessData = await request.json();

    // Validate required fields
    if (!businessData.revenue || !businessData.industry) {
      return NextResponse.json(
        { error: "Missing required fields: revenue and industry" },
        { status: 400 },
      );
    }

    // Generate AI-powered valuation
    const valuation =
      await exitPlanningAI.generateValuationReport(businessData);

    // Track usage
    await exitPlanningAI.trackUsage({
      type: "analysis",
      tokens: 2000, // Estimate for valuation reports
      model: "gpt-4-turbo-preview",
      userId: session.user.id,
      organizationId: session.user.organizationId,
    });

    return NextResponse.json({
      success: true,
      data: valuation,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Valuation API error:", error);

    // Fallback to rule-based calculation
    const fallbackService = new (await import("@/lib/ai-api")).AIApiService();

    const fallbackValuation = await fallbackService.calculateValuation(
      await request.json(),
    );

    return NextResponse.json({
      success: true,
      data: {
        ...fallbackValuation,
        aiGenerated: false,
        message:
          "Using rule-based calculations due to AI service unavailability",
      },
      timestamp: new Date(),
    });
  }
}
