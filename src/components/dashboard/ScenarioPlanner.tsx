"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Save,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function ScenarioPlanner() {
  const [scenarios, setScenarios] = useState({
    conservative: {
      revenueGrowth: 5,
      marginImprovement: 2,
      multipleExpansion: 0,
      timeToExit: 12,
    },
    moderate: {
      revenueGrowth: 10,
      marginImprovement: 5,
      multipleExpansion: 0.5,
      timeToExit: 9,
    },
    aggressive: {
      revenueGrowth: 20,
      marginImprovement: 10,
      multipleExpansion: 1,
      timeToExit: 6,
    },
  });

  const [customScenario, setCustomScenario] = useState({
    revenueGrowth: 10,
    marginImprovement: 5,
    multipleExpansion: 0.5,
    timeToExit: 9,
  });

  const baseMetrics = {
    currentRevenue: 5000000,
    currentEBITDA: 1000000,
    currentMultiple: 4.5,
  };

  const calculateProjection = (scenario: typeof customScenario) => {
    const months = Array.from({ length: scenario.timeToExit }, (_, i) => i + 1);
    const monthlyGrowth = scenario.revenueGrowth / 12 / 100;
    const monthlyMarginGrowth = scenario.marginImprovement / 12 / 100;

    return months.map((month) => {
      const revenue =
        baseMetrics.currentRevenue * Math.pow(1 + monthlyGrowth, month);
      const ebitdaMargin =
        (baseMetrics.currentEBITDA / baseMetrics.currentRevenue) *
        (1 + monthlyMarginGrowth * month);
      const ebitda = revenue * ebitdaMargin;
      const multiple =
        baseMetrics.currentMultiple +
        (scenario.multipleExpansion * month) / scenario.timeToExit;
      const valuation = ebitda * multiple;

      return {
        month: `M${month}`,
        revenue: Math.round(revenue),
        ebitda: Math.round(ebitda),
        valuation: Math.round(valuation),
        multiple: Math.round(multiple * 10) / 10,
      };
    });
  };

  const projections = {
    conservative: calculateProjection(scenarios.conservative),
    moderate: calculateProjection(scenarios.moderate),
    aggressive: calculateProjection(scenarios.aggressive),
    custom: calculateProjection(customScenario),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card key={index} className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Scenario Planning
            </CardTitle>
          </div>
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Scenarios
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
            <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            {/* Valuation Projection Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                    tickFormatter={(value) =>
                      `$${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line
                    data={projections.conservative}
                    type="monotone"
                    dataKey="valuation"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Conservative"
                    dot={false}
                  />
                  <Line
                    data={projections.moderate}
                    type="monotone"
                    dataKey="valuation"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Moderate"
                    dot={false}
                  />
                  <Line
                    data={projections.aggressive}
                    type="monotone"
                    dataKey="valuation"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Aggressive"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Scenario Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(scenarios).map(([name, scenario]) => {
                const finalProjection =
                  projections[name as keyof typeof projections].slice(-1)[0];
                const roi =
                  ((finalProjection.valuation -
                    baseMetrics.currentEBITDA * baseMetrics.currentMultiple) /
                    (baseMetrics.currentEBITDA * baseMetrics.currentMultiple)) *
                  100;

                return (
                  <motion key={scenario]}.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-lg border"
                  >
                    <h3 className="font-medium text-sm capitalize mb-3">
                      {name} Scenario
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Exit Value
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(finalProjection.valuation)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ROI</span>
                        <span className="font-semibold text-green-600">
                          +{Math.round(roi)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Timeline</span>
                        <span className="font-semibold">
                          {scenario.timeToExit} months
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Multiple</span>
                        <span className="font-semibold">
                          {finalProjection.multiple}x
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {/* Custom Scenario Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Revenue Growth Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[customScenario.revenueGrowth]}
                      onValueChange={(value) =>
                        setCustomScenario({
                          ...customScenario,
                          revenueGrowth: value[0],
                        })
                      }
                      min={0}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">
                      {customScenario.revenueGrowth}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>EBITDA Margin Improvement (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[customScenario.marginImprovement]}
                      onValueChange={(value) =>
                        setCustomScenario({
                          ...customScenario,
                          marginImprovement: value[0],
                        })
                      }
                      min={0}
                      max={20}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">
                      {customScenario.marginImprovement}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Multiple Expansion</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[customScenario.multipleExpansion]}
                      onValueChange={(value) =>
                        setCustomScenario({
                          ...customScenario,
                          multipleExpansion: value[0],
                        })
                      }
                      min={-2}
                      max={3}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">
                      {customScenario.multipleExpansion}x
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time to Exit (months)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[customScenario.timeToExit]}
                      onValueChange={(value) =>
                        setCustomScenario({
                          ...customScenario,
                          timeToExit: value[0],
                        })
                      }
                      min={3}
                      max={24}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">
                      {customScenario.timeToExit}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Scenario Results */}
              <div className="p-6 rounded-lg border bg-secondary/20">
                <h3 className="font-medium mb-4">Projected Outcomes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Current Valuation
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(
                        baseMetrics.currentEBITDA * baseMetrics.currentMultiple,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Projected Exit Value
                    </span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(
                        projections.custom.slice(-1)[0].valuation,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Value Increase
                    </span>
                    <span className="font-semibold text-green-600">
                      +
                      {formatCurrency(
                        projections.custom.slice(-1)[0].valuation -
                          baseMetrics.currentEBITDA *
                            baseMetrics.currentMultiple,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-semibold text-green-600">
                      +
                      {Math.round(
                        ((projections.custom.slice(-1)[0].valuation -
                          baseMetrics.currentEBITDA *
                            baseMetrics.currentMultiple) /
                          (baseMetrics.currentEBITDA *
                            baseMetrics.currentMultiple)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Projection Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projections.custom}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                    tickFormatter={(value) =>
                      `$${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="valuation"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Valuation"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
