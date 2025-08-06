import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { workspaceMembers, workspaceInvitations, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { checkWorkspaceAccess } from "@/lib/workspace-utils";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]),
  permissions: z.object({}).optional(),
});

const updateMemberSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]).optional(),
  permissions: z.object({}).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await checkWorkspaceAccess(
      params.id,
      session.user.id,
      "read",
    );
    if (!member) {
      return NextResponse.json(
        { error: "Workspace not found or access denied" },
        { status: 404 },
      );
    }

    const members = await db
      .select({
        id: workspaceMembers.id,
        role: workspaceMembers.role,
        permissions: workspaceMembers.permissions,
        status: workspaceMembers.status,
        joinedAt: workspaceMembers.joinedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, params.id));

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await checkWorkspaceAccess(
      params.id,
      session.user.id,
      "invite",
    );
    if (!member || (member.role !== "ADMIN" && member.role !== "MEMBER")) {
      return NextResponse.json(
        { error: "Insufficient permissions to invite members" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = inviteMemberSchema.parse(body);

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(
        and(
          eq(workspaceMembers.workspaceId, params.id),
          eq(users.email, validatedData.email),
        ),
      )
      .limit(1);

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: "User is already a member of this workspace" },
        { status: 400 },
      );
    }

    // Create invitation
    const [invitation] = await db
      .insert(workspaceInvitations)
      .values({
        workspaceId: params.id,
        email: validatedData.email,
        role: validatedData.role,
        permissions: validatedData.permissions,
        invitedById: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })
      .returning();

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error inviting member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await checkWorkspaceAccess(
      params.id,
      session.user.id,
      "manage",
    );
    if (!member || member.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only workspace admins can update members" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { memberId, ...updateData } = body;
    const validatedData = updateMemberSchema.parse(updateData);

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 },
      );
    }

    const [updatedMember] = await db
      .update(workspaceMembers)
      .set(validatedData)
      .where(
        and(
          eq(workspaceMembers.workspaceId, params.id),
          eq(workspaceMembers.id, memberId),
        ),
      )
      .returning();

    if (!updatedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await checkWorkspaceAccess(
      params.id,
      session.user.id,
      "manage",
    );
    if (!member || member.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only workspace admins can remove members" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 },
      );
    }

    await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, params.id),
          eq(workspaceMembers.id, memberId),
        ),
      );

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
