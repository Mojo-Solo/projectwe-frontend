"use client";

import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessFlowIndicator } from "./ProcessFlowIndicator";

interface MinimalProgressBarProps {
  currentTab: string;
}

export function MinimalProgressBar({ currentTab }: MinimalProgressBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    { id: "proof", name: "Explore Demo", completed: true },
    { id: "client", name: "Enter Info", completed: currentTab !== "proof" },
    {
      id: "valuation",
      name: "Calculate Value",
      completed: [
        "roadmap",
        "frameworks",
        "practices",
        "generate",
        "chat",
      ].includes(currentTab),
    },
    {
      id: "frameworks",
      name: "Get AI Guidance",
      completed: ["generate", "chat"].includes(currentTab),
    },
    { id: "generate", name: "Generate Plan", completed: currentTab === "chat" },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="mb-4">
      {/* Minimal Progress Bar */}
      <div className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                {completedSteps} of {steps.length} Steps Complete
              </span>
            </div>
            <Progress value={progress} className="w-32 h-2" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? (
              <>
                Hide Details <ChevronUp className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                Show Details <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Process Flow */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <ProcessFlowIndicator currentTab={currentTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
