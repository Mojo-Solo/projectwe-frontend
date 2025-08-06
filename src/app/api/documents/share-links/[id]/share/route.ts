import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documents, documentShares, activityLogs } from "@/db/schema";
import { and, eq, gt, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... POST and GET handlers remain the same

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = params.id;
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const deleted = await db
      .delete(documentShares)
      .where(
        and(
          eq(documentShares.shareToken, token),
          eq(documentShares.documentId, documentId),
        ),
      );

    // Check if deletion was successful by querying if the record still exists
    const [existingShare] = await db
      .select()
      .from(documentShares)
      .where(
        and(
          eq(documentShares.shareToken, token),
          eq(documentShares.documentId, documentId),
        ),
      )
      .limit(1);

    if (existingShare) {
      return NextResponse.json(
        { error: "Failed to delete share link" },
        { status: 500 },
      );
    }

    await db.insert(activityLogs).values({
      userId: session.user.id,
      organizationId: session.user.organizationId,
      action: "document.share_revoked",
      resourceType: "document",
      resourceId: documentId,
      metadata: {
        token: token.substring(0, 8) + "...",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking share link:", error);
    return NextResponse.json(
      { error: "Failed to revoke share link" },
      { status: 500 },
    );
  }
}
