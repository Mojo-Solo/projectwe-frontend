import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // This will automatically redirect to login if not authenticated
    // or to dashboard if user doesn't have admin role
    const session = await requireAdmin();

    return NextResponse.json({
      message: "Admin access granted",
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        organizationId: session.user.organizationId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await request.json();

    // Example admin operation
    return NextResponse.json({
      message: "Admin operation completed",
      data: body,
      user: session.user.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
