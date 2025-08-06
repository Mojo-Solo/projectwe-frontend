import { authOptions } from "@/lib/auth-simple";
import { NextResponse } from "next/server";

export async function GET() {
  const providers: Record<string, any> = {};

  // Get providers from authOptions
  if (authOptions.providers) {
    for (const provider of authOptions.providers) {
      const id =
        provider.id ||
        provider.name?.toLowerCase().replace(/\s+/g, "-") ||
        "unknown";
      providers[id] = {
        id,
        name: provider.name,
        type: provider.type,
        signinUrl: `/api/auth/signin/${id}`,
        callbackUrl: `/api/auth/callback/${id}`,
      };
    }
  }

  return NextResponse.json(providers);
}
