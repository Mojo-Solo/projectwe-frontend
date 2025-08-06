"use client";

import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExitPlanningRecommendationEngine } from "@/lib/exit-planning/recommendations";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  Brain,
  GraduationCap,
  Zap,
  Users,
  ArrowRight,
  Target,
  BarChart,
} from "lucide-react";

interface RecommendationsPanelProps {
  businessMetrics?: {
    revenue: number;
    ebitda: number;
    industry: string;
    yearsInBusiness: number;
    employeeCount: number;
    readinessScores: {
      financial: number;
      operations: number;
      legal: number;
      market: number;
      management: number;
      strategic: number;
    };
  };
}

export function RecommendationsPanel({
  businessMetrics = {
    revenue: 5000000,
    ebitda: 750000,
    industry: "technology",
    yearsInBusiness: 8,
    employeeCount: 35,
    readinessScores: {
      financial: 65,
      operations: 72,
      legal: 58,
      market: 88,
      management: 61,
      strategic: 78,
    },
  },
}: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [improvementPlan, setImprovementPlan] = useState<any[]>([]);
  const [valueEnhancement, setValueEnhancement] = useState<any>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    string | null
  >(null);

  useEffect(() => {
    const engine = new ExitPlanningRecommendationEngine();

    // Generate recommendations
    const recs = engine.generateRecommendations(businessMetrics);
    setRecommendations(recs);

    // Generate improvement plan
    const plan = engine.calculateReadinessImprovementPlan(
      businessMetrics.readinessScores,
    );
    setImprovementPlan(plan);

    // Calculate value enhancement
    const improvements = plan.map((p) => ({
      dimension: p.dimension,
      targetScore: p.targetScore,
    }));
    const enhancement = engine.estimateValueEnhancement(
      businessMetrics,
      improvements,
    );
    setValueEnhancement(enhancement);
  }, [businessMetrics]);

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case "coach":
        return <Brain key={index} className="h-4 w-4" />;
      case "learn":
        return <GraduationCap className="h-4 w-4" />;
      case "execute":
        return <Zap className="h-4 w-4" />;
      case "collaborate":
        return <Users className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Value Enhancement Summary */}
      {valueEnhancement && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Value Enhancement Opportunity
            </CardTitle>
            <CardDescription>
              Potential value increase by implementing all recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">
                  ${(valueEnhancement.currentValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(valueEnhancement.potentialValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Value Increase</p>
                <p className="text-2xl font-bold text-blue-600">
                  +${(valueEnhancement.valueIncrease / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage Gain</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{valueEnhancement.percentageIncrease.toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            Recommendations ({recommendations.length})
          </TabsTrigger>
          <TabsTrigger value="improvement-plan">Improvement Plan</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className={`cursor-pointer transition-all ${
                    selectedRecommendation === rec.id
                      ? "border-blue-500 shadow-lg"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedRecommendation(
                      selectedRecommendation === rec.id ? null : rec.id,
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getPillarIcon(rec.pillar)}
                          {rec.title}
                        </CardTitle>
                        <CardDescription>{rec.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {selectedRecommendation === rec.id && (
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Impact</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {rec.impact}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Timeframe</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {rec.timeframe}
                          </p>
                        </div>
                      </div>

                      {rec.estimatedValue && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Estimated Value Impact
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            +${(rec.estimatedValue / 1000000).toFixed(2)}M
                          </p>
                        </div>
                      )}

                      <Button className="w-full">
                        Start Implementation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="improvement-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Readiness Improvement Roadmap</CardTitle>
              <CardDescription>
                Systematic plan to improve all readiness dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {improvementPlan.map((item, index) => (
                  <div key={item.dimension} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">
                        {item.dimension}
                      </h4>
                      <Badge variant="outline">{item.timeframe}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>
                          {item.currentScore}% → {item.targetScore}%
                        </span>
                      </div>
                      <Progress
                        value={(item.currentScore / item.targetScore) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-1 pl-4">
                      {item.actions.map(
                        (action: string, actionIndex: number) => (
                          <div
                            key={actionIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-muted-foreground">
                              {action}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {index < improvementPlan.length - 1 && (
                      <div className="border-b pt-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>90-Day Quick Wins</CardTitle>
              <CardDescription>
                High-impact actions you can implement immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations
                  .filter(
                    (rec) =>
                      rec.priority === "high" &&
                      (rec.timeframe.includes("month") ||
                        rec.timeframe === "Immediate"),
                  )
                  .slice(0, 5)
                  .map((rec, index) => (
                    <div
                      key={rec.id}
                      className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rec.impact}
                        </p>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.timeframe}
                          </Badge>
                          {rec.estimatedValue && (
                            <Badge variant="outline" className="gap-1">
                              <DollarSign className="h-3 w-3" />
                              +${(rec.estimatedValue / 1000000).toFixed(1)}M
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
