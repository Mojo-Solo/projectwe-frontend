import { NextRequest, NextResponse } from "next/server";
import { AIApiService } from "@/lib/ai-api";

export async function POST(request: NextRequest) {
  try {
    const exitPlan = await request.json();

    const aiService = new AIApiService();
    const risks = await aiService.assessRisks(exitPlan);

    return NextResponse.json({
      success: true,
      data: risks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Risk assessment error:", error);
    return NextResponse.json(
      { error: "Failed to assess risks" },
      { status: 500 },
    );
  }
}
