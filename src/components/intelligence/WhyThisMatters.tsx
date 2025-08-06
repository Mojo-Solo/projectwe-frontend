"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhyThisMattersProps {
  title: string;
  problem: string;
  solution: string;
  impact: string;
  example?: string;
  variant?: "inline" | "card" | "button";
}

export function WhyThisMatters({
  title,
  problem,
  solution,
  impact,
  example,
  variant = "inline",
}: WhyThisMattersProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "button") {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-1 text-xs"
        >
          <HelpCircle className="h-3 w-3" />
          Why This Matters
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-80 p-4 rounded-lg bg-background border shadow-lg"
            >
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                {title}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-destructive">Problem:</p>
                  <p className="text-muted-foreground">{problem}</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">Solution:</p>
                  <p className="text-muted-foreground">{solution}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600">Business Impact:</p>
                  <p className="text-muted-foreground">{impact}</p>
                </div>
                {example && (
                  <div>
                    <p className="font-medium">Example:</p>
                    <p className="text-muted-foreground italic">{example}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (variant === "card") {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">{title}</h4>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Problem:</span> {problem}
                </p>
                <p>
                  <span className="font-medium">Solution:</span> {solution}
                </p>
                <p>
                  <span className="font-medium">Impact:</span> {impact}
                </p>
                {example && <p className="italic mt-2">{example}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 p-3 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <HelpCircle className="h-4 w-4 text-primary" />
            Why This Matters
          </h4>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 text-sm"
          >
            <div className="pl-6">
              <p className="font-medium text-destructive">The Problem:</p>
              <p className="text-muted-foreground">{problem}</p>
            </div>
            <div className="pl-6">
              <p className="font-medium text-green-600">Our Solution:</p>
              <p className="text-muted-foreground">{solution}</p>
            </div>
            <div className="pl-6">
              <p className="font-medium text-blue-600">Business Impact:</p>
              <p className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {impact}
              </p>
            </div>
            {example && (
              <div className="pl-6 pt-2 border-t">
                <p className="font-medium">Real Example:</p>
                <p className="text-muted-foreground italic">{example}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
