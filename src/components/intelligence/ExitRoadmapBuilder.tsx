"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Building2,
  FileText,
  ChevronRight,
  Activity,
  Briefcase,
  Award,
  MapPin,
  Milestone,
  Flag,
  Timer,
  PlayCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RoadmapPhase {
  id: string;
  name: string;
  duration: string;
  startMonth: number;
  endMonth: number;
  status: "not-started" | "in-progress" | "completed";
  value: number;
  tasks: RoadmapTask[];
  milestones: Milestone[];
  dependencies: string[];
}

interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  framework: string;
  priority: "critical" | "high" | "medium" | "low";
  effort: number; // days
  status: "pending" | "active" | "completed";
  owner?: string;
  dependencies?: string[];
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  type: "deliverable" | "decision" | "approval" | "review";
  criteria: string[];
}

interface RoadmapMetrics {
  totalDuration: number;
  valueCreated: number;
  tasksCompleted: number;
  currentPhase: string;
  criticalPath: string[];
  riskFactors: RiskFactor[];
}

interface RiskFactor {
  name: string;
  severity: "high" | "medium" | "low";
  mitigation: string;
  impact: string;
}

interface ExitRoadmapBuilderProps {
  clientInfo: any;
  valuationFactors: any;
  selectedFrameworks: any[];
  currentValuation: number;
  optimizedValuation: number;
}

export function ExitRoadmapBuilder({
  clientInfo,
  valuationFactors,
  selectedFrameworks,
  currentValuation,
  optimizedValuation,
}: ExitRoadmapBuilderProps) {
  const [activePhase, setActivePhase] = useState<string>("foundation");
  const [viewMode, setViewMode] = useState<"timeline" | "kanban" | "gantt">(
    "timeline",
  );
  const [showCriticalPath, setShowCriticalPath] = useState(false);

  // Generate dynamic roadmap based on client situation
  const generateRoadmap = (): RoadmapPhase[] => {
    const timeframe = clientInfo.exitTimeframe || "3-5 years";
    const isAccelerated = timeframe === "<1 year" || timeframe === "1-2 years";

    const phases: RoadmapPhase[] = [];

    // Phase 1: Foundation & Assessment
    phases.push({
      id: "foundation",
      name: "Foundation & Assessment",
      duration: isAccelerated ? "2 months" : "3-4 months",
      startMonth: 1,
      endMonth: isAccelerated ? 2 : 4,
      status: "in-progress",
      value: (optimizedValuation - currentValuation) * 0.05,
      tasks: [
        {
          id: "f1-t1",
          title: "Comprehensive Business Valuation",
          description:
            "Complete detailed valuation using Julie Keyes' 7-Step Framework",
          framework: "7-Step Exit Success Framework",
          priority: "critical",
          effort: 10,
          status: "active",
        },
        {
          id: "f1-t2",
          title: "Exit Readiness Assessment",
          description: "Evaluate all aspects of business readiness for exit",
          framework: "Exit Readiness Scorecard",
          priority: "critical",
          effort: 5,
          status: "pending",
        },
        {
          id: "f1-t3",
          title: "Gap Analysis & Opportunity Identification",
          description: "Identify value gaps and enhancement opportunities",
          framework: "Value Gap Analysis",
          priority: "high",
          effort: 7,
          status: "pending",
        },
        {
          id: "f1-t4",
          title: "Assemble Exit Planning Team",
          description: "Engage advisors: attorney, CPA, banker, broker",
          framework: "Advisory Team Structure",
          priority: "high",
          effort: 3,
          status: "pending",
        },
      ],
      milestones: [
        {
          id: "m1",
          name: "Baseline Valuation Complete",
          date: "Month 2",
          type: "deliverable",
          criteria: [
            "Valuation report delivered",
            "Value gaps identified",
            "Enhancement opportunities documented",
          ],
        },
        {
          id: "m2",
          name: "Exit Strategy Defined",
          date: "Month 3",
          type: "decision",
          criteria: [
            "Exit timeline confirmed",
            "Buyer type identified",
            "Value targets set",
          ],
        },
      ],
      dependencies: [],
    });

    // Phase 2: Value Enhancement
    phases.push({
      id: "value-enhancement",
      name: "Value Enhancement Execution",
      duration: isAccelerated ? "4-6 months" : "8-12 months",
      startMonth: isAccelerated ? 3 : 5,
      endMonth: isAccelerated ? 8 : 16,
      status: "not-started",
      value: (optimizedValuation - currentValuation) * 0.4,
      tasks: [
        ...(valuationFactors.recurringRevenue < 70
          ? [
              {
                id: "ve-t1",
                title: "Implement Recurring Revenue Model",
                description:
                  "Convert one-time sales to subscription/recurring model",
                framework: "Recurring Revenue Optimization",
                priority: "critical" as const,
                effort: 30,
                status: "pending" as const,
              },
            ]
          : []),
        ...(valuationFactors.customerConcentration > 30
          ? [
              {
                id: "ve-t2",
                title: "Customer Diversification Initiative",
                description: "Reduce customer concentration below 20%",
                framework: "Customer Diversification Strategy",
                priority: "critical" as const,
                effort: 45,
                status: "pending" as const,
              },
            ]
          : []),
        ...(valuationFactors.managementDepth < 70
          ? [
              {
                id: "ve-t3",
                title: "Build Second-Tier Management",
                description: "Develop and empower management team",
                framework: "Leadership Development Pipeline",
                priority: "high" as const,
                effort: 60,
                status: "pending" as const,
              },
            ]
          : []),
        {
          id: "ve-t4",
          title: "Financial Systems Upgrade",
          description:
            "Implement professional financial controls and reporting",
          framework: "Financial Controls Framework",
          priority: "high",
          effort: 20,
          status: "pending",
        },
        {
          id: "ve-t5",
          title: "Process Documentation",
          description: "Document all critical business processes",
          framework: "Process Documentation System",
          priority: "medium",
          effort: 25,
          status: "pending",
        },
      ],
      milestones: [
        {
          id: "m3",
          name: "Recurring Revenue Target Achieved",
          date: "Month 8",
          type: "deliverable",
          criteria: [
            "80%+ recurring revenue",
            "Predictable cash flow",
            "Customer retention >90%",
          ],
        },
        {
          id: "m4",
          name: "Management Independence",
          date: "Month 12",
          type: "approval",
          criteria: [
            "Business runs without owner",
            "Key decisions documented",
            "Succession plan active",
          ],
        },
      ],
      dependencies: ["foundation"],
    });

    // Phase 3: Financial & Legal Preparation
    phases.push({
      id: "preparation",
      name: "Financial & Legal Preparation",
      duration: isAccelerated ? "3 months" : "4-6 months",
      startMonth: isAccelerated ? 9 : 17,
      endMonth: isAccelerated ? 11 : 22,
      status: "not-started",
      value: (optimizedValuation - currentValuation) * 0.25,
      tasks: [
        {
          id: "fl-t1",
          title: "Three-Year Financial Cleanup",
          description: "Prepare auditable financials and normalize EBITDA",
          framework: "Three-Year Financial Cleanup",
          priority: "critical",
          effort: 30,
          status: "pending",
        },
        {
          id: "fl-t2",
          title: "Quality of Earnings Preparation",
          description: "Prepare for buyer due diligence requirements",
          framework: "Quality of Earnings Preparation",
          priority: "high",
          effort: 20,
          status: "pending",
        },
        {
          id: "fl-t3",
          title: "Legal & Compliance Review",
          description: "Address all legal issues and ensure compliance",
          framework: "Compliance Audit Framework",
          priority: "high",
          effort: 15,
          status: "pending",
        },
        {
          id: "fl-t4",
          title: "IP Portfolio Optimization",
          description: "Protect and document all intellectual property",
          framework: "IP Portfolio Optimization",
          priority: "medium",
          effort: 10,
          status: "pending",
        },
      ],
      milestones: [
        {
          id: "m5",
          name: "Clean Financials Certified",
          date: "Month 20",
          type: "approval",
          criteria: [
            "CPA certified statements",
            "No material adjustments",
            "EBITDA documented",
          ],
        },
      ],
      dependencies: ["value-enhancement"],
    });

    // Phase 4: Market Positioning
    phases.push({
      id: "positioning",
      name: "Strategic Market Positioning",
      duration: isAccelerated ? "2 months" : "3-4 months",
      startMonth: isAccelerated ? 12 : 23,
      endMonth: isAccelerated ? 13 : 26,
      status: "not-started",
      value: (optimizedValuation - currentValuation) * 0.15,
      tasks: [
        {
          id: "mp-t1",
          title: "Develop Growth Story",
          description: "Create compelling narrative for buyers",
          framework: "Growth Story Development",
          priority: "high",
          effort: 10,
          status: "pending",
        },
        {
          id: "mp-t2",
          title: "Strategic Buyer Identification",
          description: "Map potential acquirers and synergies",
          framework: "Strategic Buyer Identification",
          priority: "high",
          effort: 15,
          status: "pending",
        },
        {
          id: "mp-t3",
          title: "Prepare Marketing Materials",
          description: "Create CIM and management presentation",
          framework: "Marketing Materials Framework",
          priority: "medium",
          effort: 12,
          status: "pending",
        },
      ],
      milestones: [
        {
          id: "m6",
          name: "Go-to-Market Ready",
          date: "Month 25",
          type: "approval",
          criteria: [
            "CIM approved",
            "Buyer list finalized",
            "Data room prepared",
          ],
        },
      ],
      dependencies: ["preparation"],
    });

    // Phase 5: Transaction Execution
    phases.push({
      id: "execution",
      name: "Transaction Execution",
      duration: "4-6 months",
      startMonth: isAccelerated ? 14 : 27,
      endMonth: isAccelerated ? 18 : 32,
      status: "not-started",
      value: (optimizedValuation - currentValuation) * 0.15,
      tasks: [
        {
          id: "te-t1",
          title: "Launch Sale Process",
          description: "Begin formal outreach to buyers",
          framework: "Sale Process Management",
          priority: "critical",
          effort: 5,
          status: "pending",
        },
        {
          id: "te-t2",
          title: "Negotiate LOIs",
          description: "Review and negotiate letters of intent",
          framework: "LOI Negotiation Framework",
          priority: "critical",
          effort: 10,
          status: "pending",
        },
        {
          id: "te-t3",
          title: "Manage Due Diligence",
          description: "Support buyer due diligence process",
          framework: "Due Diligence Management",
          priority: "critical",
          effort: 30,
          status: "pending",
        },
        {
          id: "te-t4",
          title: "Close Transaction",
          description: "Finalize agreements and close deal",
          framework: "Closing Process Management",
          priority: "critical",
          effort: 15,
          status: "pending",
        },
      ],
      milestones: [
        {
          id: "m7",
          name: "LOI Signed",
          date: "Month 28",
          type: "approval",
          criteria: ["Acceptable price", "Terms agreed", "Exclusivity period"],
        },
        {
          id: "m8",
          name: "Transaction Closed",
          date: "Month 32",
          type: "deliverable",
          criteria: [
            "Purchase agreement signed",
            "Funds received",
            "Transition complete",
          ],
        },
      ],
      dependencies: ["positioning"],
    });

    return phases;
  };

  const [roadmapPhases, setRoadmapPhases] =
    useState<RoadmapPhase[]>(generateRoadmap());

  // Calculate metrics
  const calculateMetrics = (): RoadmapMetrics => {
    const totalTasks = roadmapPhases.reduce(
      (sum, phase) => sum + phase.tasks.length,
      0,
    );
    const completedTasks = roadmapPhases.reduce(
      (sum, phase) =>
        sum + phase.tasks.filter((t) => t.status === "completed").length,
      0,
    );

    const currentPhase =
      roadmapPhases.find((p) => p.status === "in-progress")?.name ||
      "Not Started";

    const riskFactors: RiskFactor[] = [];

    if (valuationFactors.customerConcentration > 40) {
      riskFactors.push({
        name: "High Customer Concentration",
        severity: "high",
        mitigation: "Aggressive diversification program",
        impact: "May reduce valuation by 20-30%",
      });
    }

    if (valuationFactors.managementDepth < 50) {
      riskFactors.push({
        name: "Owner Dependency",
        severity: "high",
        mitigation: "Accelerated management development",
        impact: "Buyers may require extended earnout",
      });
    }

    if (valuationFactors.recurringRevenue < 40) {
      riskFactors.push({
        name: "Low Recurring Revenue",
        severity: "medium",
        mitigation: "Implement subscription models",
        impact: "Lower valuation multiple",
      });
    }

    return {
      totalDuration: roadmapPhases[roadmapPhases.length - 1].endMonth,
      valueCreated: roadmapPhases.reduce((sum, phase) => sum + phase.value, 0),
      tasksCompleted: completedTasks,
      currentPhase,
      criticalPath: roadmapPhases
        .flatMap((p) => p.tasks)
        .filter((t) => t.priority === "critical")
        .map((t) => t.id),
      riskFactors,
    };
  };

  const [metrics, setMetrics] = useState<RoadmapMetrics>(calculateMetrics());

  // Update metrics when roadmap changes
  useEffect(() => {
    setMetrics(calculateMetrics());
  }, [roadmapPhases]);

  // Timeline View Component
  const TimelineView = () => (
    <div className="relative">
      {/* Timeline Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Exit Planning Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {metrics.totalDuration} month journey to maximize value
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCriticalPath(!showCriticalPath)}
          >
            <Zap className="h-4 w-4 mr-1" />
            {showCriticalPath ? "Hide" : "Show"} Critical Path
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <Activity className="h-4 w-4 mr-1" />
            Kanban View
          </Button>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-6">
        {roadmapPhases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative ${phase.id === activePhase ? "scale-105" : ""}`}
          >
            <Card
              className={`cursor-pointer transition-all ${
                phase.status === "completed"
                  ? "border-green-500 bg-green-50"
                  : phase.status === "in-progress"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
              }`}
              onClick={() => setActivePhase(phase.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          phase.status === "completed"
                            ? "bg-green-500 text-white"
                            : phase.status === "in-progress"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300"
                        }`}
                      >
                        {phase.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : phase.status === "in-progress" ? (
                          <Timer className="h-5 w-5 animate-pulse" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{phase.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Months {phase.startMonth}-{phase.endMonth} •{" "}
                          {phase.duration}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Tasks</p>
                        <p className="font-semibold">
                          {
                            phase.tasks.filter((t) => t.status === "completed")
                              .length
                          }
                          /{phase.tasks.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Value Impact
                        </p>
                        <p className="font-semibold text-green-600">
                          +${(phase.value / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Milestones
                        </p>
                        <p className="font-semibold">
                          {phase.milestones.length}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress
                      value={
                        (phase.tasks.filter((t) => t.status === "completed")
                          .length /
                          phase.tasks.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Connection Line */}
            {index < roadmapPhases.length - 1 && (
              <div className="absolute left-6 top-full h-6 w-0.5 bg-gray-300" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Kanban View Component
  const KanbanView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Task Management Board</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode("timeline")}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Timeline View
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["pending", "active", "completed"].map((status) => (
          <Card key={status} className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">{status}</CardTitle>
                <Badge variant="secondary">
                  {
                    roadmapPhases
                      .flatMap((p) => p.tasks)
                      .filter((t) => t.status === status).length
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {roadmapPhases.flatMap((phase) =>
                    phase.tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <Card key={index}
                          key={task.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm line-clamp-2">
                                {task.title}
                              </h5>
                              <Badge
                                variant={
                                  task.priority === "critical"
                                    ? "destructive"
                                    : task.priority === "high"
                                      ? "default"
                                      : "secondary"
                                }
                                className="ml-2 text-xs"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {task.effort} days
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {task.framework}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )),
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium">Total Duration</p>
              </div>
              <p className="text-2xl font-bold">
                {metrics.totalDuration} months
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium">Value Created</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                +${(metrics.valueCreated / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-medium">Current Phase</p>
              </div>
              <p className="text-lg font-semibold">{metrics.currentPhase}</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-medium">Tasks Complete</p>
              </div>
              <p className="text-2xl font-bold">
                {metrics.tasksCompleted}/
                {roadmapPhases.reduce((sum, p) => sum + p.tasks.length, 0)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium">Risk Factors</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {metrics.riskFactors.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <TimelineView />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <KanbanView />
        </TabsContent>

        <TabsContent value="gantt" className="mt-6">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Interactive Gantt chart with drag-and-drop scheduling coming soon.
              This will show task dependencies and critical path visualization.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Phase Details */}
      <AnimatePresence mode="wait">
        {activePhase && (
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {roadmapPhases.find((p) => p.id === activePhase)?.name} -
                  Detailed View
                </CardTitle>
                <CardDescription>
                  Tasks, milestones, and dependencies for this phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tasks">
                  <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tasks" className="mt-4">
                    <div className="space-y-3">
                      {roadmapPhases
                        .find((p) => p.id === activePhase)
                        ?.tasks.map((task) => (
                          <div key={index}
                            key={task.id}
                            className="flex items-start gap-3 p-3 border rounded-lg"
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                task.status === "completed"
                                  ? "bg-green-100"
                                  : task.status === "active"
                                    ? "bg-blue-100"
                                    : "bg-gray-100"
                              }`}
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : task.status === "active" ? (
                                <PlayCircle className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium">{task.title}</h5>
                                <Badge
                                  variant={
                                    task.priority === "critical"
                                      ? "destructive"
                                      : task.priority === "high"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  {task.effort} days
                                </span>
                                <span className="flex items-center gap-1">
                                  <Brain className="h-3 w-3" />
                                  {task.framework}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="milestones" className="mt-4">
                    <div className="space-y-4">
                      {roadmapPhases
                        .find((p) => p.id === activePhase)
                        ?.milestones.map((milestone) => (
                          <Card key={milestone.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    milestone.type === "deliverable"
                                      ? "bg-green-100"
                                      : milestone.type === "decision"
                                        ? "bg-blue-100"
                                        : milestone.type === "approval"
                                          ? "bg-purple-100"
                                          : "bg-orange-100"
                                  }`}
                                >
                                  <Milestone className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-semibold">
                                      {milestone.name}
                                    </h5>
                                    <Badge variant="outline">
                                      {milestone.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Target: {milestone.date}
                                  </p>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                      Success Criteria:
                                    </p>
                                    {milestone.criteria.map((criterion, i) => (
                                      <div key={i}
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-muted-foreground"
                                      >
                                        <CheckCircle2 className="h-3 w-3" />
                                        {criterion}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="frameworks" className="mt-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {roadmapPhases
                        .find((p) => p.id === activePhase)
                        ?.tasks.map((t) => t.framework)
                        .filter((f, i, arr) => arr.indexOf(f) === i)
                        .map((framework) => (
                          <Card key={framework} className="border-dashed">
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                <h5 className="font-medium">{framework}</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                Julie Keyes&apos; proven framework being applied
                                in this phase
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risk Factors */}
      {metrics.riskFactors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Risk Factors & Mitigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.riskFactors.map((risk, index) => (
                <Alert key={index}
                  key={index}
                  variant={risk.severity === "high" ? "destructive" : "default"}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{risk.name}</p>
                      <p className="text-sm">Impact: {risk.impact}</p>
                      <p className="text-sm">Mitigation: {risk.mitigation}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
