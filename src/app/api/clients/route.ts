import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { clients, users, clientActivities } from "@/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { clientEvents } from "@/lib/pusher-server";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
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

    // Build query based on user role
    const baseQuery = db
      .select({
        id: clients.id,
        firstName: clients.firstName,
        lastName: clients.lastName,
        email: clients.email,
        companyName: clients.companyName,
        status: clients.status,
        createdAt: clients.createdAt,
        lastContactedAt: clients.lastContactedAt,
      })
      .from(clients)
      .where(eq(clients.organizationId, session.user.organizationId))
      .orderBy(desc(clients.createdAt));

    const clientList = await baseQuery;

    return NextResponse.json({
      clients: clientList,
      total: clientList.length,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const createClientSchema = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      companyName: z.string().min(1),
      jobTitle: z.string().optional(),
      industry: z.string().min(1),
      subIndustry: z.string().optional(),
      companySize: z
        .enum(["MICRO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"])
        .optional(),
      website: z.string().url().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    });

    const validatedData = createClientSchema.parse(body);

    // Filter out undefined values
    const insertData: any = {
      organizationId: session.user.organizationId,
      status: "PROSPECT",
      createdBy: session.user.id,
      lastUpdatedBy: session.user.id,
    };

    // Add validated data, filtering out undefined values
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        insertData[key] = value;
      }
    });

    const [client] = await db.insert(clients).values(insertData).returning();

    await db.insert(clientActivities).values({
      clientId: client.id,
      userId: session.user.id,
      type: "NOTE_ADDED",
      title: "Client Created",
      description: `Client profile created by ${session.user.name}`,
      completedAt: new Date(),
    });

    // Real-time update
    await clientEvents.trigger(
      `organization-${session.user.organizationId}`,
      "client-created",
      {
        client,
        createdBy: session.user.name,
      },
    );

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Database error in POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
