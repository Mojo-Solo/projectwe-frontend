import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documentShares, users } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { checkDocumentAccess } from "@/lib/document-access";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... POST and GET handlers remain the same

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess } = await checkDocumentAccess(
      params.id,
      session.user.id,
      "admin",
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Document not found or insufficient permissions" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { permissions } = body;

    await db
      .delete(documentShares)
      .where(eq(documentShares.documentId, params.id));

    const createdPermissions = await Promise.all(
      permissions.map(async (perm: any) => {
        let targetUser = null;
        if (perm.email) {
          [targetUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, perm.email))
            .limit(1);
        }

        const [createdPermission] = await db
          .insert(documentShares)
          .values({
            documentId: params.id,
            shareToken: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            permission: perm.permission,
            expiresAt: perm.expiresAt ? new Date(perm.expiresAt) : null,
            createdById: session.user.id,
          })
          .returning();

        return createdPermission;
      }),
    );

    return NextResponse.json({ permissions: createdPermissions });
  } catch (error) {
    console.error("Error updating document permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
