import { NextRequest, NextResponse } from "next/server";
import { AIApiService } from "@/lib/ai-api";

// Public endpoint for testing - no auth required
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Use the existing AI API service
    const aiService = new AIApiService();
    const valuation = await aiService.calculateValuation(data);

    return NextResponse.json({
      success: true,
      data: valuation,
      timestamp: new Date(),
      note: "This is a public endpoint for testing. Production endpoints require authentication.",
    });
  } catch (error) {
    console.error("Public valuation error:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate valuation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
