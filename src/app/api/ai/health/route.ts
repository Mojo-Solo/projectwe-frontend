import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      openai: hasOpenAIKey ? "configured" : "missing",
      anthropic: hasAnthropicKey ? "configured" : "missing",
    },
  });
}
