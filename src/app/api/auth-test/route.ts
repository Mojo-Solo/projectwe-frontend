import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-simple";

// Force dynamic rendering to prevent static export errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      message: "Auth API is working",
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        organizationId: session.user.organizationId,
      } : null,
      env: {
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      { 
        error: "Authentication test failed", 
        authenticated: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
