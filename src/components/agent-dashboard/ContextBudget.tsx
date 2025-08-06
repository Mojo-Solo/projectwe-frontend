"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Database,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  RefreshCw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextMetrics {
  tokensUsed: number;
  tokenCap: number;
  vectorsUsed: number;
  vectorCap: number;
  costEstimate: number;
  efficiency: number;
}

export function ContextBudget() {
  const [metrics, setMetrics] = useState<ContextMetrics>({
    tokensUsed: 75000,
    tokenCap: 100000,
    vectorsUsed: 4500,
    vectorCap: 10000,
    costEstimate: 2.45,
    efficiency: 85,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const tokenPercentage = (metrics.tokensUsed / metrics.tokenCap) * 100;
  const vectorPercentage = (metrics.vectorsUsed / metrics.vectorCap) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return "destructive";
    if (percentage > 70) return "warning";
    return "default";
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update with simulated new data
    setMetrics((prev) => ({
      ...prev,
      tokensUsed: Math.min(
        prev.tokenCap,
        prev.tokensUsed + Math.random() * 1000,
      ),
      vectorsUsed: Math.min(
        prev.vectorCap,
        prev.vectorsUsed + Math.random() * 100,
      ),
      costEstimate: prev.costEstimate + Math.random() * 0.1,
      efficiency: Math.max(
        70,
        Math.min(95, prev.efficiency + (Math.random() - 0.5) * 5),
      ),
    }));

    setIsRefreshing(false);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Token Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.tokensUsed)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatNumber(metrics.tokenCap)} TOK_CAP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Vector Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.vectorsUsed)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatNumber(metrics.vectorCap)} VEC_CAP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {metrics.efficiency}%
            </div>
            <p className="text-xs text-muted-foreground">Context utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Est. Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.costEstimate.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current session</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Context Budget Overview</CardTitle>
              <CardDescription>
                Monitor token and vector capacity usage in real-time
              </CardDescription>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Token Capacity (TOK_CAP)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {tokenPercentage.toFixed(1)}%
                  </span>
                  <Badge variant={getProgressColor(tokenPercentage) as any}>
                    {formatNumber(metrics.tokensUsed)} /{" "}
                    {formatNumber(metrics.tokenCap)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={tokenPercentage}
                className={cn(
                  "h-3",
                  tokenPercentage > 90 && "[&>div]:bg-destructive",
                  tokenPercentage > 70 &&
                    tokenPercentage <= 90 &&
                    "[&>div]:bg-yellow-500",
                )}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Vector Capacity (VEC_CAP)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {vectorPercentage.toFixed(1)}%
                  </span>
                  <Badge variant={getProgressColor(vectorPercentage) as any}>
                    {formatNumber(metrics.vectorsUsed)} /{" "}
                    {formatNumber(metrics.vectorCap)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={vectorPercentage}
                className={cn(
                  "h-3",
                  vectorPercentage > 90 && "[&>div]:bg-destructive",
                  vectorPercentage > 70 &&
                    vectorPercentage <= 90 &&
                    "[&>div]:bg-yellow-500",
                )}
              />
            </div>
          </div>

          {tokenPercentage > 80 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High Token Usage</AlertTitle>
              <AlertDescription>
                Token usage is at {tokenPercentage.toFixed(1)}% of capacity.
                Consider optimizing context or increasing TOK_CAP.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Optimization Tips</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Use semantic compression to reduce token usage by up to 30%
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Archive old vectors to free up VEC_CAP space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Enable incremental context updates for better efficiency
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Avg. Token/Operation</span>
                  </div>
                  <span className="text-sm font-medium">2,450</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cost/1K Tokens</span>
                  </div>
                  <span className="text-sm font-medium">$0.03</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
