import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma-compat";
import { z } from "zod";
import { CreateNoteRequest } from "@/types/client";
import {
  priorityEnum,
  documentAccessLevelEnum,
  documentCategoryEnum,
  activityTypeEnum,
  activityCategoryEnum,
  activityStatusEnum,
} from "@/db/schema";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Define enum types for validation
const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

const NoteCategory = {
  GENERAL: "GENERAL",
  MEETING: "MEETING",
  FOLLOW_UP: "FOLLOW_UP",
  CONCERN: "CONCERN",
  OPPORTUNITY: "OPPORTUNITY",
} as const;

const NoteType = {
  MEETING_NOTE: "MEETING_NOTE",
  CALL_NOTE: "CALL_NOTE",
  EMAIL_NOTE: "EMAIL_NOTE",
  OBSERVATION: "OBSERVATION",
  REMINDER: "REMINDER",
} as const;

const AccessLevel = {
  PUBLIC: "PUBLIC",
  ORGANIZATION: "ORGANIZATION",
  CLIENT_ADVISOR: "CLIENT_ADVISOR",
  PRIVATE: "PRIVATE",
} as const;

const NoteStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
} as const;

const ActivityType = {
  NOTE: "NOTE_ADDED",
  MEETING: "MEETING",
  CALL: "CALL",
} as const;

const ActivityCategory = {
  GENERAL: "ADMINISTRATIVE",
  ADMINISTRATIVE: "ADMINISTRATIVE",
} as const;

const ActivityStatus = {
  COMPLETED: "COMPLETED",
} as const;

const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  category: z.nativeEnum(NoteCategory).optional().default(NoteCategory.GENERAL),
  noteType: z.nativeEnum(NoteType).optional().default(NoteType.MEETING_NOTE),
  isPrivate: z.boolean().optional().default(false),
  isConfidential: z.boolean().optional().default(false),
  relatedActivityId: z.string().optional(),
  relatedDocumentId: z.string().optional(),
  relatedAssessmentId: z.string().optional(),
  priority: z.nativeEnum(Priority).optional().default(Priority.MEDIUM),
  sharedWith: z.array(z.string()).optional().default([]),
  accessLevel: z
    .nativeEnum(AccessLevel)
    .optional()
    .default(AccessLevel.CLIENT_ADVISOR),
});

const updateNoteSchema = createNoteSchema.partial();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    // Authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: clientId } = params;
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") as keyof typeof NoteCategory;
    const noteType = searchParams.get("noteType") as keyof typeof NoteType;
    const priority = searchParams.get("priority") as keyof typeof Priority;
    const isPrivate = searchParams.get("isPrivate") === "true";
    const isConfidential = searchParams.get("isConfidential") === "true";
    const isPinned = searchParams.get("isPinned") === "true";
    const authorId = searchParams.get("authorId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = parseInt(searchParams.get("page") || "1");

    // Verify client access
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        organizationId: session.user.organizationId,
        ...(session.user.role === "ADVISOR"
          ? {
              advisorId: session.user.id,
            }
          : {}),
      },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    // Build where clause with access control
    const where: any = {
      clientId,
      status: NoteStatus.ACTIVE,
    };
    // Apply access control filters
    const accessFilters: any[] = [
      { isPrivate: false }, // Public notes
    ];
    // Users can see their own private notes
    if (session.user.id) {
      accessFilters.push({ authorId: session.user.id });
    }
    // Admins can see all notes
    if (session.user.role === "ADMIN") {
      accessFilters.push({}); // No additional restrictions for admins
    }
    // Apply access level filtering
    switch (session.user.role) {
      case "CLIENT":
        accessFilters.push({
          accessLevel: { in: [AccessLevel.PUBLIC, AccessLevel.CLIENT_ADVISOR] },
        });
        break;
      case "ADVISOR":
        accessFilters.push({
          accessLevel: {
            in: [
              AccessLevel.PUBLIC,
              AccessLevel.ORGANIZATION,
              AccessLevel.CLIENT_ADVISOR,
            ],
          },
        });
        break;
    }
    where.OR = accessFilters;
    // Apply other filters
    if (category) where.category = category;
    if (noteType) where.noteType = noteType;
    if (priority) where.priority = priority;
    if (isPrivate !== undefined) where.isPrivate = isPrivate;
    if (isConfidential !== undefined) where.isConfidential = isConfidential;
    if (isPinned !== undefined) where.isPinned = isPinned;
    if (authorId) where.authorId = authorId;
    // Fetch notes
    const [notes, totalCount, noteStats] = await Promise.all([
      prisma.clientNote.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { isPinned: "desc" }, // Pinned notes first
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.clientNote.count({ where }),
      getNoteStats(clientId, session.user.id, session.user.role),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: noteStats,
    });
  } catch (error) {
    console.error("Error fetching client notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    // Authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions - anyone can create notes but with different access levels
    const { id: clientId } = params;

    // Verify client access
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        organizationId: session.user.organizationId,
        ...(session.user.role === "ADVISOR"
          ? {
              advisorId: session.user.id,
            }
          : session.user.role === "CLIENT"
            ? {
                email: session.user.email, // Clients can only add notes to their own profile
              }
            : {}),
      },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    const body = await req.json();
    const validatedData = createNoteSchema.parse(body);
    // Verify related entities if specified
    if (validatedData.relatedActivityId) {
      const activity = await prisma.clientActivity.findFirst({
        where: { id: validatedData.relatedActivityId, clientId },
      });
      if (!activity) {
        return NextResponse.json(
          { error: "Related activity not found" },
          { status: 400 },
        );
      }
    }
    if (validatedData.relatedDocumentId) {
      const document = await prisma.clientDocument.findFirst({
        where: { id: validatedData.relatedDocumentId, clientId },
      });
      if (!document) {
        return NextResponse.json(
          { error: "Related document not found" },
          { status: 400 },
        );
      }
    }
    if (validatedData.relatedAssessmentId) {
      const assessment = await prisma.clientAssessment.findFirst({
        where: { id: validatedData.relatedAssessmentId, clientId },
      });
      if (!assessment) {
        return NextResponse.json(
          { error: "Related assessment not found" },
          { status: 400 },
        );
      }
    }
    // Verify shared users exist if specified
    if (validatedData.sharedWith.length > 0) {
      const sharedUsers = await prisma.user.findMany({
        where: {
          id: { in: validatedData.sharedWith },
          organizationId: session.user.organizationId,
        },
      });
      if (sharedUsers.length !== validatedData.sharedWith.length) {
        return NextResponse.json(
          { error: "One or more shared users not found" },
          { status: 400 },
        );
      }
    }
    // Apply role-based access level restrictions
    let accessLevel = validatedData.accessLevel;
    if (session.user.role === "CLIENT") {
      // Clients can only create notes with limited access levels
      accessLevel = AccessLevel.CLIENT_ADVISOR;
    }
    // Create note
    const note = await prisma.clientNote.create({
      data: {
        ...validatedData,
        clientId,
        authorId: session.user.id,
        accessLevel,
        status: NoteStatus.ACTIVE,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    // Log activity for important notes
    if (
      validatedData.priority === Priority.HIGH ||
      validatedData.priority === Priority.URGENT
    ) {
      await prisma.clientActivity.create({
        data: {
          clientId,
          userId: session.user.id,
          type: ActivityType.NOTE,
          category: ActivityCategory.GENERAL,
          title: `${validatedData.priority} Priority Note Added`,
          description:
            validatedData.title || "Important note added to client record",
          status: ActivityStatus.COMPLETED,
          taskPriority: validatedData.priority,
          completedAt: new Date(),
        },
      });
    }
    // TODO: Send notifications to shared users
    // TODO: Trigger real-time updates via Pusher
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating client note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Bulk note operations
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    // Authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: clientId } = params;
    const body = await req.json();
    const { operation, noteIds, data } = body;

    // Verify client access
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        organizationId: session.user.organizationId,
        ...(session.user.role === "ADVISOR"
          ? {
              advisorId: session.user.id,
            }
          : {}),
      },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    // Build additional where clause for user permissions
    const additionalWhere: any = {};
    if (session.user.role !== "ADMIN") {
      // Non-admins can only modify their own notes or notes they have access to
      additionalWhere.OR = [
        { authorId: session.user.id },
        { sharedWith: { has: session.user.id } },
      ];
    }
    let result;
    switch (operation) {
      case "pin":
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
            ...additionalWhere,
          },
          data: { isPinned: true },
        });
        break;
      case "unpin":
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
            ...additionalWhere,
          },
          data: { isPinned: false },
        });
        break;
      case "updatePriority":
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
            ...additionalWhere,
          },
          data: { priority: data.priority },
        });
        break;
      case "updateAccessLevel":
        if (session.user.role === "CLIENT") {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 },
          );
        }
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
            ...additionalWhere,
          },
          data: { accessLevel: data.accessLevel },
        });
        break;
      case "archive":
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
            ...additionalWhere,
          },
          data: { status: NoteStatus.ARCHIVED },
        });
        break;
      case "delete":
        if (!["ADMIN", "ADVISOR"].includes(session.user.role)) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 },
          );
        }
        result = await prisma.clientNote.updateMany({
          where: {
            id: { in: noteIds },
            clientId,
          },
          data: { status: NoteStatus.DELETED },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 },
        );
    }
    // Log bulk operation
    await prisma.clientActivity.create({
      data: {
        clientId,
        userId: session.user.id,
        type: "NOTE",
        category: "ADMINISTRATIVE",
        title: `Bulk Note ${operation}`,
        description: `Performed ${operation} on ${noteIds.length} notes`,
        status: "COMPLETED",
        priority: "MEDIUM",
        completedAt: new Date(),
      },
    });
    return NextResponse.json({
      message: `${operation} completed successfully`,
      affected: result.count,
    });
  } catch (error) {
    console.error("Error in bulk note operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to get note statistics
async function getNoteStats(
  clientId: string,
  userId: string,
  userRole: string,
) {
  const baseWhere = {
    clientId,
    status: NoteStatus.ACTIVE,
  };

  // Apply access control filters
  const accessFilters: any[] = [
    { isPrivate: false }, // Public notes
    { authorId: userId }, // User's own notes
  ];

  if (userRole === "ADMIN") {
    accessFilters.push({}); // Admins see all
  }

  const where = {
    ...baseWhere,
    OR: accessFilters,
  };

  const [
    totalNotes,
    pinnedNotes,
    myNotes,
    byCategory,
    byType,
    byPriority,
    confidentialNotes,
    recentNotes,
  ] = await Promise.all([
    prisma.clientNote.count({ where }),
    prisma.clientNote.count({ where: { ...where, isPinned: true } }),
    prisma.clientNote.count({ where: { ...baseWhere, authorId: userId } }),
    prisma.clientNote.groupBy({
      by: ["category"],
      where,
      _count: { id: true },
    }),
    prisma.clientNote.groupBy({
      by: ["noteType"],
      where,
      _count: { id: true },
    }),
    prisma.clientNote.groupBy({
      by: ["priority"],
      where,
      _count: { id: true },
    }),
    prisma.clientNote.count({ where: { ...where, isConfidential: true } }),
    prisma.clientNote.count({
      where: {
        ...where,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    total: totalNotes,
    pinned: pinnedNotes,
    myNotes,
    byCategory: byCategory.reduce(
      (acc, item) => {
        acc[item.category] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byType: byType.reduce(
      (acc, item) => {
        acc[item.noteType] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byPriority: byPriority.reduce(
      (acc, item) => {
        acc[item.priority] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    confidential: confidentialNotes,
    recent7Days: recentNotes,
  };
}
