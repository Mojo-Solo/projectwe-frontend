"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { addMonths, format, startOfMonth } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  TrendingUp,
  Users,
  FileText,
  Briefcase,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  phase: string;
  startDate: Date;
  endDate: Date;
  status: "not-started" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  dependencies: string[];
  owner: string;
  estimatedHours: number;
  actualHours?: number;
  category:
    | "preparation"
    | "marketing"
    | "negotiation"
    | "closing"
    | "transition";
}

interface ExitTimelineVisualizationProps {
  timeframe?: "6months" | "1year" | "2years" | "3years" | "custom";
  exitType?: "acquisition" | "financial" | "management" | "ipo" | "merger";
  businessComplexity?: "simple" | "moderate" | "complex";
  onMilestoneUpdate?: (milestone: TimelineMilestone) => void;
  className?: string;
}

const EXIT_PHASES = {
  preparation: {
    name: "Preparation Phase",
    description: "Business preparation and optimization",
    color: "#3b82f6",
    duration: { min: 6, max: 18 }, // months
  },
  marketing: {
    name: "Marketing Phase",
    description: "Market the business to potential buyers",
    color: "#10b981",
    duration: { min: 3, max: 9 },
  },
  negotiation: {
    name: "Negotiation Phase",
    description: "Due diligence and deal negotiation",
    color: "#f59e0b",
    duration: { min: 2, max: 6 },
  },
  closing: {
    name: "Closing Phase",
    description: "Legal documentation and closing",
    color: "#ef4444",
    duration: { min: 1, max: 3 },
  },
  transition: {
    name: "Transition Phase",
    description: "Post-closing transition and integration",
    color: "#8b5cf6",
    duration: { min: 3, max: 12 },
  },
};

const generateTimelineMilestones = (
  timeframe: string,
  exitType: string,
  complexity: string,
): TimelineMilestone[] => {
  const startDate = new Date();
  const baseMilestones: Omit<TimelineMilestone, "startDate" | "endDate">[] = [
    // Preparation Phase
    {
      id: "financial-cleanup",
      title: "Financial Records Cleanup",
      description: "Organize and audit financial statements",
      phase: "preparation",
      status: "not-started",
      priority: "critical",
      dependencies: [],
      owner: "CFO/Accountant",
      estimatedHours: 120,
      category: "preparation",
    },
    {
      id: "legal-structure",
      title: "Legal Structure Review",
      description: "Review corporate structure and compliance",
      phase: "preparation",
      status: "not-started",
      priority: "high",
      dependencies: [],
      owner: "Legal Counsel",
      estimatedHours: 80,
      category: "preparation",
    },
    {
      id: "management-strengthening",
      title: "Management Team Strengthening",
      description: "Build strong management team to reduce owner dependency",
      phase: "preparation",
      status: "not-started",
      priority: "high",
      dependencies: [],
      owner: "CEO/Owner",
      estimatedHours: 200,
      category: "preparation",
    },
    {
      id: "valuation-analysis",
      title: "Business Valuation",
      description: "Professional business valuation and benchmarking",
      phase: "preparation",
      status: "not-started",
      priority: "high",
      dependencies: ["financial-cleanup"],
      owner: "Business Appraiser",
      estimatedHours: 40,
      category: "preparation",
    },

    // Marketing Phase
    {
      id: "marketing-materials",
      title: "Marketing Materials Creation",
      description: "Create CIM, pitch deck, and marketing materials",
      phase: "marketing",
      status: "not-started",
      priority: "high",
      dependencies: ["valuation-analysis"],
      owner: "Investment Banker",
      estimatedHours: 100,
      category: "marketing",
    },
    {
      id: "buyer-identification",
      title: "Buyer Identification",
      description: "Identify and qualify potential buyers",
      phase: "marketing",
      status: "not-started",
      priority: "high",
      dependencies: ["marketing-materials"],
      owner: "Investment Banker",
      estimatedHours: 80,
      category: "marketing",
    },
    {
      id: "initial-outreach",
      title: "Initial Buyer Outreach",
      description: "Contact potential buyers and gauge interest",
      phase: "marketing",
      status: "not-started",
      priority: "medium",
      dependencies: ["buyer-identification"],
      owner: "Investment Banker",
      estimatedHours: 60,
      category: "marketing",
    },

    // Negotiation Phase
    {
      id: "loi-negotiation",
      title: "Letter of Intent Negotiation",
      description: "Negotiate and execute LOI with selected buyer",
      phase: "negotiation",
      status: "not-started",
      priority: "critical",
      dependencies: ["initial-outreach"],
      owner: "Legal Counsel",
      estimatedHours: 40,
      category: "negotiation",
    },
    {
      id: "due-diligence",
      title: "Due Diligence Process",
      description: "Support buyer due diligence activities",
      phase: "negotiation",
      status: "not-started",
      priority: "critical",
      dependencies: ["loi-negotiation"],
      owner: "Management Team",
      estimatedHours: 200,
      category: "negotiation",
    },
    {
      id: "purchase-agreement",
      title: "Purchase Agreement Negotiation",
      description: "Negotiate definitive purchase agreement",
      phase: "negotiation",
      status: "not-started",
      priority: "critical",
      dependencies: ["due-diligence"],
      owner: "Legal Counsel",
      estimatedHours: 80,
      category: "negotiation",
    },

    // Closing Phase
    {
      id: "closing-preparation",
      title: "Closing Preparation",
      description: "Prepare all closing documents and requirements",
      phase: "closing",
      status: "not-started",
      priority: "critical",
      dependencies: ["purchase-agreement"],
      owner: "Legal Counsel",
      estimatedHours: 60,
      category: "closing",
    },
    {
      id: "closing-execution",
      title: "Closing Execution",
      description: "Execute closing and transfer ownership",
      phase: "closing",
      status: "not-started",
      priority: "critical",
      dependencies: ["closing-preparation"],
      owner: "All Parties",
      estimatedHours: 20,
      category: "closing",
    },

    // Transition Phase
    {
      id: "knowledge-transfer",
      title: "Knowledge Transfer",
      description: "Transfer business knowledge to new owners",
      phase: "transition",
      status: "not-started",
      priority: "high",
      dependencies: ["closing-execution"],
      owner: "Former Owner",
      estimatedHours: 100,
      category: "transition",
    },
    {
      id: "integration-support",
      title: "Integration Support",
      description: "Support business integration with buyer",
      phase: "transition",
      status: "not-started",
      priority: "medium",
      dependencies: ["knowledge-transfer"],
      owner: "Former Owner",
      estimatedHours: 80,
      category: "transition",
    },
  ];

  // Calculate timeline based on parameters
  const timeframeMonths = {
    "6months": 6,
    "1year": 12,
    "2years": 24,
    "3years": 36,
    custom: 18,
  };

  const totalMonths =
    timeframeMonths[timeframe as keyof typeof timeframeMonths] || 18;

  // Complexity multiplier
  const complexityMultiplier = {
    simple: 0.8,
    moderate: 1.0,
    complex: 1.3,
  };

  const multiplier =
    complexityMultiplier[complexity as keyof typeof complexityMultiplier] ||
    1.0;

  // Assign dates to milestones
  let currentDate = new Date(startDate);
  const milestones: TimelineMilestone[] = [];

  Object.entries(EXIT_PHASES).forEach(([phaseKey, phase]) => {
    const phaseMilestones = baseMilestones.filter((m) => m.phase === phaseKey);
    const phaseDurationMonths = Math.round(
      (phase.duration.min +
        (phase.duration.max - phase.duration.min) *
          (complexity === "complex" ? 0.8 : 0.4)) *
        multiplier,
    );

    const milestoneMonthsEach = phaseDurationMonths / phaseMilestones.length;

    phaseMilestones.forEach((milestone, index) => {
      const milestoneStart = new Date(currentDate);
      const milestoneEnd = addMonths(
        milestoneStart,
        Math.max(1, Math.round(milestoneMonthsEach)),
      );

      milestones.push({
        ...milestone,
        startDate: milestoneStart,
        endDate: milestoneEnd,
      });

      currentDate = new Date(milestoneEnd);
    });
  });

  return milestones;
};

export function ExitTimelineVisualization({
  timeframe = "2years",
  exitType = "acquisition",
  businessComplexity = "moderate",
  onMilestoneUpdate,
  className,
}: ExitTimelineVisualizationProps) {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [viewType, setViewType] = useState<"timeline" | "gantt" | "phases">(
    "timeline",
  );
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    const generatedMilestones = generateTimelineMilestones(
      timeframe,
      exitType,
      businessComplexity,
    );
    setMilestones(generatedMilestones);
  }, [timeframe, exitType, businessComplexity]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#3b82f6";
      case "blocked":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  // Prepare chart data
  const timelineData = {
    labels: milestones.map((m) => format(m.startDate, "MMM yyyy")),
    datasets: [
      {
        label: "Timeline Progress",
        data: milestones.map((m, index) => ({
          x: m.startDate,
          y: index + 1,
          milestone: m,
        })),
        backgroundColor: milestones.map((m) => getStatusColor(m.status)),
        borderColor: milestones.map((m) => getStatusColor(m.status)),
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  };

  const phaseData = {
    labels: Object.values(EXIT_PHASES).map((p) => p.name),
    datasets: [
      {
        label: "Phase Duration (Months)",
        data: Object.entries(EXIT_PHASES).map(([key, phase]) => {
          const phaseMilestones = milestones.filter((m) => m.phase === key);
          if (phaseMilestones.length === 0) return 0;

          const startDate = Math.min(
            ...phaseMilestones.map((m) => m.startDate.getTime()),
          );
          const endDate = Math.max(
            ...phaseMilestones.map((m) => m.endDate.getTime()),
          );
          return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30)); // Convert to months
        }),
        backgroundColor: Object.values(EXIT_PHASES).map((p) => p.color + "80"),
        borderColor: Object.values(EXIT_PHASES).map((p) => p.color),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Exit Planning Timeline",
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            const milestone = context[0]?.raw?.milestone;
            return milestone ? milestone.title : "";
          },
          label: function (context: any) {
            const milestone = context.raw?.milestone;
            if (!milestone) return "";
            return [
              `Phase: ${EXIT_PHASES[milestone.phase as keyof typeof EXIT_PHASES]?.name}`,
              `Duration: ${format(milestone.startDate, "MMM dd")} - ${format(milestone.endDate, "MMM dd")}`,
              `Owner: ${milestone.owner}`,
              `Status: ${milestone.status.replace("-", " ")}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month" as const,
        },
        title: {
          display: true,
          text: "Timeline",
        },
      },
      y: {
        title: {
          display: true,
          text: "Milestones",
        },
        ticks: {
          callback: function (value: any) {
            const index = Number(value) - 1;
            return milestones[index]?.title.substring(0, 20) + "..." || "";
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Phase Duration Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };

  const exportTimeline = () => {
    // This would export the timeline as PDF or CSV
    console.log("Exporting timeline...", milestones);
  };

  const filteredMilestones =
    selectedPhase === "all"
      ? milestones
      : milestones.filter((m) => m.phase === selectedPhase);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Exit Timeline Visualization
              </CardTitle>
              <CardDescription>
                Track your exit planning milestones and phases
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={viewType}
                onValueChange={(value: any) => setViewType(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="gantt">Gantt</SelectItem>
                  <SelectItem value="phases">Phases</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportTimeline}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {Object.entries(EXIT_PHASES).map(([key, phase]) => (
                  <SelectItem key={key} value={key}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chart Visualization */}
          <div className="h-96 mb-6">
            {viewType === "phases" ? (
              <Bar data={phaseData} options={barOptions} />
            ) : (
              <Line data={timelineData} options={chartOptions} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Cards */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <div className="flex gap-2">
            {Object.entries(EXIT_PHASES).map(([key, phase]) => (
              <div key={key} className="flex items-center gap-1 text-xs">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: phase.color }}
                />
                {phase.name}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredMilestones.map((milestone) => (
            <Card key={milestone.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            EXIT_PHASES[
                              milestone.phase as keyof typeof EXIT_PHASES
                            ]?.color,
                        }}
                      />
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge className={getPriorityBadge(milestone.priority)}>
                        {milestone.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(milestone.startDate, "MMM dd")} -{" "}
                        {format(milestone.endDate, "MMM dd")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {milestone.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {milestone.estimatedHours}h
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {milestone.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {milestone.status === "blocked" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {milestone.status === "in-progress" && (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
