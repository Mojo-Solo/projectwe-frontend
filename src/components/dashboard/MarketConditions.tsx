"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MarketConditionsProps {
  detailed?: boolean;
}

export function MarketConditions({ detailed = false }: MarketConditionsProps) {
  const marketData = [
    { month: "Jan", index: 72, deals: 45 },
    { month: "Feb", index: 75, deals: 52 },
    { month: "Mar", index: 78, deals: 58 },
    { month: "Apr", index: 82, deals: 61 },
    { month: "May", index: 85, deals: 67 },
    { month: "Jun", index: 88, deals: 72 },
  ];

  const marketIndicators = [
    {
      name: "M&A Activity",
      value: 88,
      change: 12,
      trend: "up",
      description: "Deal volume up 15% YoY",
    },
    {
      name: "Buyer Demand",
      value: 92,
      change: 8,
      trend: "up",
      description: "Strong interest in tech sector",
    },
    {
      name: "Valuations",
      value: 76,
      change: -3,
      trend: "down",
      description: "Slight compression in multiples",
    },
    {
      name: "Credit Markets",
      value: 70,
      change: 0,
      trend: "stable",
      description: "Stable financing conditions",
    },
  ];

  const sectorPerformance = [
    { sector: "Technology", performance: "+18%", rating: "Hot" },
    { sector: "Healthcare", performance: "+12%", rating: "Strong" },
    { sector: "Manufacturing", performance: "+5%", rating: "Moderate" },
    { sector: "Retail", performance: "-2%", rating: "Cool" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Hot":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "Strong":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Cool":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Market Conditions
            </CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-700">Favorable</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Index Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="index"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                name="Market Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Indicators */}
        <div className="grid grid-cols-2 gap-3">
          {marketIndicators
            .slice(0, detailed ? marketIndicators.length : 2)
            .map((indicator, index) => (
              <motion key={index}.div
                key={indicator.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{indicator.name}</span>
                  {getTrendIcon(indicator.trend)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{indicator.value}</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      indicator.change > 0
                        ? "text-green-600"
                        : indicator.change < 0
                          ? "text-red-600"
                          : "text-gray-600",
                    )}
                  >
                    {indicator.change > 0 ? "+" : ""}
                    {indicator.change}%
                  </span>
                </div>
                {detailed && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {indicator.description}
                  </p>
                )}
              </motion.div>
            ))}
        </div>

        {/* Sector Performance */}
        {detailed && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Sector Performance
            </h4>
            <div className="space-y-2">
              {sectorPerformance.map((sector, index) => (
                <motion key={index}.div
                  key={sector.sector}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <span className="text-sm font-medium">{sector.sector}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        sector.performance.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {sector.performance}
                    </span>
                    <Badge
                      className={cn("text-xs", getRatingColor(sector.rating))}
                    >
                      {sector.rating}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Market Summary */}
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-sm">
            <span className="font-medium">Market Outlook:</span> Current
            conditions favor sellers with strong M&A activity and buyer demand.
            Optimal window for exit in next 6-12 months.
          </p>
        </div>

        {/* Actions */}
        <Button className="w-full" variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full Market Report
        </Button>
      </CardContent>
    </Card>
  );
}
