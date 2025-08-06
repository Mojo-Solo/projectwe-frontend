
interface ExitPlanningDashboardProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ValuationCalculator } from "@/components/exit-planning/valuation-calculator";
import { ReadinessAssessment } from "@/components/exit-planning/readiness-assessment";
import { ExitTimeline } from "@/components/exit-planning/exit-timeline";
import { ProgressTracker } from "@/components/exit-planning/progress-tracker";
import { ReadinessVisualization } from "@/components/exit-planning/readiness-visualization";
import { MilestoneTracker } from "@/components/exit-planning/milestone-tracker";
import { PillarFeatures } from "@/components/exit-planning/pillar-features";
import { RecommendationsPanel } from "@/components/exit-planning/recommendations-panel";
import { TaskIntegrationPanel } from "@/components/exit-planning/task-integration-panel";
import { ExitPlanningAPIDemo } from "@/components/exit-planning/api-demo";
import {
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart,
  BarChart3,
  Users,
  FileText,
  ArrowRight,
  Building,
  DollarSign,
  Clock,
  Shield,
  ListTodo,
} from "lucide-react";

export default function ExitPlanningDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [readinessScore, setReadinessScore] = useState(68);
  const [valuationEstimate, setValuationEstimate] = useState(5200000);
  const [currentPhase, setCurrentPhase] = useState("discovery");

  const keyMetrics = [
    {
      title: "Readiness Score",
      value: `${readinessScore}%`,
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Estimated Value",
      value: `$${(valuationEstimate / 1000000).toFixed(1)}M`,
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Time to Exit",
      value: "18 months",
      change: "-3 months",
      trend: "down",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Risk Level",
      value: "Medium",
      change: "Stable",
      trend: "neutral",
      icon: Shield,
      color: "text-orange-600",
    },
  ];

  const actionItems = [
    {
      title: "Complete Financial Audit",
      priority: "high",
      dueDate: "2025-02-15",
      status: "in-progress",
    },
    {
      title: "Update Business Valuation",
      priority: "medium",
      dueDate: "2025-02-28",
      status: "pending",
    },
    {
      title: "Identify Potential Buyers",
      priority: "high",
      dueDate: "2025-03-15",
      status: "pending",
    },
    {
      title: "Prepare Due Diligence Documents",
      priority: "medium",
      dueDate: "2025-03-30",
      status: "pending",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exit Planning Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Orchestrate your business exit with AI-powered insights and
            strategic guidance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Schedule Consultation
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.trend === "up" && (
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                )}
                {metric.trend === "down" && (
                  <TrendingUp className="inline h-3 w-3 mr-1 text-red-600 rotate-180" />
                )}
                {metric.change} from last quarter
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Exit Planning Progress</CardTitle>
          <CardDescription>
            Current Phase:{" "}
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressTracker />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="api-demo">API Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Key tasks for your exit journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionItems.map((item, index) => (
                  <div key={index}
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === "in-progress" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {item.dueDate}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Strategic recommendations from our Coach pillar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4" />
                    Market Opportunity
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current market conditions, businesses in your
                    industry are selling at premium valuations. Consider
                    accelerating your exit timeline.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <BarChart className="h-4 w-4" />
                    Value Enhancement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Improving operational efficiency by 15% could increase your
                    business value by approximately $780,000.
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  View All Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationsPanel
            businessMetrics={{
              revenue: 5000000,
              ebitda: valuationEstimate * 0.15,
              industry: "technology",
              yearsInBusiness: 8,
              employeeCount: 35,
              readinessScores: {
                financial: 75,
                operations: 82,
                legal: 68,
                market: 90,
                management: 72,
                strategic: 85,
              },
            }}
          />
        </TabsContent>

        <TabsContent value="valuation">
          <Card>
            <CardHeader>
              <CardTitle>Business Valuation Calculator</CardTitle>
              <CardDescription>
                Get an estimated valuation using industry-standard multiples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuationCalculator
                onValuationComplete={(result) => {
                  const avgRevenue = result.revenueValuation.average;
                  const avgEbitda = result.ebitdaValuation.average;
                  setValuationEstimate(Math.max(avgRevenue, avgEbitda));
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readiness">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exit Readiness Assessment</CardTitle>
                <CardDescription>
                  Evaluate your business readiness across key dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReadinessAssessment
                  onAssessmentComplete={(result) =>
                    setReadinessScore(result.overallScore)
                  }
                />
              </CardContent>
            </Card>

            <ReadinessVisualization
              readinessData={{
                financial: 75,
                operations: 82,
                legal: 68,
                market: 90,
                management: 72,
                strategic: 85,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Exit Planning Timeline</CardTitle>
              <CardDescription>
                Visualize your journey from preparation to successful exit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExitTimeline />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Management</CardTitle>
              <CardDescription>
                Track and manage your exit planning milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MilestoneTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>
                Explore our AI-powered exit planning capabilities across all
                four pillars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PillarFeatures />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Task Management Integration
              </CardTitle>
              <CardDescription>
                Convert your exit planning strategy into actionable tasks with
                our integrated workflow system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskIntegrationPanel
                workspaceId="default-workspace"
                businessName="Your Business"
                exitPlanningId="exit-plan-1"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                API Integration Demo
              </CardTitle>
              <CardDescription>
                Test the comprehensive exit planning analysis with our enhanced
                rules-based AI API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExitPlanningAPIDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
