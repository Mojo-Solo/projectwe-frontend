import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { documents, documentVersions, users } from "@/db/schema";
import { and, eq, or, sql, count, desc } from "drizzle-orm";
import {
  createStorageService,
  getWorkspaceStorageKey,
  validateFileType,
  validateFileSize,
  ALLOWED_DOCUMENT_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/document-storage";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ... GET and POST handlers remain the same

// Document access checking moved to @/lib/document-access.ts
