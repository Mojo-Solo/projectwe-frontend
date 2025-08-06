import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { users, emailUnsubscribes, activityLogs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... GET, POST, PUT handlers and schemas remain the same

export async function DELETE(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || session?.user?.id;
    const categories = searchParams.getAll("category");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const [user] = await db
      .select({ settings: users.settings })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse current settings
    const currentSettings =
      typeof user.settings === "string"
        ? JSON.parse(user.settings)
        : user.settings || {};

    const currentNotifications = currentSettings.notifications || {};

    // Re-enable notifications for specified categories or all if none specified
    const updatedNotifications = { ...currentNotifications };
    if (categories.length > 0) {
      categories.forEach((category) => {
        updatedNotifications[category] = true;
      });
    } else {
      // Re-enable all notifications
      Object.keys(updatedNotifications).forEach((key) => {
        updatedNotifications[key] = true;
      });
      // Also enable defaults if no notifications exist
      if (Object.keys(updatedNotifications).length === 0) {
        updatedNotifications.email = true;
        updatedNotifications.sms = true;
        updatedNotifications.push = true;
      }
    }

    await db
      .update(users)
      .set({
        settings: {
          ...currentSettings,
          notifications: updatedNotifications,
          updatedAt: new Date(),
        },
      })
      .where(eq(users.id, userId));

    await db.insert(activityLogs).values({
      userId,
      organizationId: session?.user?.organizationId || "system",
      action: "email_resubscribed",
      resourceType: "user",
      resourceId: userId,
      metadata: {
        categories: categories.length > 0 ? categories : ["all"],
      },
    });

    return NextResponse.json({
      success: true,
      message:
        categories.length > 0
          ? `Re-subscribed to ${categories.join(", ")} emails`
          : "Re-subscribed to all emails",
    });
  } catch (error) {
    console.error("Database error in DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
