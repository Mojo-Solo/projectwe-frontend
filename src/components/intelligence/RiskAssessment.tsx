"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  TrendingUp,
  Eye,
  RefreshCw,
  Download,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface RiskFactor {
  id: string;
  category:
    | "financial"
    | "operational"
    | "market"
    | "regulatory"
    | "strategic"
    | "technology";
  title: string;
  description: string;
  current_rating: number; // 1-10 scale
  impact_severity: number; // 1-10 scale
  likelihood: number; // 1-10 scale
  mitigation_status: "not_started" | "in_progress" | "completed" | "ongoing";
  mitigation_strategies: MitigationStrategy[];
  trend: "increasing" | "stable" | "decreasing";
  time_horizon: "immediate" | "short_term" | "medium_term" | "long_term";
  last_updated: string;
  related_risks: string[];
}

interface MitigationStrategy {
  id: string;
  title: string;
  description: string;
  cost: number;
  timeframe: string;
  effectiveness: number; // 1-10 scale
  status: "planned" | "in_progress" | "completed";
  responsible_party: string;
  success_metrics: string[];
}

interface RiskAssessmentData {
  overall_risk_score: number;
  risk_distribution: Record<string, number>;
  risk_trends: Record<string, "increasing" | "stable" | "decreasing">;
  critical_risks: RiskFactor[];
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    category: string;
    recommendation: string;
    rationale: string;
    estimated_impact: number;
  }>;
}

const SAMPLE_RISKS: RiskFactor[] = [
  {
    id: "customer-concentration",
    category: "financial",
    title: "Customer Concentration Risk",
    description:
      "High dependence on top 3 customers representing 65% of revenue",
    current_rating: 8,
    impact_severity: 9,
    likelihood: 6,
    mitigation_status: "in_progress",
    mitigation_strategies: [
      {
        id: "diversify-base",
        title: "Customer Base Diversification",
        description:
          "Aggressive sales strategy to acquire 20+ new mid-size customers",
        cost: 250000,
        timeframe: "12 months",
        effectiveness: 8,
        status: "in_progress",
        responsible_party: "Sales Team",
        success_metrics: [
          "Reduce top 3 customer revenue to <40%",
          "Add 25 new customers",
          "Increase customer count by 50%",
        ],
      },
      {
        id: "contract-extensions",
        title: "Long-term Contract Extensions",
        description: "Secure 3-5 year contracts with existing major customers",
        cost: 50000,
        timeframe: "6 months",
        effectiveness: 6,
        status: "planned",
        responsible_party: "Account Management",
        success_metrics: [
          "80% of top customers on 3+ year contracts",
          "Improved contract terms",
          "Revenue predictability",
        ],
      },
    ],
    trend: "decreasing",
    time_horizon: "short_term",
    last_updated: "2024-12-15",
    related_risks: ["revenue-volatility", "market-position"],
  },
  {
    id: "key-person-dependency",
    category: "operational",
    title: "Key Person Dependency",
    description:
      "Critical business functions dependent on founder/CEO knowledge",
    current_rating: 7,
    impact_severity: 8,
    likelihood: 7,
    mitigation_status: "not_started",
    mitigation_strategies: [
      {
        id: "knowledge-transfer",
        title: "Knowledge Transfer Program",
        description:
          "Systematic documentation and transfer of critical business knowledge",
        cost: 150000,
        timeframe: "18 months",
        effectiveness: 9,
        status: "planned",
        responsible_party: "HR & Operations",
        success_metrics: [
          "100% critical processes documented",
          "Cross-trained team members",
          "Reduced single points of failure",
        ],
      },
      {
        id: "succession-planning",
        title: "Leadership Succession Planning",
        description: "Develop and train internal leadership pipeline",
        cost: 200000,
        timeframe: "24 months",
        effectiveness: 8,
        status: "planned",
        responsible_party: "Board & HR",
        success_metrics: [
          "Identified successors for all key roles",
          "Leadership development program",
          "Smooth transition capabilities",
        ],
      },
    ],
    trend: "stable",
    time_horizon: "medium_term",
    last_updated: "2024-12-10",
    related_risks: ["operational-disruption", "talent-retention"],
  },
  {
    id: "technology-obsolescence",
    category: "technology",
    title: "Technology Platform Obsolescence",
    description:
      "Core technology stack becoming outdated, affecting competitiveness",
    current_rating: 6,
    impact_severity: 7,
    likelihood: 8,
    mitigation_status: "in_progress",
    mitigation_strategies: [
      {
        id: "platform-modernization",
        title: "Technology Platform Modernization",
        description: "Migrate to modern, scalable technology architecture",
        cost: 500000,
        timeframe: "18 months",
        effectiveness: 9,
        status: "in_progress",
        responsible_party: "CTO & Engineering",
        success_metrics: [
          "Modern tech stack deployment",
          "Improved performance metrics",
          "Enhanced scalability",
        ],
      },
    ],
    trend: "increasing",
    time_horizon: "short_term",
    last_updated: "2024-12-12",
    related_risks: ["competitive-position", "customer-satisfaction"],
  },
  {
    id: "regulatory-compliance",
    category: "regulatory",
    title: "Evolving Regulatory Requirements",
    description:
      "New data privacy and industry regulations affecting operations",
    current_rating: 5,
    impact_severity: 6,
    likelihood: 9,
    mitigation_status: "ongoing",
    mitigation_strategies: [
      {
        id: "compliance-program",
        title: "Comprehensive Compliance Program",
        description:
          "Implement robust compliance monitoring and reporting systems",
        cost: 300000,
        timeframe: "12 months",
        effectiveness: 8,
        status: "in_progress",
        responsible_party: "Legal & Compliance",
        success_metrics: [
          "Full regulatory compliance",
          "Audit readiness",
          "Risk mitigation protocols",
        ],
      },
    ],
    trend: "increasing",
    time_horizon: "immediate",
    last_updated: "2024-12-14",
    related_risks: ["operational-costs", "legal-liability"],
  },
];

interface RiskAssessmentProps {
  companyData?: any;
  onRiskUpdate?: (risk: RiskFactor) => void;
  className?: string;
}

export function RiskAssessment({
  companyData,
  onRiskUpdate,
  className = "",
}: RiskAssessmentProps) {
  const [risks, setRisks] = useState<RiskFactor[]>(SAMPLE_RISKS);
  const [assessmentData, setAssessmentData] =
    useState<RiskAssessmentData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<RiskFactor | null>(null);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<RiskFactor>>({
    category: "operational",
    current_rating: 5,
    impact_severity: 5,
    likelihood: 5,
    mitigation_status: "not_started",
    trend: "stable",
    time_horizon: "medium_term",
  });

  const { toast } = useToast();

  useEffect(() => {
    generateRiskAssessment();
  }, [risks]);

  const generateRiskAssessment = async () => {
    setIsGeneratingAssessment(true);

    try {
      // Simulate API call for AI-powered risk assessment
      setTimeout(() => {
        const riskScores = risks.map((risk) => ({
          ...risk,
          risk_score:
            (risk.current_rating * risk.impact_severity * risk.likelihood) /
            100,
        }));

        const overallScore =
          riskScores.reduce((sum, risk) => sum + risk.risk_score, 0) /
          riskScores.length;

        const riskDistribution = risks.reduce(
          (acc, risk) => {
            acc[risk.category] =
              (acc[risk.category] || 0) + risk.current_rating;
            return acc;
          },
          {} as Record<string key={index}, number>,
        );

        const riskTrends = risks.reduce(
          (acc, risk) => {
            acc[risk.category] = risk.trend;
            return acc;
          },
          {} as Record<string, "increasing" | "stable" | "decreasing">,
        );

        const criticalRisks = risks.filter(
          (risk) =>
            (risk.current_rating * risk.impact_severity * risk.likelihood) /
              100 >
            6,
        );

        const mockAssessment: RiskAssessmentData = {
          overall_risk_score: overallScore,
          risk_distribution: riskDistribution,
          risk_trends: riskTrends,
          critical_risks: criticalRisks,
          recommendations: [
            {
              priority: "high",
              category: "financial",
              recommendation:
                "Immediately implement customer diversification strategy",
              rationale:
                "Customer concentration poses existential risk to business",
              estimated_impact: 8.5,
            },
            {
              priority: "high",
              category: "operational",
              recommendation:
                "Begin knowledge transfer and succession planning",
              rationale:
                "Key person dependency creates significant operational risk",
              estimated_impact: 7.8,
            },
            {
              priority: "medium",
              category: "technology",
              recommendation: "Accelerate technology modernization timeline",
              rationale:
                "Technology obsolescence threatens competitive position",
              estimated_impact: 6.9,
            },
          ],
        };

        setAssessmentData(mockAssessment);
        setIsGeneratingAssessment(false);
      }, 2000);
    } catch (error) {
      console.error("Risk assessment generation failed:", error);
      toast({
        title: "Assessment generation failed",
        description: "Using cached risk analysis data",
        variant: "destructive",
      });
      setIsGeneratingAssessment(false);
    }
  };

  const filteredRisks =
    selectedCategory === "all"
      ? risks
      : risks.filter((risk) => risk.category === selectedCategory);

  const getRiskColor = (rating: number) => {
    if (rating >= 8) return "text-red-600 bg-red-50";
    if (rating >= 6) return "text-yellow-600 bg-yellow-50";
    if (rating >= 4) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getRiskIcon = (rating: number) => {
    if (rating >= 8) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (rating >= 6)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <Shield className="h-4 w-4 text-green-600" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getMitigationStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateRiskScore = (risk: RiskFactor) => {
    return (risk.current_rating * risk.impact_severity * risk.likelihood) / 100;
  };

  const addNewRisk = () => {
    if (!newRisk.title || !newRisk.description) {
      toast({
        title: "Incomplete risk data",
        description: "Please fill in title and description",
        variant: "destructive",
      });
      return;
    }

    const risk: RiskFactor = {
      id: `custom-${Date.now()}`,
      category: newRisk.category as any,
      title: newRisk.title,
      description: newRisk.description,
      current_rating: newRisk.current_rating || 5,
      impact_severity: newRisk.impact_severity || 5,
      likelihood: newRisk.likelihood || 5,
      mitigation_status: newRisk.mitigation_status as any,
      mitigation_strategies: [],
      trend: newRisk.trend as any,
      time_horizon: newRisk.time_horizon as any,
      last_updated: new Date().toISOString(),
      related_risks: [],
    };

    setRisks((prev) => [...prev, risk]);
    setShowAddRisk(false);
    setNewRisk({
      category: "operational",
      current_rating: 5,
      impact_severity: 5,
      likelihood: 5,
      mitigation_status: "not_started",
      trend: "stable",
      time_horizon: "medium_term",
    });

    toast({
      title: "Risk added successfully",
      description: "New risk factor has been added to the assessment",
    });
  };

  const exportAssessment = () => {
    if (!assessmentData) return;

    const report = {
      generated_date: new Date().toISOString(),
      assessment: assessmentData,
      detailed_risks: risks,
      company_data: companyData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk-assessment-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold">Risk Assessment</h2>
            <p className="text-muted-foreground">
              AI-powered analysis of business risks and mitigation strategies
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAssessment}
            disabled={!assessmentData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddRisk(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRiskAssessment}
            disabled={isGeneratingAssessment}
          >
            {isGeneratingAssessment ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Risk Assessment Summary */}
      {assessmentData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Overall Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {assessmentData.overall_risk_score.toFixed(1)}
              </div>
              <Progress
                value={assessmentData.overall_risk_score * 10}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Critical Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {assessmentData.critical_risks.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Require immediate attention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mitigation Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(
                  (risks.filter((r) => r.mitigation_status !== "not_started")
                    .length /
                    risks.length) *
                    100,
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Risks being addressed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Trending Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {risks.filter((r) => r.trend === "increasing").length}
              </div>
              <div className="text-sm text-muted-foreground">
                Increasing risk factors
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="secondary">{filteredRisks.length} risks</Badge>
          </div>

          {/* Risk Cards */}
          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <Card key={risk.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getRiskIcon(risk.current_rating)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{risk.title}</h3>
                          <Badge variant="outline" className="capitalize">
                            {risk.category}
                          </Badge>
                          <Badge
                            className={getMitigationStatusColor(
                              risk.mitigation_status,
                            )}
                          >
                            {risk.mitigation_status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {risk.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getTrendIcon(risk.trend)}
                      <Badge
                        variant="outline"
                        className={`${getRiskColor(risk.current_rating)} font-semibold`}
                      >
                        {risk.current_rating}/10
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Risk Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Impact
                      </div>
                      <Progress
                        value={risk.impact_severity * 10}
                        className="h-2 mt-1"
                      />
                      <div className="text-xs mt-1">
                        {risk.impact_severity}/10
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Likelihood
                      </div>
                      <Progress
                        value={risk.likelihood * 10}
                        className="h-2 mt-1"
                      />
                      <div className="text-xs mt-1">{risk.likelihood}/10</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Risk Score
                      </div>
                      <Progress
                        value={calculateRiskScore(risk) * 10}
                        className="h-2 mt-1"
                      />
                      <div className="text-xs mt-1">
                        {calculateRiskScore(risk).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Mitigation Strategies Preview */}
                  {risk.mitigation_strategies.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Mitigation Strategies (
                        {risk.mitigation_strategies.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {risk.mitigation_strategies
                          .slice(0, 2)
                          .map((strategy, index) => (
                            <Badge key={index}
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {strategy.title}
                            </Badge>
                          ))}
                        {risk.mitigation_strategies.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{risk.mitigation_strategies.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>
                        Updated:{" "}
                        {new Date(risk.last_updated).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {risk.time_horizon.replace("_", " ")}
                      </span>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRisk(risk)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentData?.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        rec.priority === "high"
                          ? "destructive"
                          : rec.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {rec.priority} priority
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Impact: {rec.estimated_impact}/10
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">
                    {rec.recommendation}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {rec.rationale}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentData &&
                Object.entries(assessmentData.risk_distribution).map(
                  ([category, score]) => (
                    <div key={score]} key={category} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{category}</span>
                        <span>{score.toFixed(1)}</span>
                      </div>
                      <Progress value={(score / 10) * 100} className="h-2" />
                    </div>
                  ),
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <Dialog
          open={!!selectedRisk}
          onOpenChange={() => setSelectedRisk(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getRiskIcon(selectedRisk.current_rating)}
                <span>{selectedRisk.title}</span>
                <Badge variant="outline" className="capitalize">
                  {selectedRisk.category}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {selectedRisk.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedRisk.current_rating}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Rating
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedRisk.impact_severity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Impact Severity
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedRisk.likelihood}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Likelihood
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {calculateRiskScore(selectedRisk).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Risk Score
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="mitigation" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="mitigation">
                      Mitigation Strategies
                    </TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="related">Related Risks</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mitigation" className="space-y-4">
                    {selectedRisk.mitigation_strategies.map(
                      (strategy, index) => (
                        <Card key={strategy.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {strategy.title}
                              </CardTitle>
                              <Badge
                                className={getMitigationStatusColor(
                                  strategy.status,
                                )}
                              >
                                {strategy.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {strategy.description}
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm font-medium">Cost</div>
                                <div className="text-lg">
                                  ${strategy.cost.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  Timeframe
                                </div>
                                <div className="text-lg">
                                  {strategy.timeframe}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  Effectiveness
                                </div>
                                <div className="text-lg">
                                  {strategy.effectiveness}/10
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-2">
                                Success Metrics
                              </div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {strategy.success_metrics.map((metric, idx) => (
                                  <li key={idx} key={idx}>• {metric}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="text-sm">
                              <strong>Responsible:</strong>{" "}
                              {strategy.responsible_party}
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </TabsContent>

                  <TabsContent value="analysis">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium">
                              Risk Trend
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {getTrendIcon(selectedRisk.trend)}
                              <span className="capitalize">
                                {selectedRisk.trend}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Time Horizon
                            </div>
                            <div className="mt-1 capitalize">
                              {selectedRisk.time_horizon.replace("_", " ")}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">
                            Last Updated
                          </div>
                          <div>
                            {new Date(
                              selectedRisk.last_updated,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="related">
                    <Card>
                      <CardContent className="pt-6">
                        {selectedRisk.related_risks.length > 0 ? (
                          <div className="space-y-2">
                            {selectedRisk.related_risks.map(
                              (relatedId, index) => (
                                <div key={index}
                                  key={index}
                                  className="p-3 bg-muted rounded-lg"
                                >
                                  <div className="font-medium">
                                    {relatedId
                                      .replace("-", " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Related risk factor
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            No related risks identified
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Risk Modal */}
      <Dialog open={showAddRisk} onOpenChange={setShowAddRisk}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Risk Factor</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="risk-title">Risk Title</Label>
                <Input
                  id="risk-title"
                  value={newRisk.title || ""}
                  onChange={(e) =>
                    setNewRisk((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter risk title"
                />
              </div>
              <div>
                <Label htmlFor="risk-category">Category</Label>
                <Select
                  value={newRisk.category}
                  onValueChange={(value) =>
                    setNewRisk((prev) => ({ ...prev, category: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="risk-description">Description</Label>
              <Textarea
                id="risk-description"
                value={newRisk.description || ""}
                onChange={(e) =>
                  setNewRisk((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the risk factor in detail"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Current Rating: {newRisk.current_rating}</Label>
                <Slider
                  value={[newRisk.current_rating || 5]}
                  onValueChange={([value]) =>
                    setNewRisk((prev) => ({ ...prev, current_rating: value }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Impact Severity: {newRisk.impact_severity}</Label>
                <Slider
                  value={[newRisk.impact_severity || 5]}
                  onValueChange={([value]) =>
                    setNewRisk((prev) => ({ ...prev, impact_severity: value }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Likelihood: {newRisk.likelihood}</Label>
                <Slider
                  value={[newRisk.likelihood || 5]}
                  onValueChange={([value]) =>
                    setNewRisk((prev) => ({ ...prev, likelihood: value }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={addNewRisk} className="flex-1">
                Add Risk Factor
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddRisk(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
