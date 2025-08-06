import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Deployment successful!",
    timestamp: new Date().toISOString(),
    testUsers: [
      "test1@projectwe.com (password: password123)",
      "test2@projectwe.com (password: password123)",
      "test3@projectwe.com (password: password123)",
      "test4@projectwe.com (password: password123)",
      "test5@projectwe.com (password: password123)",
    ],
    loginUrl: "/auth/test-login",
    version: "2.0.0",
  });
}
