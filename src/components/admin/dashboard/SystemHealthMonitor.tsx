"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

interface SystemHealthProps {
  health: {
    apiUptime: number;
    avgResponseTime: number;
    errorRate: number;
    activeJobs: number;
  };
}

export default function SystemHealthMonitor({ health }: SystemHealthProps) {
  const getHealthStatus = () => {
    if (health.apiUptime >= 99.9 && health.errorRate < 0.1) return "healthy";
    if (health.apiUptime >= 99 && health.errorRate < 1) return "degraded";
    return "unhealthy";
  };

  const status = getHealthStatus();
  const statusConfig = {
    healthy: { label: "Healthy", color: "text-green-600", icon: CheckCircle2 },
    degraded: {
      label: "Degraded",
      color: "text-yellow-600",
      icon: AlertCircle,
    },
    unhealthy: { label: "Unhealthy", color: "text-red-600", icon: AlertCircle },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system performance</CardDescription>
          </div>
          <Badge
            variant={status === "healthy" ? "default" : "destructive"}
            className="flex items-center space-x-1"
          >
            <StatusIcon className="h-3 w-3" />
            <span>{config.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">API Uptime</span>
            <span className="text-sm text-gray-600">{health.apiUptime}%</span>
          </div>
          <Progress value={health.apiUptime} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Response Time</span>
            <span className="text-sm text-gray-600">
              {health.avgResponseTime}ms
            </span>
          </div>
          <Progress
            value={Math.min(((200 - health.avgResponseTime) / 200) * 100, 100)}
            className="h-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Error Rate</span>
            <span className="text-sm text-gray-600">{health.errorRate}%</span>
          </div>
          <Progress
            value={Math.min(health.errorRate * 10, 100)}
            className="h-2"
          />
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Active Jobs</span>
            </div>
            <span className="text-sm font-medium">{health.activeJobs}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
