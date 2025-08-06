"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, Users, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentSummaryCardProps {
  title: string;
  summary: string;
  fullContent: string;
  readTime?: number;
  audience?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  className?: string;
}

export function ContentSummaryCard({
  title,
  summary,
  fullContent,
  readTime = 3,
  audience = "All levels",
  difficulty = "Beginner",
  tags = [],
  className = "",
}: ContentSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge className={difficultyColors[difficulty]} variant="secondary">
            {difficulty}
          </Badge>
        </div>
        
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{audience}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary - Always Visible */}
        <p className="text-muted-foreground mb-4">{summary}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Expand/Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-0 text-primary hover:text-primary/80"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Read Full Content <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Full Content - Progressive Disclosure */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t mt-4">
                <div className="prose prose-sm max-w-none">
                  {fullContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}