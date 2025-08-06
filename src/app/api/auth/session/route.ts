import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-simple";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: session.user,
      expires: session.expires,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
