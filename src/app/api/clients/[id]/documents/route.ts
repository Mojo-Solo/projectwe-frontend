import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma-compat";
import { z } from "zod";
import {
  ActivityType,
  ActivityCategory,
  ActivityStatus,
  Priority,
  DocumentCategory,
  DocumentStatus,
  SecurityLevel,
  ReviewStatus,
  EngagementLevel,
} from "@/types/client";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Note: Simplified to work with current Drizzle schema
// Many enum types would need to be added to match full Prisma schema

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  filename: z.string().min(1, "Filename is required"),
  fileUrl: z.string().url("Valid file URL is required"),
  fileSize: z.number().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  category: z.nativeEnum(DocumentCategory),
  subcategory: z.string().optional(),
  documentType: z.string().min(1, "Document type is required"),
  isConfidential: z.boolean().optional().default(false),
  securityLevel: z
    .nativeEnum(SecurityLevel)
    .optional()
    .default(SecurityLevel.STANDARD),
  version: z.number().positive().optional().default(1.0),
  parentDocumentId: z.string().optional(),
  aiAnalysis: z.any().optional(),
  extractedData: z.any().optional(),
});

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

    const category = searchParams.get("category") as DocumentCategory;
    const status = searchParams.get("status") as DocumentStatus;
    const securityLevel = searchParams.get("securityLevel") as SecurityLevel;
    const documentType = searchParams.get("documentType");
    const isConfidential = searchParams.get("isConfidential") === "true";
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
    // Build where clause with security filtering
    const where: any = { clientId };
    if (category) where.category = category;
    if (status) where.status = status;
    if (securityLevel) where.securityLevel = securityLevel;
    if (documentType) where.documentType = documentType;
    if (isConfidential !== undefined) where.isConfidential = isConfidential;
    // Additional security filtering based on user role
    if (session.user.role === "CLIENT") {
      // Clients can only see non-confidential documents or their own uploads
      where.OR = [{ isConfidential: false }, { uploadedById: session.user.id }];
    }
    // Fetch documents
    const [documents, totalCount, documentStats] = await Promise.all([
      prisma.clientDocument.findMany({
        where,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.clientDocument.count({ where }),
      getDocumentStats(clientId, session.user.role),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: documentStats,
    });
  } catch (error) {
    console.error("Error fetching client documents:", error);
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

    // Check permissions
    if (!["ADMIN", "ADVISOR", "CLIENT"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

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
                // Clients can only upload to their own profile
                email: session.user.email,
              }
            : {}),
      },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    const body = await req.json();
    const validatedData = createDocumentSchema.parse(body);
    // Verify parent document if specified
    if (validatedData.parentDocumentId) {
      const parentDoc = await prisma.clientDocument.findFirst({
        where: {
          id: validatedData.parentDocumentId,
          clientId,
        },
      });
      if (!parentDoc) {
        return NextResponse.json(
          { error: "Parent document not found" },
          { status: 400 },
        );
      }
    }
    // Create document
    const document = await prisma.clientDocument.create({
      data: {
        ...validatedData,
        clientId,
        uploadedById: session.user.id,
        status: DocumentStatus.DRAFT,
        reviewStatus: ReviewStatus.PENDING,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    // Log activity
    await prisma.clientActivity.create({
      data: {
        clientId,
        userId: session.user.id,
        type: ActivityType.DOCUMENT_REVIEW,
        category: ActivityCategory.ADMINISTRATIVE,
        title: "Document Uploaded",
        description: `Uploaded ${validatedData.title} (${validatedData.category})`,
        status: ActivityStatus.COMPLETED,
        taskPriority: Priority.MEDIUM,
        completedAt: new Date(),
      },
    });
    // Update client engagement if this is their first document
    const documentCount = await prisma.clientDocument.count({
      where: { clientId },
    });
    if (documentCount === 1) {
      await prisma.client.update({
        where: { id: clientId },
        data: {
          engagementLevel: EngagementLevel.MEDIUM,
          onboardingCompleted:
            client.onboardingCompleted === false
              ? false
              : client.onboardingCompleted,
        },
      });
    }
    // TODO: Trigger document analysis if AI analysis is enabled
    // TODO: Send notification to advisors about new document
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating client document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Bulk document operations
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

    if (!["ADMIN", "ADVISOR"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id: clientId } = params;
    const body = await req.json();
    const { operation, documentIds, data } = body;

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
    let result;
    switch (operation) {
      case "updateStatus":
        result = await prisma.clientDocument.updateMany({
          where: {
            id: { in: documentIds },
            clientId,
          },
          data: { status: data.status },
        });
        break;
      case "updateReviewStatus":
        result = await prisma.clientDocument.updateMany({
          where: {
            id: { in: documentIds },
            clientId,
          },
          data: {
            reviewStatus: data.reviewStatus,
            approvedBy:
              data.reviewStatus === ReviewStatus.APPROVED
                ? session.user.id
                : null,
            approvedAt:
              data.reviewStatus === ReviewStatus.APPROVED ? new Date() : null,
          },
        });
        break;
      case "updateSecurityLevel":
        result = await prisma.clientDocument.updateMany({
          where: {
            id: { in: documentIds },
            clientId,
          },
          data: { securityLevel: data.securityLevel },
        });
        break;
      case "archive":
        result = await prisma.clientDocument.updateMany({
          where: {
            id: { in: documentIds },
            clientId,
          },
          data: { status: DocumentStatus.ARCHIVED },
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
        type: ActivityType.NOTE,
        category: ActivityCategory.ADMINISTRATIVE,
        title: `Bulk Document ${operation}`,
        description: `Performed ${operation} on ${documentIds.length} documents`,
        status: ActivityStatus.COMPLETED,
        taskPriority: Priority.MEDIUM,
        completedAt: new Date(),
      },
    });
    return NextResponse.json({
      message: `${operation} completed successfully`,
      affected: result.count,
    });
  } catch (error) {
    console.error("Error in bulk document operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to get document statistics
async function getDocumentStats(clientId: string, userRole: string) {
  const baseWhere = { clientId };

  // Apply security filtering for non-admin users
  const securityWhere =
    userRole === "CLIENT"
      ? {
          ...baseWhere,
          OR: [
            { isConfidential: false },
            // Add user-specific filter if needed
          ],
        }
      : baseWhere;

  const [
    totalDocs,
    byCategory,
    byStatus,
    bySecurityLevel,
    confidentialCount,
    pendingReview,
  ] = await Promise.all([
    prisma.clientDocument.count({ where: securityWhere }),
    prisma.clientDocument.groupBy({
      by: ["category"],
      where: securityWhere,
      _count: { id: true },
    }),
    prisma.clientDocument.groupBy({
      by: ["status"],
      where: securityWhere,
      _count: { id: true },
    }),
    prisma.clientDocument.groupBy({
      by: ["securityLevel"],
      where: securityWhere,
      _count: { id: true },
    }),
    prisma.clientDocument.count({
      where: { ...securityWhere, isConfidential: true },
    }),
    prisma.clientDocument.count({
      where: { ...securityWhere, reviewStatus: ReviewStatus.PENDING },
    }),
  ]);

  return {
    total: totalDocs,
    byCategory: byCategory.reduce(
      (acc, item) => {
        acc[item.category] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byStatus: byStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    bySecurityLevel: bySecurityLevel.reduce(
      (acc, item) => {
        acc[item.securityLevel] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    ),
    confidential: confidentialCount,
    pendingReview: pendingReview,
  };
}
