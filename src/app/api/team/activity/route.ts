import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { tasks, documents, projects, users, taskComments } from "@/db/schema";
import { eq, gte, desc, and } from "drizzle-orm";

// Force dynamic rendering to prevent static export errors
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent activities from various sources
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentTasks, recentDocuments, recentComments, recentProjects] =
      await Promise.all([
        // Recent task activities
        db
          .select({
            id: tasks.id,
            title: tasks.title,
            status: tasks.status,
            priority: tasks.priority,
            createdAt: tasks.createdAt,
            updatedAt: tasks.updatedAt,
            assignee: {
              id: users.id,
              name: users.name,
              email: users.email,
              image: users.image,
            },
          })
          .from(tasks)
          .leftJoin(users, eq(tasks.assigneeId, users.id))
          .where(
            and(
              eq(tasks.organizationId, session.user.organizationId),
              gte(tasks.updatedAt, sevenDaysAgo),
            ),
          )
          .orderBy(desc(tasks.updatedAt))
          .limit(10),

        // Recent document uploads
        db
          .select({
            id: documents.id,
            title: documents.title,
            type: documents.type,
            createdAt: documents.createdAt,
            updatedAt: documents.updatedAt,
            fileSize: documents.fileSize,
          })
          .from(documents)
          .where(
            and(
              eq(documents.organizationId, session.user.organizationId),
              gte(documents.createdAt, sevenDaysAgo),
            ),
          )
          .orderBy(desc(documents.createdAt))
          .limit(10),

        // Recent comments
        db
          .select({
            id: taskComments.id,
            content: taskComments.content,
            createdAt: taskComments.createdAt,
            user: {
              id: users.id,
              name: users.name,
              email: users.email,
              image: users.image,
            },
            task: {
              id: tasks.id,
              title: tasks.title,
            },
          })
          .from(taskComments)
          .leftJoin(users, eq(taskComments.userId, users.id))
          .leftJoin(tasks, eq(taskComments.taskId, tasks.id))
          .where(
            and(
              eq(tasks.organizationId, session.user.organizationId),
              gte(taskComments.createdAt, sevenDaysAgo),
            ),
          )
          .orderBy(desc(taskComments.createdAt))
          .limit(10),

        // Recent project updates
        db
          .select({
            id: projects.id,
            name: projects.name,
            exitStrategy: projects.exitStrategy,
            valuation: projects.valuation,
            status: projects.status,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
          })
          .from(projects)
          .where(
            and(
              eq(projects.organizationId, session.user.organizationId),
              gte(projects.updatedAt, sevenDaysAgo),
            ),
          )
          .orderBy(desc(projects.updatedAt))
          .limit(5),
      ]);

    // Combine and format activities
    const activities = [
      ...recentTasks.map((task: any) => ({
        id: `task-${task.id}`,
        type: "task" as const,
        action:
          task.createdAt?.getTime() === task.updatedAt?.getTime()
            ? "created"
            : "updated",
        title: task.title,
        user: task.assignee,
        timestamp: task.updatedAt,
        metadata: {
          status: task.status,
          priority: task.priority,
        },
      })),

      ...recentDocuments.map((doc: any) => ({
        id: `doc-${doc.id}`,
        type: "document" as const,
        action: "uploaded",
        title: doc.title,
        user: null, // No user relation in document schema
        timestamp: doc.createdAt,
        metadata: {
          fileType: doc.type,
          size: doc.fileSize,
        },
      })),

      ...recentComments.map((comment: any) => ({
        id: `comment-${comment.id}`,
        type: "comment" as const,
        action: "commented",
        title: `Comment on "${comment.task?.title || "Unknown Task"}"`,
        user: comment.user,
        timestamp: comment.createdAt,
        metadata: {
          taskId: comment.task?.id,
          preview: comment.content?.substring(0, 100) || "",
        },
      })),

      ...recentProjects.map((project: any) => ({
        id: `project-${project.id}`,
        type: "project" as const,
        action:
          project.createdAt?.getTime() === project.updatedAt?.getTime()
            ? "created"
            : "updated",
        title: project.name,
        user: null, // No user relation in project schema
        timestamp: project.updatedAt,
        metadata: {
          exitStrategy: project.exitStrategy,
          valuation: project.valuation,
          status: project.status,
        },
      })),
    ];

    // Sort by timestamp and take the most recent
    const sortedActivities = activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      data: sortedActivities,
    });
  } catch (error) {
    console.error("Team activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team activity" },
      { status: 500 },
    );
  }
}
