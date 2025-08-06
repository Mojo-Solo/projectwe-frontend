
interface OwnerDashboardProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Target,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the business owner
const mockBusinessData = {
  company: "TechCorp Solutions",
  readinessScore: 85,
  readinessChange: 5,
  valuation: 45000000,
  valuationChange: 12,
  targetExitDate: "2025-09-30",
  daysUntilExit: 548,
  advisor: {
    name: "Michael Thompson",
    firm: "Strategic Exit Partners",
    nextMeeting: "2024-02-15",
  },
  nextActions: [
    {
      id: 1,
      title: "Complete Financial Audit",
      description: "Q4 2023 financial statements need third-party verification",
      priority: "high",
      dueDate: "2024-02-20",
      category: "financial",
    },
    {
      id: 2,
      title: "Update Employee Agreements",
      description:
        "Ensure all key employees have retention agreements in place",
      priority: "high",
      dueDate: "2024-02-25",
      category: "legal",
    },
    {
      id: 3,
      title: "Document Core Processes",
      description: "Create SOPs for critical business operations",
      priority: "medium",
      dueDate: "2024-03-01",
      category: "operations",
    },
  ],
  milestones: [
    { name: "Financial Cleanup", progress: 90, status: "on-track" },
    { name: "Legal Readiness", progress: 75, status: "on-track" },
    { name: "Operations Documentation", progress: 60, status: "attention" },
    { name: "Management Team", progress: 85, status: "on-track" },
    { name: "Growth Trajectory", progress: 95, status: "excellent" },
  ],
};

const categoryColors = {
  financial: "bg-blue-100 text-blue-700",
  legal: "bg-purple-100 text-purple-700",
  operations: "bg-green-100 text-green-700",
  strategic: "bg-orange-100 text-orange-700",
};

const priorityIcons = {
  high: <AlertTriangle className="h-4 w-4 text-red-500" />,
  medium: <Clock className="h-4 w-4 text-yellow-500" />,
  low: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate days until exit in a more readable format
  const formatDaysUntilExit = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}`;
    }
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Exit Journey</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. You&apos;re{" "}
              {mockBusinessData.readinessScore}% ready for exit.
            </p>
          </div>
          <Button size="lg" className="hidden md:flex">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Advisor
          </Button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Exit Readiness Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Exit Readiness Score
              <Target className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {mockBusinessData.readinessScore}%
                </span>
                <span
                  className={cn(
                    "text-sm font-medium mb-1",
                    mockBusinessData.readinessChange > 0
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {mockBusinessData.readinessChange > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(mockBusinessData.readinessChange)}% this month
                </span>
              </div>
              <Progress
                value={mockBusinessData.readinessScore}
                className="h-3"
              />
              <p className="text-sm text-muted-foreground">
                You&apos;re in the top 20% of businesses in your industry
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Valuation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Valuation
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  ${(mockBusinessData.valuation / 1000000).toFixed(1)}M
                </span>
                <span className="text-sm font-medium text-green-600 mb-1">
                  +{mockBusinessData.valuationChange}% YoY
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Revenue Multiple:
                  </span>
                  <span className="font-medium">4.5x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    EBITDA Multiple:
                  </span>
                  <span className="font-medium">12x</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exit Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Exit Timeline
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Target Exit Date
                </p>
                <p className="text-2xl font-bold">Q3 2025</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatDaysUntilExit(mockBusinessData.daysUntilExit)}{" "}
                  remaining
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Timeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Next Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Your Next Actions</CardTitle>
              <CardDescription>
                Priority tasks to increase your exit readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBusinessData.nextActions.map((action) => (
                  <div key={index}
                    key={action.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="mt-1">
                      {
                        priorityIcons[
                          action.priority as keyof typeof priorityIcons
                        ]
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{action.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "ml-4",
                            categoryColors[
                              action.category as keyof typeof categoryColors
                            ],
                          )}
                        >
                          {action.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-muted-foreground">
                          Due: {action.dueDate}
                        </span>
                        <Button size="sm" variant="ghost">
                          Start Task
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">
                      Documents Ready
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">8/10</p>
                    <p className="text-sm text-muted-foreground">
                      Key Employees Retained
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">23%</p>
                    <p className="text-sm text-muted-foreground">
                      Revenue Growth
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">42%</p>
                    <p className="text-sm text-muted-foreground">
                      EBITDA Margin
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Action Items</CardTitle>
              <CardDescription>
                Complete view of all tasks and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Action items view coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exit Readiness by Category</CardTitle>
              <CardDescription>
                Track your progress across all key areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockBusinessData.milestones.map((milestone) => (
                  <div key={milestone.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{milestone.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {milestone.progress}%
                      </span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Advisor Card */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{mockBusinessData.advisor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {mockBusinessData.advisor.firm}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next meeting</p>
              <p className="font-medium">Feb 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
