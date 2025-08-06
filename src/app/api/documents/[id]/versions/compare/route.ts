import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documentVersions, documentActivities, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createStorageService } from "@/lib/document-storage";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess } = await checkDocumentAccess(
      params.id,
      session.user.id,
      "view",
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { leftVersionId, rightVersionId } = body;

    if (!leftVersionId || !rightVersionId) {
      return NextResponse.json(
        { error: "Both version IDs are required" },
        { status: 400 },
      );
    }

    const [leftVersionResult, rightVersionResult] = await Promise.all([
      db
        .select({
          id: documentVersions.id,
          documentId: documentVersions.documentId,
          version: documentVersions.version,
          fileUrl: documentVersions.fileUrl,
          changes: documentVersions.changes,
          createdById: documentVersions.createdById,
          createdAt: documentVersions.createdAt,
          uploadedBy: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
        })
        .from(documentVersions)
        .leftJoin(users, eq(documentVersions.createdById, users.id))
        .where(
          and(
            eq(documentVersions.documentId, params.id),
            eq(documentVersions.id, leftVersionId),
          ),
        )
        .limit(1),

      db
        .select({
          id: documentVersions.id,
          documentId: documentVersions.documentId,
          version: documentVersions.version,
          fileUrl: documentVersions.fileUrl,
          changes: documentVersions.changes,
          createdById: documentVersions.createdById,
          createdAt: documentVersions.createdAt,
          uploadedBy: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
        })
        .from(documentVersions)
        .leftJoin(users, eq(documentVersions.createdById, users.id))
        .where(
          and(
            eq(documentVersions.documentId, params.id),
            eq(documentVersions.id, rightVersionId),
          ),
        )
        .limit(1),
    ]);

    const [leftVersion] = leftVersionResult;
    const [rightVersion] = rightVersionResult;

    if (!leftVersion || !rightVersion) {
      return NextResponse.json(
        { error: "One or both versions not found" },
        { status: 404 },
      );
    }

    // Generate basic comparison result
    const comparison = {
      leftVersion: {
        id: leftVersion.id,
        version: leftVersion.version,
        fileUrl: leftVersion.fileUrl,
        createdAt: leftVersion.createdAt,
        changes: leftVersion.changes,
      },
      rightVersion: {
        id: rightVersion.id,
        version: rightVersion.version,
        fileUrl: rightVersion.fileUrl,
        createdAt: rightVersion.createdAt,
        changes: rightVersion.changes,
      },
      differences: [], // Placeholder for actual diff logic
    };

    await db.insert(documentActivities).values({
      documentId: params.id,
      userId: session.user.id,
      action: "versions_compared",
      details: {
        leftVersionNumber: leftVersion.version,
        rightVersionNumber: rightVersion.version,
      },
    });

    return NextResponse.json({ comparison });
  } catch (error) {
    console.error("Error comparing document versions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
