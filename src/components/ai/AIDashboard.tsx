"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  MessageSquare,
  GitBranch,
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Sparkles,
  Upload,
  Download,
  Calendar,
  Shield,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIChatInterface } from "./AIChatInterface";
import { AgentWorkflowBuilder } from "./AgentWorkflowBuilder";
import { ExitPlanningWizard } from "./ExitPlanningWizard";
import { ValuationCalculator } from "./ValuationCalculator";
import { AIInsight, AIWorkflow } from "@/types/ai";
import AIApiService from "@/lib/ai-api";

interface AIDashboardProps {
  workspaceId?: string;
  userId?: string;
}

export function AIDashboard({ workspaceId, userId }: AIDashboardProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [usageStats, setUsageStats] = useState({
    totalCost: 0,
    totalTokens: 0,
    conversationCount: 0,
    insightCount: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const apiService = new AIApiService();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadInitialData = async () => {
    setIsLoadingStats(true);
    try {
      // Load usage stats
      const stats = await apiService.getUsageStats("month");
      setUsageStats(stats);

      // Load recent insights
      const recentInsights = await apiService.getInsights();
      setInsights(recentInsights.slice(0, 5));

      // Load workflows
      const userWorkflows = await apiService.getWorkflows();
      setWorkflows(userWorkflows);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleInsightGenerated = (insight: AIInsight) => {
    setInsights((prev) => [insight, ...prev].slice(0, 10));
  };

  const handleWorkflowCreated = (workflow: AIWorkflow) => {
    setWorkflows((prev) => [workflow, ...prev]);
  };

  const handleWizardComplete = (data: any, newInsights: AIInsight[]) => {
    setInsights((prev) => [...newInsights, ...prev].slice(0, 10));
    // Could also trigger other actions like creating a project
  };

  const handleValuationComplete = (results: any[]) => {
    // Could create an insight from valuation results
    const valuationInsight: AIInsight = {
      id: Date.now().toString(),
      type: "valuation",
      title: "Business Valuation Completed",
      summary: `Estimated value range: ${results[0]?.value || 0} - ${results[results.length - 1]?.value || 0}`,
      details: results,
      confidence: 0.85,
      sources: ["Financial Analysis"],
      agentId: "valuation",
      createdAt: new Date(),
    };
    handleInsightGenerated(valuationInsight);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getInsightIcon = (type: AIInsight["type"]) => {
    const icons = {
      valuation: TrendingUp,
      risk: Shield,
      strategy: Target,
      timeline: Calendar,
      market: Activity,
      legal: FileText,
      tax: Calculator,
    };
    const Icon = icons[type] || Bot;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total AI Spend</p>
                <p className="text-2xl font-bold">
                  {isLoadingStats
                    ? "..."
                    : formatCurrency(usageStats.totalCost)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <Progress value={75} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              75% of monthly budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens Used</p>
                <p className="text-2xl font-bold">
                  {isLoadingStats
                    ? "..."
                    : usageStats.totalTokens.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">GPT-4</Badge>
              <Badge variant="outline">Claude</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold">
                  {isLoadingStats ? "..." : usageStats.conversationCount}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">
                  {isLoadingStats ? "..." : usageStats.insightCount}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Across all agents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Chat with AI agents, build workflows, and get intelligent
                insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="wizard">Wizard</TabsTrigger>
                  <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  <TabsTrigger value="workflows">Workflows</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-4">
                  <AIChatInterface
                    onInsightGenerated={handleInsightGenerated}
                  />
                </TabsContent>

                <TabsContent value="wizard" className="mt-4">
                  <ExitPlanningWizard onComplete={handleWizardComplete} />
                </TabsContent>

                <TabsContent value="valuation" className="mt-4">
                  <ValuationCalculator
                    onValuationComplete={handleValuationComplete}
                  />
                </TabsContent>

                <TabsContent value="workflows" className="mt-4">
                  <AgentWorkflowBuilder
                    onWorkflowCreated={handleWorkflowCreated}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Recent Insights
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No insights yet. Start a conversation or run the wizard!
                    </p>
                  ) : (
                    insights.map((insight) => (
                      <Card key={index}
                        key={insight.id}
                        className="cursor-pointer hover:shadow-sm transition-shadow"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {insight.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {insight.summary}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {insight.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    insight.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => setActiveTab("wizard")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Exit Wizard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => setActiveTab("valuation")}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Quick Valuation
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Doc
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Active Workflows
                <Badge variant="secondary">{workflows.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflows.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active workflows
                  </p>
                ) : (
                  workflows.slice(0, 3).map((workflow) => (
                    <div key={index}
                      key={workflow.id}
                      className="flex items-center justify-between p-2 rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {workflow.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          workflow.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
