import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");
    
    const logsDir = path.join(process.cwd(), "agent_logs");
    
    // If specific file requested
    if (file) {
      // Prevent directory traversal
      if (file.includes("..") || file.includes("/")) {
        return NextResponse.json(
          { error: "Invalid file name" },
          { status: 400 }
        );
      }
      
      try {
        const content = await fs.readFile(
          path.join(logsDir, file),
          "utf-8"
        );
        
        return NextResponse.json({
          file,
          content,
          timestamp: new Date().toISOString(),
        });
      } catch {
        return NextResponse.json(
          { error: "Log file not found" },
          { status: 404 }
        );
      }
    }
    
    // List all log files
    try {
      const files = await fs.readdir(logsDir);
      const logFiles = await Promise.all(
        files.map(async (file) => {
          const stat = await fs.stat(path.join(logsDir, file));
          return {
            name: file,
            size: stat.size,
            modified: stat.mtime.toISOString(),
          };
        })
      );
      
      // Sort by modified time, newest first
      logFiles.sort((a, b) => 
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );
      
      return NextResponse.json({
        logs: logFiles,
        count: logFiles.length,
      });
    } catch {
      // Logs directory might not exist
      return NextResponse.json({
        logs: [],
        count: 0,
      });
    }
  } catch (error) {
    console.error("Error reading logs:", error);
    return NextResponse.json(
      { error: "Failed to read logs" },
      { status: 500 }
    );
  }
}