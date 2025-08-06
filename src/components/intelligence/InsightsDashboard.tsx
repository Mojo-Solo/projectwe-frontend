"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Target,
  Zap,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  id: string;
  type:
    | "why_insight"
    | "opportunity"
    | "risk"
    | "trend"
    | "action"
    | "benchmark";
  title: string;
  description: string;
  why_explanation: string;
  confidence_score: number;
  impact_level: "high" | "medium" | "low";
  category:
    | "financial"
    | "operational"
    | "strategic"
    | "market"
    | "competitive";
  timeframe: "immediate" | "short_term" | "medium_term" | "long_term";
  supporting_data: Array<{
    metric: string;
    value: string | number;
    benchmark?: string | number;
    trend?: "up" | "down" | "stable";
  }>;
  recommendations: string[];
  related_insights: string[];
  created_at: string;
  priority_score: number;
}

interface InsightAnalytics {
  total_insights: number;
  high_impact_insights: number;
  actionable_insights: number;
  average_confidence: number;
  category_distribution: Record<string, number>;
  trend_analysis: {
    positive_trends: number;
    negative_trends: number;
    neutral_trends: number;
  };
  why_insights_count: number;
}

const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: "customer-concentration-why",
    type: "why_insight",
    title: "Why Customer Concentration is Your Biggest Exit Risk",
    description:
      "Your top 3 customers represent 65% of revenue, creating significant valuation discount",
    why_explanation:
      "Acquirers view customer concentration as existential risk because: (1) Loss of major customer could devastate revenue, (2) Creates pricing power imbalance, (3) Reduces predictable cash flows, (4) Limits growth scalability. Industry data shows 20%+ valuation discount for companies with >50% customer concentration.",
    confidence_score: 92,
    impact_level: "high",
    category: "financial",
    timeframe: "immediate",
    supporting_data: [
      {
        metric: "Top 3 Customer Revenue %",
        value: 65,
        benchmark: 30,
        trend: "up",
      },
      { metric: "Customer Count", value: 47, benchmark: 150, trend: "stable" },
      { metric: "Revenue at Risk", value: "$3.2M", trend: "up" },
      { metric: "Valuation Discount", value: "25%", benchmark: "5%" },
    ],
    recommendations: [
      "Implement aggressive customer acquisition strategy targeting mid-market",
      "Diversify product offerings to reduce dependency on key accounts",
      "Negotiate longer-term contracts with existing major customers",
      "Set target of reducing top 3 customer concentration to <40% within 18 months",
    ],
    related_insights: ["revenue-predictability", "growth-constraints"],
    created_at: "2024-12-15T10:30:00Z",
    priority_score: 95,
  },
  {
    id: "recurring-revenue-opportunity",
    type: "opportunity",
    title: "Why Recurring Revenue is Your Valuation Multiplier",
    description:
      "Converting 30% more revenue to recurring model could increase valuation by $2.1M",
    why_explanation:
      "Recurring revenue fundamentally changes business valuation because: (1) Provides predictable cash flows that buyers value at premium multiples, (2) Reduces customer acquisition costs over time, (3) Creates switching costs that improve retention, (4) Demonstrates business model scalability. SaaS businesses with 80%+ recurring revenue trade at 2-3x higher multiples.",
    confidence_score: 87,
    impact_level: "high",
    category: "strategic",
    timeframe: "medium_term",
    supporting_data: [
      {
        metric: "Current Recurring Revenue %",
        value: 40,
        benchmark: 70,
        trend: "up",
      },
      { metric: "Potential Additional ARR", value: "$1.8M", trend: "up" },
      { metric: "Valuation Impact", value: "$2.1M", trend: "up" },
      { metric: "Target Multiple Increase", value: "1.5x", benchmark: "2.0x" },
    ],
    recommendations: [
      "Convert top services to subscription-based pricing",
      "Introduce annual payment discounts to lock in customers",
      "Develop SaaS platform for core service delivery",
      "Create tiered subscription plans with premium features",
    ],
    related_insights: ["customer-retention", "pricing-strategy"],
    created_at: "2024-12-14T15:45:00Z",
    priority_score: 88,
  },
  {
    id: "market-positioning-gap",
    type: "risk",
    title: "Why Your Market Position is Eroding Value",
    description:
      "Competitive positioning analysis reveals 15% market share loss over 18 months",
    why_explanation:
      "Market position directly impacts exit valuation because: (1) Market leaders command premium multiples, (2) Declining position signals structural challenges, (3) Reduces strategic value to acquirers, (4) Limits future growth potential. Companies losing market share typically see 10-20% valuation discounts as acquirers factor in competitive pressures.",
    confidence_score: 78,
    impact_level: "medium",
    category: "competitive",
    timeframe: "short_term",
    supporting_data: [
      {
        metric: "Market Share Change",
        value: "-15%",
        benchmark: "+5%",
        trend: "down",
      },
      {
        metric: "Competitive Win Rate",
        value: "45%",
        benchmark: "65%",
        trend: "down",
      },
      {
        metric: "Price Premium vs Competitors",
        value: "-8%",
        benchmark: "+10%",
        trend: "down",
      },
      {
        metric: "Brand Recognition Score",
        value: 6.2,
        benchmark: 7.8,
        trend: "stable",
      },
    ],
    recommendations: [
      "Conduct comprehensive competitive analysis",
      "Invest in product differentiation initiatives",
      "Enhance marketing and brand positioning",
      "Consider strategic partnerships to strengthen market position",
    ],
    related_insights: ["pricing-pressure", "innovation-gap"],
    created_at: "2024-12-13T09:20:00Z",
    priority_score: 72,
  },
  {
    id: "operational-efficiency-lever",
    type: "action",
    title: "Why Operational Efficiency is Your Quick Win",
    description:
      "Process optimization could improve EBITDA margins by 4-6% within 6 months",
    why_explanation:
      "Operational efficiency directly translates to higher exit valuations because: (1) Improved margins increase cash flow available to buyers, (2) Demonstrates management effectiveness, (3) Shows scalability potential, (4) Reduces operational risk. Each 1% EBITDA margin improvement typically adds 1.5-2x that percentage to enterprise value.",
    confidence_score: 85,
    impact_level: "high",
    category: "operational",
    timeframe: "short_term",
    supporting_data: [
      {
        metric: "Current EBITDA Margin",
        value: "18%",
        benchmark: "24%",
        trend: "stable",
      },
      {
        metric: "Process Automation Score",
        value: 35,
        benchmark: 65,
        trend: "up",
      },
      {
        metric: "Labor Efficiency Ratio",
        value: 1.2,
        benchmark: 1.6,
        trend: "stable",
      },
      { metric: "Potential Margin Improvement", value: "5%", trend: "up" },
    ],
    recommendations: [
      "Implement workflow automation for repetitive tasks",
      "Optimize resource allocation across departments",
      "Standardize processes and create SOPs",
      "Invest in employee training and development",
    ],
    related_insights: ["cost-structure", "scalability-analysis"],
    created_at: "2024-12-12T14:15:00Z",
    priority_score: 82,
  },
  {
    id: "growth-trajectory-analysis",
    type: "trend",
    title: "Why Your Growth Story Needs Restructuring",
    description:
      "Current growth rate of 12% falls short of industry median of 18% expected by buyers",
    why_explanation:
      "Growth trajectory is the primary driver of exit multiples because: (1) High-growth companies receive premium valuations, (2) Demonstrates market opportunity and execution capability, (3) Attracts strategic buyers seeking growth platforms, (4) Justifies higher risk-adjusted returns. Companies growing >20% annually typically trade at 2-4x higher multiples than slow-growth peers.",
    confidence_score: 89,
    impact_level: "high",
    category: "strategic",
    timeframe: "medium_term",
    supporting_data: [
      {
        metric: "Current Growth Rate",
        value: "12%",
        benchmark: "18%",
        trend: "down",
      },
      { metric: "Industry Median Growth", value: "18%", trend: "stable" },
      {
        metric: "Revenue CAGR (3yr)",
        value: "14%",
        benchmark: "22%",
        trend: "stable",
      },
      {
        metric: "Growth Rate Trend",
        value: "Declining",
        benchmark: "Accelerating",
      },
    ],
    recommendations: [
      "Develop growth acceleration plan with specific milestones",
      "Identify and invest in high-growth market segments",
      "Consider strategic acquisitions to boost growth rate",
      "Enhance sales and marketing capabilities",
    ],
    related_insights: ["market-expansion", "sales-effectiveness"],
    created_at: "2024-12-11T11:30:00Z",
    priority_score: 91,
  },
  {
    id: "technology-modernization-imperative",
    type: "why_insight",
    title: "Why Technology Debt is Killing Your Valuation",
    description:
      "Legacy technology stack creating 23% operational inefficiency and competitive disadvantage",
    why_explanation:
      "Technology infrastructure directly impacts exit valuation because: (1) Modern tech stacks are table stakes for premium valuations, (2) Legacy systems create integration challenges for acquirers, (3) Operational inefficiencies reduce profitability, (4) Limits ability to scale and innovate. Technology debt can reduce valuations by 15-30% as buyers discount for required technology investments.",
    confidence_score: 83,
    impact_level: "high",
    category: "operational",
    timeframe: "medium_term",
    supporting_data: [
      {
        metric: "Technology Age Score",
        value: 6.8,
        benchmark: 3.2,
        trend: "up",
      },
      {
        metric: "System Integration Level",
        value: "45%",
        benchmark: "85%",
        trend: "stable",
      },
      {
        metric: "Operational Efficiency Loss",
        value: "23%",
        benchmark: "5%",
        trend: "up",
      },
      {
        metric: "Modernization Investment Required",
        value: "$750K",
        trend: "up",
      },
    ],
    recommendations: [
      "Develop comprehensive technology modernization roadmap",
      "Prioritize customer-facing system upgrades first",
      "Implement API-first architecture for better integration",
      "Budget for ongoing technology maintenance and upgrades",
    ],
    related_insights: ["scalability-constraints", "competitive-disadvantage"],
    created_at: "2024-12-10T16:45:00Z",
    priority_score: 86,
  },
];

interface InsightsDashboardProps {
  companyData?: any;
  refreshInterval?: number;
  className?: string;
}

export function InsightsDashboard({
  companyData,
  refreshInterval = 300000, // 5 minutes
  className = "",
}: InsightsDashboardProps) {
  const [insights, setInsights] = useState<Insight[]>(SAMPLE_INSIGHTS);
  const [analytics, setAnalytics] = useState<InsightAnalytics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "priority" | "confidence" | "impact" | "recent"
  >("priority");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const { toast } = useToast();

  // Generate analytics from insights
  useEffect(() => {
    const analytics: InsightAnalytics = {
      total_insights: insights.length,
      high_impact_insights: insights.filter((i) => i.impact_level === "high")
        .length,
      actionable_insights: insights.filter(
        (i) => i.type === "action" || i.recommendations.length > 0,
      ).length,
      average_confidence:
        insights.reduce((sum, i) => sum + i.confidence_score, 0) /
        insights.length,
      category_distribution: insights.reduce(
        (acc, insight) => {
          acc[insight.category] = (acc[insight.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      trend_analysis: {
        positive_trends: insights.filter((i) =>
          i.supporting_data.some((d) => d.trend === "up"),
        ).length,
        negative_trends: insights.filter((i) =>
          i.supporting_data.some((d) => d.trend === "down"),
        ).length,
        neutral_trends: insights.filter((i) =>
          i.supporting_data.every((d) => d.trend === "stable"),
        ).length,
      },
      why_insights_count: insights.filter((i) => i.type === "why_insight")
        .length,
    };
    setAnalytics(analytics);
  }, [insights]);

  // Auto-refresh insights
  useEffect(() => {
    const interval = setInterval(() => {
      refreshInsights();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const refreshInsights = async () => {
    setIsRefreshing(true);

    try {
      // Simulate API call to ML service for new insights
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_URL}/api/v1/intelligence/insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key":
              process.env.NEXT_PUBLIC_ML_API_KEY || "dev-api-key-2025",
          },
          body: JSON.stringify({
            company_data: companyData,
            insight_types: [
              "why_insight",
              "opportunity",
              "risk",
              "trend",
              "action",
            ],
            include_recommendations: true,
          }),
        },
      );

      if (response.ok) {
        const newInsights = await response.json();
        setInsights(newInsights);
        toast({
          title: "Insights refreshed",
          description: `Found ${newInsights.length} new insights`,
        });
      }
    } catch (error) {
      console.error("Failed to refresh insights:", error);
      // Keep using cached insights
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter and sort insights
  const filteredInsights = insights
    .filter(
      (insight) =>
        selectedCategory === "all" || insight.category === selectedCategory,
    )
    .filter(
      (insight) => selectedType === "all" || insight.type === selectedType,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return b.priority_score - a.priority_score;
        case "confidence":
          return b.confidence_score - a.confidence_score;
        case "impact":
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact_level] - impactOrder[a.impact_level];
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "why_insight":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case "risk":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "action":
        return <Target className="h-5 w-5 text-green-600" />;
      default:
        return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 70) return "text-blue-600 bg-blue-50";
    if (confidence >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDataValue = (value: string | number) => {
    if (typeof value === "number") {
      if (value > 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value > 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      } else if (value < 1 && value > 0) {
        return `${(value * 100).toFixed(1)}%`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">WHY-Driven Insights</h2>
            <p className="text-muted-foreground">
              AI-powered analysis explaining the reasoning behind business
              intelligence
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshInsights}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Insights
        </Button>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {analytics.total_insights}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Insights
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.why_insights_count}
              </div>
              <div className="text-sm text-muted-foreground">WHY Insights</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {analytics.high_impact_insights}
              </div>
              <div className="text-sm text-muted-foreground">High Impact</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {analytics.actionable_insights}
              </div>
              <div className="text-sm text-muted-foreground">Actionable</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {Math.round(analytics.average_confidence)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Confidence
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">
                  {analytics.trend_analysis.positive_trends}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Positive Trends
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="strategic">Strategic</SelectItem>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="competitive">Competitive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="why_insight">WHY Insights</SelectItem>
            <SelectItem value="opportunity">Opportunities</SelectItem>
            <SelectItem value="risk">Risks</SelectItem>
            <SelectItem value="trend">Trends</SelectItem>
            <SelectItem value="action">Actions</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as any)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority Score</SelectItem>
            <SelectItem value="confidence">Confidence</SelectItem>
            <SelectItem value="impact">Impact Level</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary">{filteredInsights.length} insights</Badge>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {insight.title}
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {insight.type.replace("_", " ")}
                      </Badge>
                      <Badge className={getImpactColor(insight.impact_level)}>
                        {insight.impact_level} impact
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Badge
                    variant="outline"
                    className={`${getConfidenceColor(insight.confidence_score)} font-semibold`}
                  >
                    {Math.round(insight.confidence_score)}%
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    Priority: {insight.priority_score}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Supporting Data */}
              {insight.supporting_data.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {insight.supporting_data.slice(0, 4).map((data, index) => (
                    <div key={index}
                      key={index}
                      className="text-center p-3 bg-muted rounded-lg"
                    >
                      <div className="text-lg font-bold flex items-center justify-center space-x-1">
                        <span>{formatDataValue(data.value)}</span>
                        {data.trend &&
                          (data.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : data.trend === "down" ? (
                            <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-400 rounded-full" />
                          ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {data.metric}
                      </div>
                      {data.benchmark && (
                        <div className="text-xs text-muted-foreground">
                          vs {formatDataValue(data.benchmark)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* WHY Explanation - Featured for why_insight type */}
              {insight.type === "why_insight" && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Why This Matters:
                  </h4>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {expandedInsight === insight.id
                      ? insight.why_explanation
                      : `${insight.why_explanation.substring(0, 200)}...`}
                  </p>
                  {insight.why_explanation.length > 200 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-purple-600"
                      onClick={() =>
                        setExpandedInsight(
                          expandedInsight === insight.id ? null : insight.id,
                        )
                      }
                    >
                      {expandedInsight === insight.id
                        ? "Show less"
                        : "Read more"}
                    </Button>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {insight.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Recommendations:</h4>
                  <ul className="space-y-1">
                    {insight.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                    {insight.recommendations.length > 3 && (
                      <li className="text-sm text-muted-foreground">
                        • +{insight.recommendations.length - 3} more
                        recommendations
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="capitalize">{insight.category}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {insight.timeframe.replace("_", " ")}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>

                {insight.related_insights.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{insight.related_insights.length} related
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No insights found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your filters or refresh to get new insights
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedType("all");
                refreshInsights();
              }}
            >
              Reset Filters & Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Footer */}
      {analytics && filteredInsights.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span>
                    {
                      filteredInsights.filter((i) => i.type === "why_insight")
                        .length
                    }{" "}
                    WHY insights
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span>
                    {
                      filteredInsights.filter((i) => i.type === "opportunity")
                        .length
                    }{" "}
                    opportunities
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span>
                    {filteredInsights.filter((i) => i.type === "action").length}{" "}
                    actions
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
