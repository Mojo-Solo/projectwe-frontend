import { NextRequest, NextResponse } from "next/server";
import { AIApiService } from "@/lib/ai-api";

export async function POST(request: NextRequest) {
  try {
    const { industry, region } = await request.json();

    if (!industry || !region) {
      return NextResponse.json(
        { error: "Missing required fields: industry, region" },
        { status: 400 },
      );
    }

    const aiService = new AIApiService();
    const marketAnalysis = await aiService.getMarketAnalysis(industry, region);

    return NextResponse.json({
      success: true,
      data: marketAnalysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Market analysis error:", error);
    return NextResponse.json(
      { error: "Failed to get market analysis" },
      { status: 500 },
    );
  }
}
