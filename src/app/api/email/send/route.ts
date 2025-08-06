import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { emails, emailTemplates, emailEvents, users } from "@/db/schema";
import { and, eq, sql, count, desc } from "drizzle-orm";
import { z } from "zod";
import { sendEmail } from "@/lib/email/email-service";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... POST and GET handlers and schemas remain the same

async function checkEmailPermissions(
  userId: string,
  emailType: string,
): Promise<boolean> {
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "OWNER") return true;

  const allowedTypes = [
    "task_assignment",
    "task_update",
    "document_analysis_complete",
    "custom",
  ];
  return allowedTypes.includes(emailType);
}

async function checkRecipientPreferences(
  userId: string,
  emailType: string,
): Promise<boolean> {
  const [user] = await db
    .select({ settings: users.settings })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return true;

  const settings = (user.settings as Record<string, any>) || {};
  const notifications = settings.notifications || {};
  if (notifications.emailNotifications === false) return false;

  switch (emailType) {
    case "marketing":
      return notifications.marketingEmails !== false;
    // ... other cases
    default:
      return true;
  }
}

// ... applyTemplateData remains the same
