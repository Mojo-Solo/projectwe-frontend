import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Serve local storage files
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  // Only serve files if using local storage
  if (process.env.STORAGE_PROVIDER === "s3") {
    return NextResponse.json(
      { error: "Not available with S3 storage" },
      { status: 404 },
    );
  }

  try {
    const filePath = params.path.join("/");
    const localPath = path.join(
      process.cwd(),
      process.env.LOCAL_STORAGE_PATH || "./storage/documents",
      filePath,
    );

    // Security: Ensure the path doesn't escape the storage directory
    const normalizedPath = path.normalize(localPath);
    const storageRoot = path.normalize(
      path.join(
        process.cwd(),
        process.env.LOCAL_STORAGE_PATH || "./storage/documents",
      ),
    );

    if (!normalizedPath.startsWith(storageRoot)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(normalizedPath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const file = await fs.readFile(normalizedPath);

    // Determine content type
    const ext = path.extname(normalizedPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".txt": "text/plain",
      ".json": "application/json",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    // Return file
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": file.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File serving error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
