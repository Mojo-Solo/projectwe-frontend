import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const logsDir = path.join(projectRoot, "agent_logs");

    // Check for truth labels in recent files
    let inferenceCount = 0;
    let speculationCount = 0;
    let confidence = 0;

    try {
      const files = await fs.readdir(logsDir);
      for (const file of files.slice(-10)) {
        // Check last 10 files
        if (file.endsWith(".md")) {
          const content = await fs.readFile(path.join(logsDir, file), "utf-8");

          const inferenceMatches = content.match(/\[Inference\]/g);
          const speculationMatches = content.match(/\[Speculation\]/g);

          inferenceCount += inferenceMatches?.length || 0;
          speculationCount += speculationMatches?.length || 0;
        }
      }

      // Calculate confidence based on label presence
      if (inferenceCount > 0 && speculationCount > 0) {
        confidence = Math.min(
          (inferenceCount + speculationCount) / 20, // Normalize to 0-1
          1,
        );
      }
    } catch {
      // Logs directory might not exist
    }

    // Check for NEXT_LAYER
    let nextLayer = 1;
    try {
      const nextLayerFile = await fs.readFile(
        path.join(logsDir, "next_layer.env"),
        "utf-8",
      );
      const match = nextLayerFile.match(/NEXT_LAYER=(\d+)/);
      if (match) {
        nextLayer = parseInt(match[1], 10);
      }
    } catch {
      // File might not exist
    }

    // Get context usage (simulated for now)
    const contextUsage = {
      tokens: {
        used: Math.floor(Math.random() * 1500) + 500,
        cap: 2000,
      },
      vectors: {
        used: Math.floor(Math.random() * 1500) + 500,
        cap: 2000,
      },
    };

    return NextResponse.json({
      truthLabels: {
        inference: inferenceCount > 0,
        speculation: speculationCount > 0,
        inferenceCount,
        speculationCount,
      },
      confidence,
      nextLayer,
      contextUsage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting agent status:", error);
    return NextResponse.json(
      { error: "Failed to get agent status" },
      { status: 500 },
    );
  }
}
