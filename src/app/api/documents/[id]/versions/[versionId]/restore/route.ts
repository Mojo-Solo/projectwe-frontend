import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documentVersions, documents, documentActivities } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } },
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess } = await checkDocumentAccess(
      params.id,
      session.user.id,
      "edit",
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Document not found or insufficient permissions" },
        { status: 404 },
      );
    }

    const [versionToRestore] = await db
      .select()
      .from(documentVersions)
      .where(
        and(
          eq(documentVersions.documentId, params.id),
          eq(documentVersions.id, params.versionId),
        ),
      )
      .limit(1);

    if (!versionToRestore) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const [maxVersion] = await db
      .select({ version: documentVersions.version })
      .from(documentVersions)
      .where(eq(documentVersions.documentId, params.id))
      .orderBy(desc(documentVersions.version))
      .limit(1);

    const newVersionNumber = (maxVersion?.version || 0) + 1;

    const [restoredVersion] = await db
      .insert(documentVersions)
      .values({
        documentId: params.id,
        version: newVersionNumber,
        fileUrl: versionToRestore.fileUrl,
        createdById: session.user.id,
        changes: `Restored from version ${versionToRestore.version}`,
      })
      .returning();

    await db
      .update(documents)
      .set({
        version: newVersionNumber,
        fileUrl: versionToRestore.fileUrl,
        // fileSize removed - not available in documentVersions schema
      })
      .where(eq(documents.id, params.id));

    await db.insert(documentActivities).values({
      documentId: params.id,
      userId: session.user.id,
      action: "version_restored",
      details: {
        restoredFromVersion: versionToRestore.version,
        newVersionNumber,
      },
    });

    return NextResponse.json({ version: restoredVersion });
  } catch (error) {
    console.error("Error restoring document version:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
