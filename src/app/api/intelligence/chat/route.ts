import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  conversations,
  aiAgents,
  documents,
  businessMetrics,
  projects,
} from "@/db/schema";
import { and, eq, or, desc, sql } from "drizzle-orm";
import { z } from "zod";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... POST handler and other setup remains the same

async function getRelevantContext(
  query: string,
  namespace: string,
  organizationId: string,
): Promise<string> {
  const contexts: string[] = [];

  if (namespace === "mojosolo-transcripts" || namespace === "all") {
    const docs = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.organizationId, organizationId),
          or(
            sql`content ILIKE ${"%" + query + "%"}`,
            sql`title ILIKE ${"%" + query + "%"}`,
          ),
        ),
      )
      .orderBy(desc(documents.createdAt))
      .limit(5);
    // ... context assembly logic
  }

  // ... other namespace logic

  return contexts.join("\n\n---\n\n");
}

// ... other helper functions to be refactored
