import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  workspaceInvitations,
  workspaceMembers,
  activityLogs,
  workspaces,
  users,
} from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const acceptInvitationSchema = z.object({
  token: z.string(),
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { token } = acceptInvitationSchema.parse(body);

    const [invitation] = await db
      .select({
        id: workspaceInvitations.id,
        workspaceId: workspaceInvitations.workspaceId,
        email: workspaceInvitations.email,
        role: workspaceInvitations.role,
        permissions: workspaceInvitations.permissions,
        status: workspaceInvitations.status,
        expiresAt: workspaceInvitations.expiresAt,
        invitedById: workspaceInvitations.invitedById,
        acceptedAt: workspaceInvitations.acceptedAt,
        acceptedById: workspaceInvitations.acceptedById,
        workspace: {
          id: workspaces.id,
          name: workspaces.name,
          organizationId: workspaces.organizationId,
        },
        invitedBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(workspaceInvitations)
      .leftJoin(workspaces, eq(workspaceInvitations.workspaceId, workspaces.id))
      .leftJoin(users, eq(workspaceInvitations.invitedById, users.id))
      .where(
        and(
          eq(workspaceInvitations.id, token),
          eq(workspaceInvitations.email, session.user.email),
          eq(workspaceInvitations.status, "pending"),
          gt(workspaceInvitations.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 },
      );
    }

    const [existingMember] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, invitation.workspaceId),
          eq(workspaceMembers.userId, session.user.id),
        ),
      )
      .limit(1);

    if (existingMember && existingMember.status === "active") {
      return NextResponse.json(
        { error: "You are already a member of this workspace" },
        { status: 400 },
      );
    }

    const [member] = await db
      .insert(workspaceMembers)
      .values({
        workspaceId: invitation.workspaceId,
        userId: session.user.id,
        role: invitation.role,
        permissions: invitation.permissions,
        status: "active",
        invitedById: invitation.invitedById,
      })
      .onConflictDoUpdate({
        target: [workspaceMembers.workspaceId, workspaceMembers.userId],
        set: {
          status: "active",
          role: invitation.role,
          permissions: invitation.permissions,
        },
      })
      .returning();

    await db
      .update(workspaceInvitations)
      .set({
        status: "accepted",
        acceptedAt: new Date(),
        acceptedById: session.user.id,
      })
      .where(eq(workspaceInvitations.id, invitation.id));

    // Only log activity if we have a valid organization
    if (invitation.workspace?.organizationId) {
      await db.insert(activityLogs).values({
        userId: session.user.id,
        organizationId: invitation.workspace.organizationId,
        action: "invitation_accepted",
        resourceType: "workspace",
        resourceId: invitation.workspaceId,
        metadata: {
          workspaceName: invitation.workspace.name || "Unknown Workspace",
          invitedBy: invitation.invitedBy?.name || "Unknown User",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        workspace: invitation.workspace,
        role: member.role,
        permissions: member.permissions,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Accept invitation error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
