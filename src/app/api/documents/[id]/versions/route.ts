import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documentVersions, documents, documentActivities } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import {
  createStorageService,
  getWorkspaceStorageKey,
} from "@/lib/document-storage";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... GET handler remains the same

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

    const { hasAccess, document } = await checkDocumentAccess(
      params.id,
      session.user.id,
      "edit",
    );

    if (!hasAccess || !document) {
      return NextResponse.json(
        { error: "Document not found or insufficient permissions" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const comments = formData.get("comments") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const [maxVersion] = await db
      .select({ version: documentVersions.version })
      .from(documentVersions)
      .where(eq(documentVersions.documentId, params.id))
      .orderBy(desc(documentVersions.version))
      .limit(1);

    const newVersionNumber = (maxVersion?.version || 0) + 1;

    const storage = createStorageService();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storageKey = getWorkspaceStorageKey(
      document.organizationId,
      `${file.name}_v${newVersionNumber}`,
    );

    const uploadResult = await storage.uploadFile(
      fileBuffer,
      file.name,
      file.type,
      { key: storageKey },
    );

    const [newVersion] = await db
      .insert(documentVersions)
      .values({
        documentId: params.id,
        version: newVersionNumber,
        fileUrl: uploadResult.url,
        createdById: session.user.id,
        changes: comments,
      })
      .returning();

    await db
      .update(documents)
      .set({
        version: newVersionNumber,
        fileUrl: uploadResult.url,
        fileSize: file.size,
      })
      .where(eq(documents.id, params.id));

    await db.insert(documentActivities).values({
      documentId: params.id,
      userId: session.user.id,
      action: "version_created",
      details: {
        versionNumber: newVersionNumber,
        comments,
      },
    });

    return NextResponse.json({ version: newVersion }, { status: 201 });
  } catch (error) {
    console.error("Error creating document version:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
