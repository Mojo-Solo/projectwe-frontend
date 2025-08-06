"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsFeedProps {
  detailed?: boolean;
}

export function AIInsightsFeed({ detailed = false }: AIInsightsFeedProps) {
  const insights = [
    {
      id: 1,
      type: "opportunity",
      title: "Market Timing Optimal",
      description:
        "Current market conditions show increased buyer activity in your sector. Consider accelerating timeline.",
      agent: "Market Analyst AI",
      timestamp: "2 hours ago",
      priority: "high",
      actionable: true,
    },
    {
      id: 2,
      type: "risk",
      title: "Contract Review Alert",
      description:
        "Found 3 material contracts with change-of-control clauses that need attention before exit.",
      agent: "Legal AI Assistant",
      timestamp: "5 hours ago",
      priority: "high",
      actionable: true,
    },
    {
      id: 3,
      type: "suggestion",
      title: "Valuation Enhancement",
      description:
        "Implementing suggested operational improvements could increase valuation by 12-15%.",
      agent: "Strategy AI Coach",
      timestamp: "1 day ago",
      priority: "medium",
      actionable: true,
    },
    {
      id: 4,
      type: "update",
      title: "Competitor Analysis",
      description:
        "Similar business in your market sold for 4.2x revenue. Your current multiple: 3.8x.",
      agent: "Market Analyst AI",
      timestamp: "2 days ago",
      priority: "low",
      actionable: false,
    },
    {
      id: 5,
      type: "tip",
      title: "Document Preparation",
      description:
        "Start preparing Q4 financials now. Buyers typically request 3-5 years of detailed records.",
      agent: "Exit Planning AI",
      timestamp: "3 days ago",
      priority: "medium",
      actionable: true,
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "risk":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "suggestion":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "update":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "tip":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getAgentAvatar = (agent: string) => {
    const initials = agent
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);
    return initials;
  };

  return (
    <Card key={index} className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">AI Insights</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {insights.filter((i) => i.priority === "high").length} High Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Insights List */}
        <div className="space-y-3">
          {insights
            .slice(0, detailed ? insights.length : 3)
            .map((insight, index) => (
              <motion key={index}.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {getAgentAvatar(insight.agent)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{insight.agent}</span>
                        <span>•</span>
                        <span>{insight.timestamp}</span>
                      </div>
                      {insight.actionable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* AI Agents Summary */}
        {detailed && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Active AI Agents
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Market Analyst",
                "Legal Assistant",
                "Strategy Coach",
                "Exit Planner",
              ].map((agent, index) => (
                <motion key={index}.div
                  key={agent}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium">{agent}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" variant="outline">
            View All Insights
          </Button>
          <Button className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
