"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineProgressProps {
  detailed?: boolean;
}

export function TimelineProgress({ detailed = false }: TimelineProgressProps) {
  const milestones = [
    {
      id: 1,
      name: "Initial Assessment",
      date: "2024-01-15",
      status: "completed",
      description: "Complete business evaluation and readiness assessment",
    },
    {
      id: 2,
      name: "Financial Preparation",
      date: "2024-02-28",
      status: "completed",
      description: "Organize financial statements and projections",
    },
    {
      id: 3,
      name: "Legal Review",
      date: "2024-03-15",
      status: "in-progress",
      description: "Legal due diligence and contract review",
    },
    {
      id: 4,
      name: "Market Analysis",
      date: "2024-04-01",
      status: "upcoming",
      description: "Analyze market conditions and buyer landscape",
    },
    {
      id: 5,
      name: "Buyer Outreach",
      date: "2024-05-01",
      status: "upcoming",
      description: "Initial contact with potential buyers",
    },
    {
      id: 6,
      name: "Negotiations",
      date: "2024-06-15",
      status: "upcoming",
      description: "Negotiate terms and structure",
    },
    {
      id: 7,
      name: "Due Diligence",
      date: "2024-07-30",
      status: "upcoming",
      description: "Buyer due diligence process",
    },
    {
      id: 8,
      name: "Closing",
      date: "2024-09-01",
      status: "upcoming",
      description: "Final closing and transition",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "upcoming":
        return <Circle className="h-5 w-5 text-gray-300" />;
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "delayed":
        return <Badge className="bg-yellow-100 text-yellow-700">Delayed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const completedCount = milestones.filter(
    (m) => m.status === "completed",
  ).length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Exit Timeline</CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              8 months remaining
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {milestones
            .slice(0, detailed ? milestones.length : 4)
            .map((milestone, index) => (
              <motion key={index}.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative flex items-start gap-4 pb-6"
              >
                {/* Timeline Line */}
                {index < (detailed ? milestones.length - 1 : 3) && (
                  <div className="absolute left-2.5 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                )}

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-medium">{milestone.name}</h4>
                    {getStatusBadge(milestone.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(milestone.date).toLocaleDateString()}</span>
                  </div>
                  {detailed && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            View Full Timeline
          </Button>
          <Button className="flex-1">Update Progress</Button>
        </div>
      </CardContent>
    </Card>
  );
}
