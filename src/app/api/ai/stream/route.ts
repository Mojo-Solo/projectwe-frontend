import { NextRequest } from "next/server";
import { AIService } from "@/lib/ai/service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const aiService = new AIService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  defaultProvider: "openai",
  enableCache: false, // Disable cache for streaming
  circuitBreakerOptions: {
    failureThreshold: 5,
    recoveryTimeout: 60000,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message, sessionId, agentId, options = {} } = body;

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    // Initialize AI service if not already done
    if (!aiService.getSession(sessionId)) {
      await aiService.initialize();
    }

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const context = await aiService.createSession(
        session.user.id,
        "default-workspace",
        agentId ? [agentId] : ["strategy"],
      );
      currentSessionId = context.conversationId;
    }

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          // Send initial session info
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "session",
                sessionId: currentSessionId,
                timestamp: new Date().toISOString(),
              })}\n\n`,
            ),
          );

          // Stream the AI response
          const streamGenerator = aiService.streamMessage(
            currentSessionId,
            message,
            agentId,
            options,
          );

          for await (const chunk of streamGenerator) {
            const data = {
              type: "message",
              message: chunk,
              timestamp: new Date().toISOString(),
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
            );
          }

          // Send completion signal
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "complete",
                sessionId: currentSessionId,
                providerStatus: aiService.getProviderStatus(),
                timestamp: new Date().toISOString(),
              })}\n\n`,
            ),
          );

          controller.close();
        } catch (error: any) {
          console.error("Streaming error:", error);
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: error.message,
                timestamp: new Date().toISOString(),
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error: any) {
    console.error("Stream API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to start stream",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
