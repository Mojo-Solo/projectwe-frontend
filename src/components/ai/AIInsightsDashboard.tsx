import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Scale,
  Building,
  RefreshCw,
} from "lucide-react";

interface Insight {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  agent: string;
  timestamp: Date;
}

interface ValuationData {
  low: number;
  midpoint: number;
  high: number;
  confidence: string;
  lastUpdated: Date;
}

interface RiskSummary {
  totalRisks: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  overallScore: number;
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchInsights();
    fetchValuation();
    fetchRiskSummary();
  }, [fetchInsights, fetchValuation, fetchRiskSummary]);

  const fetchInsights = async () => {
    // Mock data - replace with actual API call
    setInsights([
      {
        id: "1",
        type: "valuation",
        category: "financial",
        title: "Revenue Growth Opportunity",
        description:
          "Implementing subscription model could increase valuation by 15-20%",
        confidence: 0.85,
        priority: "high",
        actionable: true,
        agent: "valuation",
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "risk",
        category: "operational",
        title: "Key Person Dependency",
        description: "High dependency on founder may reduce buyer interest",
        confidence: 0.9,
        priority: "high",
        actionable: true,
        agent: "risk",
        timestamp: new Date(),
      },
      {
        id: "3",
        type: "strategy",
        category: "market",
        title: "Strategic Buyer Interest",
        description: "3 potential strategic buyers identified in your market",
        confidence: 0.75,
        priority: "medium",
        actionable: true,
        agent: "market",
        timestamp: new Date(),
      },
    ]);
  };

  const fetchValuation = async () => {
    // Mock data - replace with actual API call
    setValuation({
      low: 5000000,
      midpoint: 7500000,
      high: 10000000,
      confidence: "medium",
      lastUpdated: new Date(),
    });
  };

  const fetchRiskSummary = async () => {
    // Mock data - replace with actual API call
    setRiskSummary({
      totalRisks: 12,
      highPriority: 3,
      mediumPriority: 5,
      lowPriority: 4,
      overallScore: 65,
    });
  };

  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchInsights(), fetchValuation(), fetchRiskSummary()]);
    setIsLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "valuation":
        return <DollarSign className="h-4 w-4" />;
      case "risk":
        return <AlertTriangle className="h-4 w-4" />;
      case "strategy":
        return <TrendingUp className="h-4 w-4" />;
      case "timeline":
        return <Calendar className="h-4 w-4" />;
      case "market":
        return <Users className="h-4 w-4" />;
      case "legal":
        return <Scale className="h-4 w-4" />;
      case "tax":
        return <FileText className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredInsights =
    selectedCategory === "all"
      ? insights
      : insights.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Exit Planning Insights</h2>
        <Button onClick={refreshAll} disabled={isLoading} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Valuation
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valuation ? formatCurrency(valuation.midpoint) : "Loading..."}
            </div>
            {valuation && (
              <p className="text-xs text-muted-foreground">
                Range: {formatCurrency(valuation.low)} -{" "}
                {formatCurrency(valuation.high)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {riskSummary ? `${riskSummary.overallScore}/100` : "Loading..."}
            </div>
            {riskSummary && (
              <Progress value={riskSummary.overallScore} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Insights
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground">
              {insights.filter((i) => i.priority === "high").length} high
              priority
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
            >
              Financial
            </Button>
            <Button
              variant={
                selectedCategory === "operational" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory("operational")}
            >
              Operational
            </Button>
            <Button
              variant={selectedCategory === "market" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("market")}
            >
              Market
            </Button>
          </div>

          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIcon(insight.type)}
                      <CardTitle className="text-base">
                        {insight.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          insight.priority === "high"
                            ? "destructive"
                            : insight.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.priority}
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Generated by {insight.agent} agent</span>
                    <span>{insight.timestamp.toLocaleDateString()}</span>
                  </div>
                  {insight.actionable && (
                    <Button className="mt-4" size="sm">
                      Take Action
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {riskSummary && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {riskSummary.totalRisks}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-destructive">
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {riskSummary.highPriority}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-yellow-600">
                    Medium Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {riskSummary.mediumPriority}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-600">
                    Low Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {riskSummary.lowPriority}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Recommendations</CardTitle>
              <CardDescription>
                Based on your business analysis, here are the top
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Strengthen Financial Documentation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Prepare audited financials for the last 3 years to
                      increase buyer confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Reduce Key Person Dependency
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Develop management team and document processes to reduce
                      founder dependency
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Optimize Tax Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider restructuring options to minimize tax impact on
                      exit
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
