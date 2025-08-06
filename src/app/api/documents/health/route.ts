import { NextRequest, NextResponse } from "next/server";
import db, { sql } from "../../../../../lib/db";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

// Force dynamic rendering to prevent static export errors
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET_NAME =
  process.env.AWS_S3_BUCKET || process.env.S3_BUCKET || "we-exit-documents";

export async function GET(req: NextRequest) {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      storage: "unknown",
      virusScanner: "unknown",
    },
    configuration: {
      maxFileSize: process.env.MAX_FILE_SIZE || "104857600",
      storageProvider: process.env.STORAGE_PROVIDER || "s3",
      virusScanEnabled: process.env.VIRUS_SCAN_ENABLED === "true",
      bucket: BUCKET_NAME,
    },
  };

  try {
    // Check database connection
    try {
      await db.execute(sql`SELECT 1`);
      healthStatus.services.database = "healthy";
    } catch (error) {
      healthStatus.services.database = "unhealthy";
      healthStatus.status = "degraded";
      console.error("Database health check failed:", error);
    }

    // Check S3 connection
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      try {
        const s3Client = new S3Client({
          region: process.env.AWS_REGION || "us-east-1",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });

        const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
        await s3Client.send(command);
        healthStatus.services.storage = "healthy";
      } catch (error: any) {
        healthStatus.services.storage = "unhealthy";
        healthStatus.status = "degraded";
        console.error("S3 health check failed:", error);

        // Add more specific error info
        if (error.name === "NoSuchBucket") {
          healthStatus.services.storage = "bucket_not_found";
        } else if (error.name === "AccessDenied") {
          healthStatus.services.storage = "access_denied";
        }
      }
    } else {
      healthStatus.services.storage = "not_configured";
      if (process.env.STORAGE_PROVIDER === "s3") {
        healthStatus.status = "degraded";
      }
    }

    // Check virus scanner
    if (process.env.VIRUS_SCAN_ENABLED === "true") {
      if (process.env.CLAMAV_HOST && process.env.CLAMAV_PORT) {
        // In production, you would actually try to connect to ClamAV
        healthStatus.services.virusScanner = "configured";
      } else {
        healthStatus.services.virusScanner = "not_configured";
        healthStatus.status = "degraded";
      }
    } else {
      healthStatus.services.virusScanner = "disabled";
    }

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        ...healthStatus,
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
