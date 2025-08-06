"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
  Users,
  FileText,
  Target,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Calendar,
  User,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedDays: number;
  tasks: WorkflowTask[];
  objectives: string[];
  deliverables: string[];
  keyQuestions: string[];
}

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  type: "action" | "meeting" | "document" | "analysis" | "coaching";
  priority: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  status: "not-started" | "in-progress" | "completed" | "blocked";
  assignedTo: string;
  dueDate?: Date;
  notes?: string;
  completedAt?: Date;
  dependencies?: string[];
}

interface ClientInfo {
  name: string;
  businessType: string;
  advisorName: string;
  engagementStart: Date;
  targetExit: Date;
}

interface AdvisorWorkflowTrackerProps {
  clientInfo?: ClientInfo;
  onPhaseComplete?: (phaseId: string, data: any) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<WorkflowTask>) => void;
  className?: string;
}

const ADVISOR_WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    id: "engage-pre-discovery",
    name: "Engage & Pre-Discovery",
    description: "Initial client engagement and relationship building",
    icon: <Users className="w-5 h-5" />,
    estimatedDays: 14,
    objectives: [
      "Establish trust and rapport with client",
      "Understand client motivations and concerns",
      "Set engagement expectations and timeline",
      "Conduct preliminary business assessment",
    ],
    deliverables: [
      "Engagement letter signed",
      "Initial business overview completed",
      "Client goals and timeline documented",
      "Preliminary value assessment",
    ],
    keyQuestions: [
      "What is driving the decision to exit?",
      "What are the client's financial and personal goals?",
      "What is the ideal timeline for exit?",
      "What are the biggest concerns about the process?",
    ],
    tasks: [
      {
        id: "initial-meeting",
        title: "Initial Discovery Meeting",
        description:
          "Conduct comprehensive initial meeting with business owner",
        type: "meeting",
        priority: "critical",
        estimatedHours: 3,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "engagement-letter",
        title: "Engagement Letter Execution",
        description: "Prepare and execute formal engagement agreement",
        type: "document",
        priority: "critical",
        estimatedHours: 2,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "stakeholder-mapping",
        title: "Stakeholder Mapping",
        description: "Identify all key stakeholders and their interests",
        type: "analysis",
        priority: "high",
        estimatedHours: 4,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "preliminary-valuation",
        title: "Preliminary Valuation Assessment",
        description: "Conduct high-level business valuation assessment",
        type: "analysis",
        priority: "high",
        estimatedHours: 6,
        status: "not-started",
        assignedTo: "Valuation Specialist",
      },
      {
        id: "goals-documentation",
        title: "Goals & Objectives Documentation",
        description: "Document client goals, timeline, and success criteria",
        type: "document",
        priority: "high",
        estimatedHours: 2,
        status: "not-started",
        assignedTo: "Advisor",
      },
    ],
  },
  {
    id: "discovery-assessment",
    name: "Discovery & Assessment",
    description: "Comprehensive business assessment and strategic planning",
    icon: <FileText className="w-5 h-5" />,
    estimatedDays: 30,
    objectives: [
      "Complete comprehensive business assessment",
      "Identify value drivers and gaps",
      "Develop preliminary exit strategy",
      "Create action plan for business optimization",
    ],
    deliverables: [
      "Comprehensive business assessment report",
      "Exit readiness scorecard",
      "Value enhancement recommendations",
      "Strategic action plan with timeline",
    ],
    keyQuestions: [
      "What are the key value drivers of the business?",
      "What gaps need to be addressed before exit?",
      "What is the optimal exit strategy?",
      "What improvements will maximize value?",
    ],
    tasks: [
      {
        id: "financial-analysis",
        title: "Financial Analysis Deep Dive",
        description:
          "Comprehensive analysis of financial statements and projections",
        type: "analysis",
        priority: "critical",
        estimatedHours: 12,
        status: "not-started",
        assignedTo: "Financial Analyst",
      },
      {
        id: "operational-assessment",
        title: "Operational Assessment",
        description: "Evaluate operational efficiency and management systems",
        type: "analysis",
        priority: "high",
        estimatedHours: 10,
        status: "not-started",
        assignedTo: "Operations Consultant",
      },
      {
        id: "market-positioning",
        title: "Market Positioning Analysis",
        description:
          "Analyze market position, competition, and growth opportunities",
        type: "analysis",
        priority: "high",
        estimatedHours: 8,
        status: "not-started",
        assignedTo: "Market Analyst",
      },
      {
        id: "readiness-assessment",
        title: "Exit Readiness Assessment",
        description: "Complete formal exit readiness evaluation",
        type: "analysis",
        priority: "critical",
        estimatedHours: 6,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "strategy-development",
        title: "Exit Strategy Development",
        description: "Develop comprehensive exit strategy recommendations",
        type: "analysis",
        priority: "critical",
        estimatedHours: 8,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "presentation-preparation",
        title: "Assessment Presentation Preparation",
        description:
          "Prepare comprehensive presentation of findings and recommendations",
        type: "document",
        priority: "high",
        estimatedHours: 6,
        status: "not-started",
        assignedTo: "Advisor",
      },
    ],
  },
  {
    id: "quarterback-lite",
    name: "Quarterback Lite Coordination",
    description:
      "Coordinate implementation of recommendations and prepare for exit",
    icon: <Target className="w-5 h-5" />,
    estimatedDays: 90,
    objectives: [
      "Coordinate implementation of value enhancement initiatives",
      "Monitor progress and adjust strategies as needed",
      "Prepare business for market presentation",
      "Build and manage advisory team",
    ],
    deliverables: [
      "Implementation progress reports",
      "Updated business valuation",
      "Market-ready business profile",
      "Advisory team coordination plan",
    ],
    keyQuestions: [
      "What is the implementation progress on key initiatives?",
      "Are we on track to meet timeline and value targets?",
      "What additional resources or expertise is needed?",
      "How can we optimize the business presentation to buyers?",
    ],
    tasks: [
      {
        id: "team-assembly",
        title: "Advisory Team Assembly",
        description:
          "Assemble and coordinate full advisory team (legal, tax, valuation, etc.)",
        type: "action",
        priority: "critical",
        estimatedHours: 8,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "implementation-oversight",
        title: "Implementation Oversight",
        description:
          "Oversee implementation of value enhancement recommendations",
        type: "coaching",
        priority: "critical",
        estimatedHours: 40,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "progress-monitoring",
        title: "Progress Monitoring & Reporting",
        description: "Monitor and report on implementation progress",
        type: "analysis",
        priority: "high",
        estimatedHours: 20,
        status: "not-started",
        assignedTo: "Advisor",
      },
      {
        id: "valuation-update",
        title: "Updated Valuation Analysis",
        description: "Update business valuation based on improvements",
        type: "analysis",
        priority: "high",
        estimatedHours: 8,
        status: "not-started",
        assignedTo: "Valuation Specialist",
      },
      {
        id: "market-preparation",
        title: "Market Preparation",
        description:
          "Prepare business profile and marketing materials for buyer presentation",
        type: "document",
        priority: "high",
        estimatedHours: 15,
        status: "not-started",
        assignedTo: "Investment Banker",
      },
      {
        id: "readiness-validation",
        title: "Exit Readiness Validation",
        description:
          "Validate exit readiness and timeline before market launch",
        type: "analysis",
        priority: "critical",
        estimatedHours: 4,
        status: "not-started",
        assignedTo: "Advisor",
      },
    ],
  },
];

export function AdvisorWorkflowTracker({
  clientInfo,
  onPhaseComplete,
  onTaskUpdate,
  className,
}: AdvisorWorkflowTrackerProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phases, setPhases] = useState<WorkflowPhase[]>(
    ADVISOR_WORKFLOW_PHASES,
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [phaseNotes, setPhaseNotes] = useState<Record<string, string>>({});

  const currentPhase = phases[currentPhaseIndex];
  const overallProgress = calculateOverallProgress();

  function calculateOverallProgress(): number {
    const totalTasks = phases.reduce(
      (sum, phase) => sum + phase.tasks.length,
      0,
    );
    const completedTasks = phases.reduce(
      (sum, phase) =>
        sum + phase.tasks.filter((task) => task.status === "completed").length,
      0,
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  function calculatePhaseProgress(phase: WorkflowPhase): number {
    const completedTasks = phase.tasks.filter(
      (task) => task.status === "completed",
    ).length;
    return phase.tasks.length > 0
      ? Math.round((completedTasks / phase.tasks.length) * 100)
      : 0;
  }

  const updateTaskStatus = (
    phaseId: string,
    taskId: string,
    status: WorkflowTask["status"],
  ) => {
    setPhases((prevPhases) => {
      const newPhases = prevPhases.map((phase) => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            tasks: phase.tasks.map((task) => {
              if (task.id === taskId) {
                const updatedTask = {
                  ...task,
                  status,
                  completedAt: status === "completed" ? new Date() : undefined,
                };

                if (onTaskUpdate) {
                  onTaskUpdate(taskId, updatedTask);
                }

                return updatedTask;
              }
              return task;
            }),
          };
        }
        return phase;
      });

      return newPhases;
    });
  };

  const addTaskNote = (phaseId: string, taskId: string, note: string) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            tasks: phase.tasks.map((task) =>
              task.id === taskId ? { ...task, notes: note } : task,
            ),
          };
        }
        return phase;
      }),
    );
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: WorkflowTask["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle key={index} className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTaskTypeIcon = (type: WorkflowTask["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "analysis":
        return <BarChart3 className="w-4 h-4" />;
      case "coaching":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: WorkflowTask["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Client Info Header */}
      {clientInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{clientInfo.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {clientInfo.businessType} • Advisor: {clientInfo.advisorName}
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Overall Progress:</span>
                  <span className="ml-2 text-lg font-bold text-primary">
                    {overallProgress}%
                  </span>
                </div>
                <Progress value={overallProgress} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Workflow Phases</h3>
            <div className="text-sm text-muted-foreground">
              Phase {currentPhaseIndex + 1} of {phases.length}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {phases.map((phase, index) => (
              <Button key={index}
                key={phase.id}
                variant={index === currentPhaseIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPhaseIndex(index)}
                className="flex-1"
              >
                <div className="flex items-center gap-1">
                  {phase.icon}
                  <span className="hidden sm:inline">{phase.name}</span>
                </div>
              </Button>
            ))}
          </div>
          <Progress
            value={calculatePhaseProgress(currentPhase)}
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Current Phase Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentPhase.icon}
              <CardTitle>{currentPhase.name}</CardTitle>
            </div>
            <Badge variant="outline">
              {calculatePhaseProgress(currentPhase)}% Complete
            </Badge>
          </div>
          <CardDescription>{currentPhase.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phase Objectives */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectives
            </h4>
            <ul className="space-y-1">
              {currentPhase.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Questions */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Questions
            </h4>
            <ul className="space-y-1">
              {currentPhase.keyQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  {question}
                </li>
              ))}
            </ul>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tasks (
              {
                currentPhase.tasks.filter((t) => t.status === "completed")
                  .length
              }
              /{currentPhase.tasks.length})
            </h4>
            <div className="space-y-3">
              {currentPhase.tasks.map((task) => (
                <Card key={task.id} className="transition-all hover:shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => {
                            const nextStatus =
                              task.status === "completed"
                                ? "not-started"
                                : task.status === "not-started"
                                  ? "in-progress"
                                  : "completed";
                            updateTaskStatus(
                              currentPhase.id,
                              task.id,
                              nextStatus,
                            );
                          }}
                          className="mt-1"
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {getTaskTypeIcon(task.type)}
                            <h5 className="font-medium text-sm">
                              {task.title}
                            </h5>
                            <Badge
                              size="sm"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {task.assignedTo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedHours}h
                            </div>
                            {task.completedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed{" "}
                                {task.completedAt.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <ArrowRight
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedTasks.has(task.id) && "rotate-90",
                          )}
                        />
                      </Button>
                    </div>

                    {/* Expanded Task Details */}
                    {expandedTasks.has(task.id) && (
                      <div className="mt-3 pt-3 border-t space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${task.id}`}>Notes</Label>
                          <Textarea
                            id={`notes-${task.id}`}
                            placeholder="Add notes about this task..."
                            value={task.notes || ""}
                            onChange={(e) =>
                              addTaskNote(
                                currentPhase.id,
                                task.id,
                                e.target.value,
                              )
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTaskStatus(
                                currentPhase.id,
                                task.id,
                                "in-progress",
                              )
                            }
                            disabled={task.status === "in-progress"}
                          >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTaskStatus(
                                currentPhase.id,
                                task.id,
                                "completed",
                              )
                            }
                            disabled={task.status === "completed"}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTaskStatus(
                                currentPhase.id,
                                task.id,
                                "blocked",
                              )
                            }
                            disabled={task.status === "blocked"}
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Block
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Phase Notes */}
          <div className="space-y-2">
            <Label htmlFor={`phase-notes-${currentPhase.id}`}>
              Phase Notes
            </Label>
            <Textarea
              id={`phase-notes-${currentPhase.id}`}
              placeholder="Add notes about this phase..."
              value={phaseNotes[currentPhase.id] || ""}
              onChange={(e) =>
                setPhaseNotes((prev) => ({
                  ...prev,
                  [currentPhase.id]: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          {/* Phase Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPhaseIndex(Math.max(0, currentPhaseIndex - 1))
              }
              disabled={currentPhaseIndex === 0}
            >
              Previous Phase
            </Button>
            <Button
              onClick={() => {
                if (currentPhaseIndex < phases.length - 1) {
                  setCurrentPhaseIndex(currentPhaseIndex + 1);
                } else if (onPhaseComplete) {
                  onPhaseComplete(currentPhase.id, {
                    notes: phaseNotes[currentPhase.id],
                  });
                }
              }}
              disabled={
                calculatePhaseProgress(currentPhase) < 100 &&
                currentPhaseIndex < phases.length - 1
              }
            >
              {currentPhaseIndex === phases.length - 1
                ? "Complete Workflow"
                : "Next Phase"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deliverables Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Expected Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentPhase.deliverables.map((deliverable, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Circle className="w-4 h-4 text-gray-400" />
                {deliverable}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
