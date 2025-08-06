import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-simple";

export async function GET() {
  return NextResponse.json({
    message: "Auth debug endpoint",
    hasAuthOptions: !!authOptions,
    providers:
      authOptions?.providers?.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
      })) || [],
    pages: authOptions?.pages || {},
    session: {
      strategy: authOptions?.session?.strategy,
      maxAge: authOptions?.session?.maxAge,
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleCreds: !!(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
      NODE_ENV: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  });
}
