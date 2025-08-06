import { isDbAvailable, requireDbAsync } from '@/lib/db-guard';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-compat";
import bcrypt from "bcryptjs";

export async function GET() {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
  
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const orgCount = await prisma.organization.count();

    return NextResponse.json({
      status: "success",
      database: "connected",
      stats: {
        users: userCount,
        organizations: orgCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create test organization
    const organization = await prisma.organization.create({
      data: {
        name: "Test Organization",
        slug: `test-${Date.now()}`,
        plan: "STARTER",
      },
    });

    // Create test user
    const user = await prisma.user.create({
      data: {
        email,
        name: "Test User",
        password: hashedPassword,
        role: "OWNER",
        organizationId: organization.id,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}