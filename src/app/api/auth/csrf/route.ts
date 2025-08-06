import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  // Generate a CSRF token
  const csrfToken = crypto.randomBytes(32).toString("hex");

  const response = NextResponse.json({ csrfToken });

  // Set cookie
  response.cookies.set({
    name: "next-auth.csrf-token",
    value: `${csrfToken}|${crypto.createHash("sha256").update(csrfToken).digest("hex")}`,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
