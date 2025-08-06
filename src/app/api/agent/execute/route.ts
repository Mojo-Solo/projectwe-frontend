import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

const execAsync = promisify(exec);

// Allowed commands for security
const ALLOWED_COMMANDS = ["init", "plan", "build", "review", "fix"];

export async function POST(request: NextRequest) {
  try {
    const { command, args = "" } = await request.json();

    // Validate command
    if (!command || !ALLOWED_COMMANDS.includes(command)) {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    // Get the project root directory
    const projectRoot = process.cwd();
    const commandPath = path.join(projectRoot, "COMMANDS", command);

    // Check if command exists
    try {
      await fs.access(commandPath);
    } catch {
      return NextResponse.json(
        { error: `Command '${command}' not found` },
        { status: 404 },
      );
    }

    // Execute the command
    const env = {
      ...process.env,
      DRY_RUN: "0", // Enable actual execution
      TOK_CAP: "2000",
      VEC_CAP: "2000",
    };

    const { stdout, stderr } = await execAsync(`${commandPath} ${args}`, {
      cwd: projectRoot,
      env,
      timeout: 30000, // 30 second timeout
    });

    // Read logs if available
    const logsDir = path.join(projectRoot, "agent_logs");
    let logs = {};

    try {
      const files = await fs.readdir(logsDir);
      for (const file of files.slice(-5)) {
        // Last 5 files
        const content = await fs.readFile(path.join(logsDir, file), "utf-8");
        logs[file] = content;
      }
    } catch {
      // Logs directory might not exist
    }

    return NextResponse.json({
      success: true,
      command,
      output: stdout,
      error: stderr,
      logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent execution error:", error);
    return NextResponse.json(
      {
        error: "Command execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
