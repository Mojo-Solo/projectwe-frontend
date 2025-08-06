"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommandExecutor } from "@/components/agent-dashboard/CommandExecutor";
import { LogViewer } from "@/components/agent-dashboard/LogViewer";
import { TruthLabelStatus } from "@/components/agent-dashboard/TruthLabelStatus";
import { ContextBudget } from "@/components/agent-dashboard/ContextBudget";
import { PRTemplateGenerator } from "@/components/agent-dashboard/PRTemplateGenerator";
import { Brain, Code, FileText, GitBranch, Terminal } from "lucide-react";

export default function AgentDashboardPage() {
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleCommandExecute = (command: string, output: string) => {
    setActiveCommand(command);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${command}: ${output}`,
    ]);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          True One® Engineering Assistant
        </h2>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Tabs defaultValue="command" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="command" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="truth" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Truth Labels
          </TabsTrigger>
          <TabsTrigger value="context" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Context Budget
          </TabsTrigger>
          <TabsTrigger value="pr" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            PR Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="command" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Command Executor</CardTitle>
                <CardDescription>
                  Execute True One® agent commands: init, plan, build, review,
                  fix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommandExecutor onExecute={handleCommandExecute} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Status</CardTitle>
                <CardDescription>
                  Current agent state and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TruthLabelStatus compact />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Agent Logs</CardTitle>
              <CardDescription>
                Real-time output from agent_logs/ directory
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <LogViewer logs={logs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="truth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Truth Label Verification</CardTitle>
              <CardDescription>
                Monitor and verify truth labels across the codebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TruthLabelStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Context Budget Management</CardTitle>
              <CardDescription>
                Monitor token and vector capacity usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContextBudget />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PR Template Generator</CardTitle>
              <CardDescription>
                Generate properly formatted pull requests with X/WHY/Z structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PRTemplateGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
