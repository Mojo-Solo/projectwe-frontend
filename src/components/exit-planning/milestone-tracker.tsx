"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Building,
  Shield,
  Briefcase,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  phase: string;
  category: string;
  status: "completed" | "in-progress" | "pending" | "blocked";
  priority: "high" | "medium" | "low";
  dueDate: string;
  completedDate?: string;
  dependencies: string[];
  assignee?: string;
  progress: number;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface MilestoneTrackerProps {
  onMilestoneUpdate?: (milestone: Milestone) => void;
}

export function MilestoneTracker({ onMilestoneUpdate }: MilestoneTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Complete Financial Audit",
      description: "Comprehensive review of last 3 years financial statements",
      phase: "pre-discovery",
      category: "financial",
      status: "completed",
      priority: "high",
      dueDate: "2025-01-15",
      completedDate: "2025-01-14",
      dependencies: [],
      assignee: "CFO",
      progress: 100,
      subtasks: [
        { id: "1a", title: "Gather financial statements", completed: true },
        { id: "1b", title: "Review revenue recognition", completed: true },
        { id: "1c", title: "Validate EBITDA adjustments", completed: true },
        { id: "1d", title: "Prepare audit report", completed: true },
      ],
    },
    {
      id: "2",
      title: "Business Valuation Analysis",
      description: "Get professional valuation using multiple methodologies",
      phase: "discovery",
      category: "valuation",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-02-15",
      dependencies: ["1"],
      assignee: "Valuation Expert",
      progress: 65,
      subtasks: [
        { id: "2a", title: "Collect industry comparables", completed: true },
        { id: "2b", title: "Apply DCF analysis", completed: true },
        { id: "2c", title: "Calculate EBITDA multiples", completed: true },
        { id: "2d", title: "Prepare valuation report", completed: false },
      ],
    },
    {
      id: "3",
      title: "Legal Due Diligence Preparation",
      description: "Organize all legal documents and contracts",
      phase: "discovery",
      category: "legal",
      status: "pending",
      priority: "high",
      dueDate: "2025-03-01",
      dependencies: ["1"],
      assignee: "Legal Counsel",
      progress: 0,
      subtasks: [
        { id: "3a", title: "Review all contracts", completed: false },
        { id: "3b", title: "Check compliance status", completed: false },
        { id: "3c", title: "Organize corporate documents", completed: false },
        { id: "3d", title: "Prepare data room", completed: false },
      ],
    },
    {
      id: "4",
      title: "Management Team Assessment",
      description: "Evaluate and strengthen management structure",
      phase: "quarterback-lite",
      category: "management",
      status: "pending",
      priority: "medium",
      dueDate: "2025-03-15",
      dependencies: ["2"],
      assignee: "HR Director",
      progress: 0,
      subtasks: [
        { id: "4a", title: "Document org structure", completed: false },
        { id: "4b", title: "Assess key personnel", completed: false },
        { id: "4c", title: "Create succession plan", completed: false },
        { id: "4d", title: "Implement retention incentives", completed: false },
      ],
    },
    {
      id: "5",
      title: "Market Buyer Identification",
      description:
        "Research and identify potential strategic and financial buyers",
      phase: "quarterback-lite",
      category: "market",
      status: "pending",
      priority: "high",
      dueDate: "2025-04-01",
      dependencies: ["2", "3"],
      assignee: "M&A Advisor",
      progress: 0,
      subtasks: [
        { id: "5a", title: "Create buyer criteria", completed: false },
        { id: "5b", title: "Research strategic buyers", completed: false },
        { id: "5c", title: "Identify financial buyers", completed: false },
        { id: "5d", title: "Develop outreach strategy", completed: false },
      ],
    },
  ]);

  const [expandedMilestones, setExpandedMilestones] = useState<string[]>(["2"]);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const phases = [
    { id: "all", name: "All Phases", count: milestones.length },
    {
      id: "pre-discovery",
      name: "Pre-Discovery",
      count: milestones.filter((m) => m.phase === "pre-discovery").length,
    },
    {
      id: "discovery",
      name: "Discovery",
      count: milestones.filter((m) => m.phase === "discovery").length,
    },
    {
      id: "quarterback-lite",
      name: "Quarterback Lite",
      count: milestones.filter((m) => m.phase === "quarterback-lite").length,
    },
  ];

  const categories = [
    { id: "all", name: "All Categories", icon: Target },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "valuation", name: "Valuation", icon: TrendingUp },
    { id: "legal", name: "Legal", icon: Shield },
    { id: "management", name: "Management", icon: Users },
    { id: "market", name: "Market", icon: Building },
    { id: "operations", name: "Operations", icon: Briefcase },
  ];

  const filteredMilestones = milestones.filter((milestone) => {
    const phaseMatch =
      selectedPhase === "all" || milestone.phase === selectedPhase;
    const categoryMatch =
      selectedCategory === "all" || milestone.category === selectedCategory;
    return phaseMatch && categoryMatch;
  });

  const overallProgress = Math.round(
    milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length,
  );

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const updateSubtask = (
    milestoneId: string,
    subtaskId: string,
    completed: boolean,
  ) => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === milestoneId && milestone.subtasks) {
          const updatedSubtasks = milestone.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed } : subtask,
          );
          const completedCount = updatedSubtasks.filter(
            (s) => s.completed,
          ).length;
          const progress = Math.round(
            (completedCount / updatedSubtasks.length) * 100,
          );
          const status =
            progress === 100
              ? "completed"
              : progress > 0
                ? "in-progress"
                : "pending";

          const updatedMilestone = {
            ...milestone,
            subtasks: updatedSubtasks,
            progress,
            status,
            completedDate:
              status === "completed"
                ? new Date().toISOString().split("T")[0]
                : undefined,
          };

          onMilestoneUpdate?.(updatedMilestone);
          return updatedMilestone;
        }
        return milestone;
      }),
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle key={index} className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    const Icon = cat?.icon || Target;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Exit Planning Progress</CardTitle>
          <CardDescription>
            Track your progress across all exit planning milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {milestones.filter((m) => m.status === "completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {milestones.filter((m) => m.status === "in-progress").length}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {milestones.filter((m) => m.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {milestones.filter((m) => m.status === "blocked").length}
              </p>
              <p className="text-sm text-muted-foreground">Blocked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Phase</label>
          <div className="flex gap-2 flex-wrap">
            {phases.map((phase) => (
              <Button key={index}
                key={phase.id}
                variant={selectedPhase === phase.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPhase(phase.id)}
                className="gap-2"
              >
                {phase.name}
                <Badge variant="secondary" className="ml-1">
                  {phase.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Category</label>
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 4).map((category) => (
              <Button key={index}
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          {filteredMilestones.map((milestone) => (
            <Card key={milestone.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleMilestone(milestone.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(milestone.status)}
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {milestone.title}
                        {expandedMilestones.includes(milestone.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(milestone.category)}
                          {milestone.category.charAt(0).toUpperCase() +
                            milestone.category.slice(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                        {milestone.assignee && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {milestone.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        milestone.priority === "high"
                          ? "destructive"
                          : milestone.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {milestone.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <Collapsible open={expandedMilestones.includes(milestone.id)}>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {milestone.progress}%
                          </span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>

                      {milestone.subtasks && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Subtasks</p>
                          {milestone.subtasks.map((subtask) => (
                            <div key={index}
                              key={subtask.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={(checked) =>
                                  updateSubtask(
                                    milestone.id,
                                    subtask.id,
                                    checked as boolean,
                                  )
                                }
                                disabled={milestone.status === "completed"}
                              />
                              <label
                                className={`text-sm ${
                                  subtask.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {subtask.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {milestone.dependencies.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Dependencies</p>
                          <div className="flex gap-2">
                            {milestone.dependencies.map((depId) => {
                              const dep = milestones.find(
                                (m) => m.id === depId,
                              );
                              return dep ? (
                                <Badge key={index}
                                  key={depId}
                                  variant="outline"
                                  className="gap-1"
                                >
                                  {getStatusIcon(dep.status)}
                                  {dep.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {milestone.completedDate && (
                        <p className="text-sm text-muted-foreground">
                          Completed on{" "}
                          {new Date(
                            milestone.completedDate,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
