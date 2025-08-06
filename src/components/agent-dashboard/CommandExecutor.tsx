"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Terminal,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommandExecutorProps {
  onExecute: (command: string, output: string) => void;
}

const AGENT_COMMANDS = [
  { value: "init", label: "Init - Initialize project context", icon: Terminal },
  {
    value: "plan",
    label: "Plan - Generate implementation plan",
    icon: Terminal,
  },
  { value: "build", label: "Build - Execute implementation", icon: Terminal },
  {
    value: "review",
    label: "Review - Code review and analysis",
    icon: Terminal,
  },
  {
    value: "fix",
    label: "Fix - Apply corrections and improvements",
    icon: Terminal,
  },
];

export function CommandExecutor({ onExecute }: CommandExecutorProps) {
  const [selectedCommand, setSelectedCommand] = useState<string>("");
  const [additionalArgs, setAdditionalArgs] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleExecute = async () => {
    if (!selectedCommand) return;

    setIsExecuting(true);
    setLastResult(null);

    try {
      const response = await fetch("/api/agent/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: selectedCommand,
          args: additionalArgs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Command execution failed");
      }

      const output = data.output || `Command '${selectedCommand}' completed`;
      onExecute(selectedCommand, output);

      setLastResult({
        success: true,
        message: `Command '${selectedCommand}' executed successfully`,
      });
    } catch (error) {
      setLastResult({
        success: false,
        message: `Failed to execute command: ${error}`,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Command</label>
        <Select value={selectedCommand} onValueChange={setSelectedCommand}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a command to execute" />
          </SelectTrigger>
          <SelectContent>
            {AGENT_COMMANDS.map((cmd) => (
              <SelectItem key={cmd.value} value={cmd.value}>
                <div className="flex items-center gap-2">
                  <cmd.icon className="h-4 w-4" />
                  <span>{cmd.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Additional Arguments (Optional)
        </label>
        <Textarea
          value={additionalArgs}
          onChange={(e) => setAdditionalArgs(e.target.value)}
          placeholder="Enter additional command arguments..."
          className="min-h-[80px] font-mono text-sm"
        />
      </div>

      <Button
        onClick={handleExecute}
        disabled={!selectedCommand || isExecuting}
        className="w-full"
        size="lg"
      >
        {isExecuting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Execute Command
          </>
        )}
      </Button>

      {lastResult && (
        <Alert variant={lastResult.success ? "default" : "destructive"}>
          {lastResult.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{lastResult.message}</AlertDescription>
        </Alert>
      )}

      {selectedCommand && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Command Preview:</p>
              <code className="block rounded bg-background p-3 text-sm font-mono">
                true-one {selectedCommand} {additionalArgs}
              </code>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
