import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documentVersions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSignedViewUrl, getSignedDownloadUrl } from "../../../s3-utils";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } },
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

    const [version] = await db
      .select()
      .from(documentVersions)
      .where(
        and(
          eq(documentVersions.id, params.versionId),
          eq(documentVersions.documentId, params.id),
        ),
      )
      .limit(1);

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    let viewUrl = null;
    let downloadUrl = null;

    if (version.fileUrl) {
      try {
        viewUrl = await getSignedViewUrl(version.fileUrl, 7200);
        downloadUrl = await getSignedDownloadUrl(
          version.fileUrl,
          3600,
          `${document.title}_v${version.version}`,
        );
      } catch (error) {
        console.error("Error generating version URLs:", error);
      }
    }

    return NextResponse.json({
      version: {
        ...version,
        fileUrl: viewUrl,
        downloadUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching document version:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
