import { NextRequest, NextResponse } from "next/server";
import { ExitPlanningService } from "@/lib/ai-api";

export async function POST(request: NextRequest) {
  try {
    const businessData = await request.json();

    // Validate required fields for comprehensive analysis
    if (!businessData.revenue || !businessData.industry) {
      return NextResponse.json(
        { error: "Missing required fields for comprehensive analysis" },
        { status: 400 },
      );
    }

    const exitPlanningService = new ExitPlanningService();
    const comprehensiveAnalysis =
      await exitPlanningService.getComprehensiveAnalysis(businessData);

    return NextResponse.json({
      success: true,
      data: comprehensiveAnalysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Comprehensive analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate comprehensive analysis" },
      { status: 500 },
    );
  }
}
