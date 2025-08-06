"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  why: string;
  impact: string;
}

interface ProcessFlowIndicatorProps {
  currentTab: string;
}

export function ProcessFlowIndicator({
  currentTab,
}: ProcessFlowIndicatorProps) {
  const steps: ProcessStep[] = [
    {
      id: "demo",
      title: "1. Try Demo",
      description: "See AI in action",
      status: currentTab === "proof" ? "current" : "completed",
      why: "Understand the power of personalized recommendations",
      impact: "3x higher success rate when you see examples first",
    },
    {
      id: "client",
      title: "2. Enter Info",
      description: "Your business details",
      status:
        currentTab === "client"
          ? "current"
          : ["proof"].includes(currentTab)
            ? "upcoming"
            : "completed",
      why: "AI needs your specifics to personalize",
      impact: "Saves 200+ hours vs generic planning",
    },
    {
      id: "valuation",
      title: "3. Calculate Value",
      description: "See your worth",
      status:
        currentTab === "valuation"
          ? "current"
          : ["proof", "client"].includes(currentTab)
            ? "upcoming"
            : "completed",
      why: "Know your starting point and potential",
      impact: "Identifies $1-5M in hidden value",
    },
    {
      id: "frameworks",
      title: "4. Get AI Guidance",
      description: "Personalized strategies",
      status: ["frameworks", "practices"].includes(currentTab)
        ? "current"
        : ["proof", "client", "valuation"].includes(currentTab)
          ? "upcoming"
          : "completed",
      why: "Apply 30+ years of expertise to YOUR business",
      impact: "25-40% higher exit value on average",
    },
    {
      id: "generate",
      title: "5. Generate Plan",
      description: "Professional documents",
      status:
        currentTab === "generate"
          ? "current"
          : currentTab === "chat"
            ? "completed"
            : "upcoming",
      why: "Turn insights into actionable plans",
      impact: "What takes weeks now takes minutes",
    },
  ];

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            Your Exit Planning Journey
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Follow these steps for maximum value. Each builds on the
                  previous to create your personalized exit plan.
                </p>
              </TooltipContent>
            </Tooltip>
          </h3>
          <Badge variant="outline">
            {steps.filter((s) => s.status === "completed").length} of{" "}
            {steps.length} Complete
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1"
                  >
                    <div
                      className={`
                      relative p-3 rounded-lg border-2 transition-all cursor-help
                      ${step.status === "current" ? "border-primary bg-primary/10 scale-105" : ""}
                      ${step.status === "completed" ? "border-green-500 bg-green-50" : ""}
                      ${step.status === "upcoming" ? "border-gray-300 bg-gray-50" : ""}
                    `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {step.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : step.status === "current" ? (
                          <div className="h-5 w-5 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>

                      {step.status === "current" && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          You are here
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold text-xs">{step.title}</p>
                    <div className="space-y-1">
                      <p className="text-xs">
                        <strong>Why:</strong> {step.why}
                      </p>
                      <p className="text-xs">
                        <strong>Impact:</strong> {step.impact}
                      </p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>

              {index < steps.length - 1 && (
                <ArrowRight
                  className={`h-4 w-4 flex-shrink-0 ${
                    steps[index].status === "completed"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Pro Tip:</strong> Complete all steps in order for best
            results. Each step unlocks more personalized insights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
