import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  documents,
  documentVersions,
  activities,
  documentAnalytics,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getFileMetadata, getSignedViewUrl } from "../s3-utils";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... schema remains the same

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { tempDocumentId, storageKey, title, type, projectId, description } =
      body;

    const fileMetadata = await getFileMetadata(storageKey);

    // ... metadata validation remains the same

    const [document] = await db
      .insert(documents)
      .values({
        id: tempDocumentId,
        title,
        type,
        content: description,
        fileUrl: storageKey,
        fileSize: fileMetadata.size,
        mimeType: fileMetadata.contentType,
        status: "DRAFT",
        organizationId: session.user.organizationId,
        projectId: projectId || undefined,
      })
      .returning();

    await db.insert(documentVersions).values({
      documentId: document.id,
      version: 1,
      fileUrl: storageKey,
      createdById: session.user.id,
    });

    // File URL is already set during insert
    const updatedDocument = document;

    await db.insert(activities).values({
      type: "DOCUMENT_UPLOADED",
      description: `Uploaded document: ${title}`,
      userId: session.user.id,
      metadata: {
        documentId: document.id,
      },
    });

    await db.insert(documentAnalytics).values({
      documentId: document.id,
      organizationId: session.user.organizationId,
      action: "upload",
    });

    return NextResponse.json({ document: updatedDocument }, { status: 201 });
  } catch (error) {
    console.error("Database error in POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
