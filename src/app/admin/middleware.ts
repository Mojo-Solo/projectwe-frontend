import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is authenticated and is an admin
  // This is a placeholder - implement your actual auth check
  const isAdmin = request.cookies.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    // Redirect to login or main dashboard
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add security headers for admin panel
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  );

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
