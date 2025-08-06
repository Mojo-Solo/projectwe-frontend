import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createStorageService } from "@/lib/document-storage";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess, document } = await checkDocumentAccess(
      params.id,
      session.user.id,
      "view",
    );

    if (!hasAccess || !document) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 },
      );
    }

    // Get signed URL for viewing
    const storage = createStorageService();
    const url = await storage.getFileUrl(document.storageKey || "", 3600); // 1 hour expiry

    return NextResponse.json({
      url,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Error generating view URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
