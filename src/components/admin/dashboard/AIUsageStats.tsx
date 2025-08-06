
interface AIUsageStatsProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, FileText, TrendingUp } from "lucide-react";

export default function AIUsageStats() {
  const aiStats = {
    totalRequests: 48293,
    dailyRequests: 1847,
    avgProcessingTime: 2.3,
    successRate: 98.7,
    topAgents: [
      { name: "Exit Strategy Generator", usage: 35, icon: FileText },
      { name: "Market Analyzer", usage: 28, icon: TrendingUp },
      { name: "Document Processor", usage: 22, icon: Brain },
      { name: "Stakeholder Advisor", usage: 15, icon: Bot },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Usage Statistics</CardTitle>
        <CardDescription>AI agent performance and usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Daily Requests</p>
            <p className="text-2xl font-bold">
              {aiStats.dailyRequests.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold">{aiStats.successRate}%</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Top AI Agents by Usage</p>
          <div className="space-y-3">
            {aiStats.topAgents.map((agent, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <agent.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{agent.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{agent.usage}%</span>
                </div>
                <Progress value={agent.usage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t text-center">
          <p className="text-xs text-gray-500">
            Avg processing time: {aiStats.avgProcessingTime}s
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
