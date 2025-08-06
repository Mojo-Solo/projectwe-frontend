import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { workspaceMembers, users, activityLogs, workspaces } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const switchWorkspaceSchema = z.object({
  workspaceId: z.string(),
});

export async function GET(request: NextRequest) {
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

    const [user] = await db
      .select({ currentWorkspaceId: users.currentWorkspaceId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const cookieStore = cookies();
    const workspaceCookie = cookieStore.get("current-workspace");
    const currentWorkspaceId =
      user?.currentWorkspaceId || workspaceCookie?.value;

    if (!currentWorkspaceId) {
      // Find first available workspace for the user
      const [firstWorkspace] = await db
        .select({ workspaceId: workspaceMembers.workspaceId })
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, session.user.id),
            eq(workspaceMembers.status, "active"),
          ),
        )
        .limit(1);

      if (!firstWorkspace) {
        return NextResponse.json({
          success: false,
          error: "No workspaces available",
        });
      }

      // Set the first workspace as current
      const updatedCurrentWorkspaceId = firstWorkspace.workspaceId;

      await db
        .update(users)
        .set({ currentWorkspaceId: updatedCurrentWorkspaceId })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({
        success: true,
        data: {
          currentWorkspaceId: updatedCurrentWorkspaceId,
        },
      });
    }

    const [member] = await db
      .select({
        id: workspaceMembers.id,
        workspaceId: workspaceMembers.workspaceId,
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        permissions: workspaceMembers.permissions,
        status: workspaceMembers.status,
        joinedAt: workspaceMembers.joinedAt,
        invitedById: workspaceMembers.invitedById,
        workspace: {
          id: workspaces.id,
          name: workspaces.name,
          organizationId: workspaces.organizationId,
        },
      })
      .from(workspaceMembers)
      .leftJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(
        and(
          eq(workspaceMembers.workspaceId, currentWorkspaceId),
          eq(workspaceMembers.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!member || member.status !== "active") {
      // Clear the current workspace and find a new one
      await db
        .update(users)
        .set({ currentWorkspaceId: null })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({
        success: false,
        error: "Current workspace is not accessible",
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        currentWorkspace: {
          ...member.workspace,
          role: member.role,
          permissions: member.permissions,
        },
      },
    });
  } catch (error) {
    console.error("Error getting current workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
    const { workspaceId } = switchWorkspaceSchema.parse(body);

    // Verify user has access to the workspace
    const [member] = await db
      .select({
        id: workspaceMembers.id,
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        workspace: {
          id: workspaces.id,
          name: workspaces.name,
          organizationId: workspaces.organizationId,
        },
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, session.user.id),
          eq(workspaceMembers.status, "active"),
        ),
      )
      .limit(1);

    if (!member) {
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 },
      );
    }

    // Update user's current workspace
    await db
      .update(users)
      .set({
        currentWorkspaceId: workspaceId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    // Set cookie for client-side access
    const response = NextResponse.json({
      success: true,
      data: {
        currentWorkspace: {
          ...member.workspace,
          role: member.role,
        },
      },
    });

    response.cookies.set("current-workspace", workspaceId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Log workspace switch activity
    await db.insert(activityLogs).values({
      userId: session.user.id,
      organizationId: member.workspace.organizationId,
      action: "workspace_switched",
      resourceType: "workspace",
      resourceId: workspaceId,
      metadata: {
        workspaceName: member.workspace.name,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error switching workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
