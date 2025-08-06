import { NextResponse } from "next/server";

// Force dynamic rendering to prevent static generation during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

  // Test OpenAI connectivity if key exists
  let openaiStatus = "missing";
  if (hasOpenAIKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        signal: AbortSignal.timeout(3000),
      });
      openaiStatus = response.ok ? "healthy" : "error";
    } catch (error) {
      openaiStatus = "unreachable";
    }
  }

  const healthReport = {
    status: hasOpenAIKey && hasDatabaseUrl ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    services: {
      openai: openaiStatus,
      database: hasDatabaseUrl ? "configured" : "missing",
      authentication: hasNextAuthSecret ? "configured" : "missing",
      mlService: "using-direct-openai",
    },
    integration: {
      next_js: {
        status: "healthy",
        version: process.env.npm_package_version || "1.0.0",
      },
      environment: process.env.NODE_ENV || "development",
    },
    endpoints: {
      "POST /api/ml/exit-readiness": "Exit readiness analysis",
      "POST /api/ml/documents/analyze": "Document analysis",
      "POST /api/ml/valuation/analyze": "Business valuation analysis",
      "GET /api/ml/health": "Health check",
    },
    deployment: {
      mode: "direct-openai",
      note: "ML service integrated directly with OpenAI API",
    },
  };

  const statusCode = healthReport.status === "healthy" ? 200 : 503;
  return NextResponse.json(healthReport, { status: statusCode });
}
