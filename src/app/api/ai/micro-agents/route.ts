import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { MicroAgentOrchestrator } from "@/lib/ai/micro-agents";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const aiService = new AIService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  defaultProvider: "openai",
  enableCache: true,
  circuitBreakerOptions: {
    failureThreshold: 5,
    recoveryTimeout: 60000,
  },
});

const microAgents = new MicroAgentOrchestrator(aiService);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agents = microAgents.getAllAgents();
    return NextResponse.json({
      agents: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        capabilities: agent.capabilities,
      })),
    });
  } catch (error: any) {
    console.error("Micro-agents list API error:", error);
    return NextResponse.json(
      { error: "Failed to get agents", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { agentId, input, context } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 },
      );
    }

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    await aiService.initialize();

    const result = await microAgents.executeAgent(agentId, input, context);

    return NextResponse.json({
      agentId,
      success: true,
      result,
      timestamp: new Date().toISOString(),
      providerStatus: aiService.getProviderStatus(),
    });
  } catch (error: any) {
    console.error("Micro-agent execution API error:", error);
    return NextResponse.json(
      {
        error: "Failed to execute agent",
        details: error.message,
        agentId: request.url.includes("agentId")
          ? new URL(request.url).searchParams.get("agentId")
          : undefined,
      },
      { status: 500 },
    );
  }
}
