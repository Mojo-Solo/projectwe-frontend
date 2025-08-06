import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { aiFeedbacks, aiInteractionAnalytics } from "@/db/schema";
import { and, eq, gte, lte, desc, sql } from "drizzle-orm";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... POST and GET handlers remain the same

async function updateResponseAnalytics(
  responseId: string,
  rating: string,
  score?: number,
) {
  try {
    const [existing] = await db
      .select()
      .from(aiInteractionAnalytics)
      .where(eq(aiInteractionAnalytics.id, responseId))
      .limit(1);

    if (existing) {
      await db
        .update(aiInteractionAnalytics)
        .set({
          userRating: score || (rating === "positive" ? 5 : 1),
          userFeedback: rating,
        })
        .where(eq(aiInteractionAnalytics.id, responseId));
    } else {
      // In a real implementation, you would probably create a new record here
    }
  } catch (error) {
    console.error("Failed to update response analytics:", error);
  }
}

// ... calculateFeedbackAnalytics remains the same
