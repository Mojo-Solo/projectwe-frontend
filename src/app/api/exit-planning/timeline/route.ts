import { NextRequest, NextResponse } from "next/server";
import { AIApiService } from "@/lib/ai-api";

export async function POST(request: NextRequest) {
  try {
    const exitStrategy = await request.json();

    const aiService = new AIApiService();
    const timeline = await aiService.generateTimeline(exitStrategy);

    return NextResponse.json({
      success: true,
      data: timeline,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Timeline generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate timeline" },
      { status: 500 },
    );
  }
}
