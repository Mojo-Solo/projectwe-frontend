"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Users,
  FileCheck,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricsGrid() {
  const metrics = [
    {
      id: 1,
      label: "Current Valuation",
      value: "$9.1M",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      id: 2,
      label: "Exit Readiness",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: 3,
      label: "Time to Exit",
      value: "8 months",
      change: "On track",
      trend: "stable",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      id: 4,
      label: "Active Buyers",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      id: 5,
      label: "Docs Complete",
      value: "83%",
      change: "+12%",
      trend: "up",
      icon: FileCheck,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      id: 6,
      label: "ROI Projection",
      value: "4.2x",
      change: "+0.3x",
      trend: "up",
      icon: Percent,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <motion key={index}.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                {metric.trend !== "stable" && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      metric.trend === "up" ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {getTrendIcon(metric.trend)}
                    {metric.change}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.label}</p>

              {/* Background decoration */}
              <div className="absolute -right-8 -bottom-8 opacity-5">
                <metric.icon className="h-32 w-32" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
