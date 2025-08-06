"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ValuationTrackerProps {
  detailed?: boolean;
}

export function ValuationTracker({ detailed = false }: ValuationTrackerProps) {
  const valuationData = [
    { month: "Jan", current: 8200000, projected: 8500000, market: 8000000 },
    { month: "Feb", current: 8350000, projected: 8700000, market: 8100000 },
    { month: "Mar", current: 8500000, projected: 8900000, market: 8300000 },
    { month: "Apr", current: 8750000, projected: 9100000, market: 8500000 },
    { month: "May", current: 8900000, projected: 9300000, market: 8700000 },
    { month: "Jun", current: 9100000, projected: 9500000, market: 8900000 },
  ];

  const valuationMethods = [
    { method: "DCF Analysis", value: 9200000, confidence: 85 },
    { method: "Market Multiples", value: 8900000, confidence: 75 },
    { method: "Asset-Based", value: 8500000, confidence: 90 },
    { method: "Revenue Multiple", value: 9500000, confidence: 70 },
  ];

  const currentValuation = 9100000;
  const change = 450000;
  const changePercent = 5.2;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Business Valuation
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />+{changePercent}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Valuation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            <p className="text-sm text-muted-foreground">Current Valuation</p>
            <p className="text-2xl font-bold">
              {formatCurrency(currentValuation)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +{formatCurrency(change)} ({changePercent}%)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-1"
          >
            <p className="text-sm text-muted-foreground">Market Average</p>
            <p className="text-2xl font-bold">{formatCurrency(8900000)}</p>
            <p className="text-sm text-muted-foreground">Industry benchmark</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-1"
          >
            <p className="text-sm text-muted-foreground">Target Price</p>
            <p className="text-2xl font-bold">{formatCurrency(9500000)}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Q3 2024 goal
            </p>
          </motion.div>
        </div>

        {/* Valuation Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={valuationData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "currentColor" }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="current"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Current Value"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Projected"
              />
              <Line
                type="monotone"
                dataKey="market"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Market Avg"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {detailed && (
          <Tabs defaultValue="methods" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="methods">Valuation Methods</TabsTrigger>
              <TabsTrigger value="factors">Key Factors</TabsTrigger>
            </TabsList>

            <TabsContent value="methods" className="space-y-3 mt-4">
              {valuationMethods.map((method, index) => (
                <motion key={index}.div
                  key={method.method}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{method.method}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {method.confidence}%
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(method.value)}
                  </p>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="factors" className="space-y-3 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <Badge className="bg-green-100 text-green-700">
                    +15% YoY
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">EBITDA Margin</span>
                  <Badge>22%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Retention</span>
                  <Badge>94%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Share</span>
                  <Badge>12%</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            <BarChart2 className="h-4 w-4 mr-2" />
            Detailed Analysis
          </Button>
          <Button className="flex-1">
            <DollarSign className="h-4 w-4 mr-2" />
            Update Valuation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
