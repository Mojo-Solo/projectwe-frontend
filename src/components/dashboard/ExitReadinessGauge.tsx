"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExitReadinessGaugeProps {
  score: number;
  trend?: string;
  detailed?: boolean;
}

export function ExitReadinessGauge({
  score,
  trend,
  detailed = false,
}: ExitReadinessGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const readinessFactors = [
    { name: "Financial Health", score: 85, weight: 25 },
    { name: "Market Position", score: 72, weight: 20 },
    { name: "Legal Compliance", score: 90, weight: 15 },
    { name: "Operational Efficiency", score: 68, weight: 20 },
    { name: "Team Readiness", score: 75, weight: 20 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Exit Readiness Score
          </CardTitle>
          {trend && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {trend.startsWith("+") ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Gauge */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 553} 553`}
                className={cn(
                  "transition-all duration-1000",
                  getScoreColor(score),
                )}
                initial={{ strokeDasharray: "0 553" }}
                animate={{ strokeDasharray: `${(score / 100) * 553} 553` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <div className={cn("text-5xl font-bold", getScoreColor(score))}>
                  {score}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getScoreLabel(score)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Key Factors
          </h4>
          {readinessFactors
            .slice(0, detailed ? readinessFactors.length : 3)
            .map((factor, index) => (
              <motion key={index}.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{factor.name}</span>
                  <span
                    className={cn("font-semibold", getScoreColor(factor.score))}
                  >
                    {factor.score}%
                  </span>
                </div>
                <Progress value={factor.score} className="h-2" />
                {detailed && (
                  <p className="text-xs text-muted-foreground">
                    Weight: {factor.weight}% of total score
                  </p>
                )}
              </motion.div>
            ))}
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Priority Actions
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span>Improve operational documentation</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Financial audits up to date</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full" variant="outline">
          View Detailed Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
