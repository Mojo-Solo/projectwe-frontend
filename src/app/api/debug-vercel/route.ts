import { NextResponse } from "next/server";

export const runtime = "edge"; // Use edge runtime for better debugging

export async function GET() {
  const debugInfo = {
    message: "Vercel Debug Endpoint",
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
    },
    headers: {
      host: process.env.VERCEL_URL || "unknown",
    },
    apiRoutes: {
      test: "/api/test",
      ping: "/api/ping",
      hello: "/api/hello",
      health: "/api/health",
    },
  };

  return NextResponse.json(debugInfo, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Debug-Route": "true",
    },
  });
}
