import { NextRequest, NextResponse } from "next/server";
import { requireAdvisor } from "@/lib/auth-helpers";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // This will allow ADVISOR, ADMIN, and SUPER_ADMIN roles
    const session = await requireAdvisor();

    return NextResponse.json({
      message: "Advisor access granted",
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        organizationId: session.user.organizationId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Advisor route error:", error);
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
}
