import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { workspaces, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { checkWorkspaceAccess } from "@/lib/workspace-utils";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const workspaceSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  visibility: z.enum(["private", "public"]).optional(),
  allowInvites: z.boolean().optional(),
  defaultRole: z.enum(["MEMBER", "GUEST"]).optional(),
});

export async function GET(
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

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, params.id))
      .limit(1);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      settings: {
        name: workspace.name,
        description: workspace.description,
        // Add other settings as needed
      },
    });
  } catch (error) {
    console.error("Error fetching workspace settings:", error);
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

    const member = await checkWorkspaceAccess(
      params.id,
      session.user.id,
      "manage",
    );
    if (!member || member.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedSettings = workspaceSettingsSchema.parse(body);

    const updateData: Partial<typeof workspaces.$inferInsert> = {};

    if (validatedSettings.name) {
      updateData.name = validatedSettings.name;
    }

    if (validatedSettings.description !== undefined) {
      updateData.description = validatedSettings.description;
    }

    updateData.updatedAt = new Date();

    const [updatedWorkspace] = await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.id, params.id))
      .returning();

    await db.insert(activityLogs).values({
      userId: session.user.id,
      organizationId: member.workspace.organizationId,
      action: "workspace_settings_updated",
      resourceType: "workspace",
      resourceId: updatedWorkspace.id,
      metadata: {
        updatedSections: Object.keys(validatedSettings),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "Settings updated successfully",
        workspace: updatedWorkspace,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error updating workspace settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
