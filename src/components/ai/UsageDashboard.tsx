"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Activity,
  Zap,
  AlertTriangle,
  TrendingUp,
  Settings,
  Gauge,
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageStats {
  period: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageCost: number;
  providerBreakdown: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
    }
  >;
  operationBreakdown: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
    }
  >;
}

interface UsageLimits {
  dailyTokens?: number;
  monthlyTokens?: number;
  dailyCost?: number;
  monthlyCost?: number;
  maxRequestsPerHour?: number;
  maxConcurrentSessions?: number;
}

interface DashboardData {
  dailyStats: UsageStats;
  monthlyStats: UsageStats;
  limits: UsageLimits;
  currentUsage: {
    daily: { tokens: number; cost: number };
    monthly: { tokens: number; cost: number };
  };
  warnings: string[];
  withinLimits: boolean;
}

interface UsageDashboardProps {
  className?: string;
}

export function UsageDashboard({ className }: UsageDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsageData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/ai/usage");
      if (!response.ok) {
        throw new Error("Failed to fetch usage data");
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsageData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchUsageData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchUsageData, Refresh, every, 5, minutes, const, interval, 60, 1000, return, clearInterval]);

  const calculateUsagePercentage = (
    current: number,
    limit?: number,
  ): number => {
    if (!limit) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-orange-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>Error loading usage data: {error}</span>
          </div>
          <Button
            onClick={fetchUsageData}
            className="mt-4 w-full"
            variant="outline"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const dailyTokensPercentage = calculateUsagePercentage(
    data.currentUsage.daily.tokens,
    data.limits.dailyTokens,
  );
  const monthlyTokensPercentage = calculateUsagePercentage(
    data.currentUsage.monthly.tokens,
    data.limits.monthlyTokens,
  );
  const dailyCostPercentage = calculateUsagePercentage(
    data.currentUsage.daily.cost,
    data.limits.dailyCost,
  );
  const monthlyCostPercentage = calculateUsagePercentage(
    data.currentUsage.monthly.cost,
    data.limits.monthlyCost,
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-6 h-6" />
          <h2 className="text-2xl font-bold">AI Usage Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.withinLimits ? "default" : "destructive"}>
            {data.withinLimits ? "Within Limits" : "Limits Exceeded"}
          </Badge>
          <Button
            onClick={fetchUsageData}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Usage Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {data.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-orange-700">
                  • {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Daily Tokens
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {data.currentUsage.daily.tokens.toLocaleString()}
                  </p>
                  {data.limits.dailyTokens && (
                    <span
                      className={cn(
                        "text-sm",
                        getUsageColor(dailyTokensPercentage),
                      )}
                    >
                      /{data.limits.dailyTokens.toLocaleString()}
                    </span>
                  )}
                </div>
                {data.limits.dailyTokens && (
                  <Progress
                    value={dailyTokensPercentage}
                    className="mt-2 h-2"
                  />
                )}
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Daily Cost
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    ${data.currentUsage.daily.cost.toFixed(2)}
                  </p>
                  {data.limits.dailyCost && (
                    <span
                      className={cn(
                        "text-sm",
                        getUsageColor(dailyCostPercentage),
                      )}
                    >
                      /${data.limits.dailyCost.toFixed(2)}
                    </span>
                  )}
                </div>
                {data.limits.dailyCost && (
                  <Progress value={dailyCostPercentage} className="mt-2 h-2" />
                )}
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Tokens
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {data.currentUsage.monthly.tokens.toLocaleString()}
                  </p>
                  {data.limits.monthlyTokens && (
                    <span
                      className={cn(
                        "text-sm",
                        getUsageColor(monthlyTokensPercentage),
                      )}
                    >
                      /{data.limits.monthlyTokens.toLocaleString()}
                    </span>
                  )}
                </div>
                {data.limits.monthlyTokens && (
                  <Progress
                    value={monthlyTokensPercentage}
                    className="mt-2 h-2"
                  />
                )}
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Cost
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    ${data.currentUsage.monthly.cost.toFixed(2)}
                  </p>
                  {data.limits.monthlyCost && (
                    <span
                      className={cn(
                        "text-sm",
                        getUsageColor(monthlyCostPercentage),
                      )}
                    >
                      /${data.limits.monthlyCost.toFixed(2)}
                    </span>
                  )}
                </div>
                {data.limits.monthlyCost && (
                  <Progress
                    value={monthlyCostPercentage}
                    className="mt-2 h-2"
                  />
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Breakdown (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.monthlyStats.providerBreakdown).map(
                  ([provider, stats]) => (
                    <div
                      key={provider}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="font-medium capitalize">{provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {stats.requests} requests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${stats.cost.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operation Breakdown (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.monthlyStats.operationBreakdown).map(
                  ([operation, stats]) => (
                    <div
                      key={operation}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium capitalize">{operation}</p>
                          <p className="text-sm text-muted-foreground">
                            {stats.requests} requests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${stats.cost.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Daily vs Monthly</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Requests</span>
                        <span>
                          {data.dailyStats.totalRequests} /{" "}
                          {data.monthlyStats.totalRequests}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tokens</span>
                        <span>
                          {data.dailyStats.totalTokens.toLocaleString()} /{" "}
                          {data.monthlyStats.totalTokens.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost</span>
                        <span>
                          ${data.dailyStats.totalCost.toFixed(2)} / $
                          {data.monthlyStats.totalCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Efficiency Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg Cost/Request</span>
                        <span>${data.monthlyStats.averageCost.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tokens/Request</span>
                        <span>
                          {data.monthlyStats.totalRequests > 0
                            ? Math.round(
                                data.monthlyStats.totalTokens /
                                  data.monthlyStats.totalRequests,
                              )
                            : 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost/1K Tokens</span>
                        <span>
                          $
                          {data.monthlyStats.totalTokens > 0
                            ? (
                                (data.monthlyStats.totalCost /
                                  data.monthlyStats.totalTokens) *
                                1000
                              ).toFixed(4)
                            : "0.0000"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
