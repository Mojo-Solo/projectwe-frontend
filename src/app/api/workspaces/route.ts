import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { workspaces, workspaceMembers, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getUserWorkspaces } from "@/lib/workspace-utils";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  organizationId: z.string(),
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

    const userWorkspaces = await getUserWorkspaces(session.user.id);

    return NextResponse.json({
      workspaces: userWorkspaces,
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
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
    const validatedData = createWorkspaceSchema.parse(body);

    // Create the workspace
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        organizationId: validatedData.organizationId,
      })
      .returning();

    // Add the user as an admin member
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: session.user.id,
      role: "ADMIN",
      status: "active",
    });

    // Log the activity
    await db.insert(activityLogs).values({
      userId: session.user.id,
      organizationId: validatedData.organizationId,
      action: "workspace_created",
      resourceType: "workspace",
      resourceId: workspace.id,
      metadata: {
        workspaceName: workspace.name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: workspace,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
