"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  FileCode,
  GitBranch,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TruthLabel {
  id: string;
  file: string;
  label: string;
  status: "verified" | "unverified" | "error";
  confidence: number;
  lastChecked: Date;
}

interface TruthLabelStatusProps {
  compact?: boolean;
}

export function TruthLabelStatus({ compact = false }: TruthLabelStatusProps) {
  const [labels, setLabels] = useState<TruthLabel[]>([
    {
      id: "1",
      file: "src/lib/auth.ts",
      label: "AUTH_SYSTEM_VERIFIED",
      status: "verified",
      confidence: 100,
      lastChecked: new Date(),
    },
    {
      id: "2",
      file: "src/api/routes.ts",
      label: "API_ROUTES_STABLE",
      status: "verified",
      confidence: 95,
      lastChecked: new Date(),
    },
    {
      id: "3",
      file: "src/components/Dashboard.tsx",
      label: "UI_COMPONENTS_TESTED",
      status: "unverified",
      confidence: 60,
      lastChecked: new Date(),
    },
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const stats = {
    total: labels.length,
    verified: labels.filter((l) => l.status === "verified").length,
    unverified: labels.filter((l) => l.status === "unverified").length,
    errors: labels.filter((l) => l.status === "error").length,
    averageConfidence: Math.round(
      labels.reduce((acc, l) => acc + l.confidence, 0) / labels.length,
    ),
  };

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update some labels randomly to simulate real scanning
    setLabels((prev) =>
      prev.map((label) => ({
        ...label,
        confidence: Math.min(100, label.confidence + Math.random() * 10),
        lastChecked: new Date(),
        status: label.confidence > 80 ? "verified" : label.status,
      })),
    );

    setIsScanning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">Truth Label Status</span>
          </div>
          <Badge
            variant={stats.verified === stats.total ? "default" : "secondary"}
          >
            {stats.verified}/{stats.total} Verified
          </Badge>
        </div>
        <Progress
          value={(stats.verified / stats.total) * 100}
          className="h-2"
        />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>{stats.verified} Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <span>{stats.unverified} Pending</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.verified}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unverified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.unverified}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Truth Labels Overview</CardTitle>
              <CardDescription>
                Monitor and verify truth labels across your codebase
              </CardDescription>
            </div>
            <Button onClick={handleScan} disabled={isScanning} size="sm">
              {isScanning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(label.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{label.file}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Code className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {label.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {label.confidence}% confidence
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last checked: {label.lastChecked.toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      label.status === "verified" ? "default" : "secondary"
                    }
                    className={cn(getStatusColor(label.status))}
                  >
                    {label.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {stats.unverified > 0 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {stats.unverified} truth label{stats.unverified > 1 ? "s" : ""}{" "}
                require verification. Run a scan to update their status.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
