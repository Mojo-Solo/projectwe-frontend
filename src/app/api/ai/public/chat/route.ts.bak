import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai/ai-service";

// Public endpoint for testing AI chat - no auth required
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    // Generate AI response
    const response = await aiService.generateChatResponse(messages);

    return NextResponse.json({
      message: response,
      timestamp: new Date(),
      note: "This is a public endpoint for testing. Production endpoints require authentication.",
    });
  } catch (error) {
    console.error("Public AI chat error:", error);

    // Provide a fallback response if AI services fail
    const fallbackResponse =
      "I'm currently unable to process your request. This could be due to API configuration. Please ensure all AI service API keys are properly configured in Doppler.";

    return NextResponse.json({
      message: fallbackResponse,
      timestamp: new Date(),
      error: true,
      details: error instanceof Error ? error.message : "Unknown error",
      note: "Fallback response due to AI service error",
    });
  }
}
