"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Target,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart3,
} from "lucide-react";

export function ExitPlanningAPIDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleBusinessData = {
    revenue: 5000000,
    profitMargin: 15,
    industry: "technology",
    growth: 25,
    assets: 1500000,
    auditedFinancials: true,
    recentAppraisal: false,
    industryComps: true,
    // For comprehensive analysis
    assessment: {
      financial: {
        cleanBooks: true,
        auditedStatements: true,
        profitGrowth: true,
        debtManagement: true,
        cashFlow: true,
        budgetProcess: true,
      },
      operations: {
        systemsDocumented: true,
        processStandardized: true,
        qualityControl: true,
        supplierRelations: true,
        customerBase: true,
      },
      management: {
        keyPersonRisk: false,
        teamDepth: true,
        succession: true,
        governance: true,
      },
      legal: {
        corporateStructure: true,
        contractsReviewed: true,
        ipProtected: true,
        complianceCurrent: true,
        litigation: false,
      },
      strategic: {
        marketPosition: true,
        competitiveAdvantage: true,
        growthStrategy: true,
        exitOptions: true,
      },
      market: {
        industryTrends: true,
        marketTiming: true,
        buyerActivity: true,
        valuationEnvironment: true,
      },
    },
    profile: {
      size: "medium",
      revenue: 5000000,
      industry: "technology",
      ownerGoals: "maximize-value",
      timeline: "12-months",
      readinessScore: 75,
    },
    risks: {
      industry: "technology",
      managementTeam: true,
      documentedProcesses: true,
      successionPlan: true,
      ownerInvolvement: "low",
      revenueConcentration: 0.2,
      profitMargin: 15,
      auditedFinancials: true,
      growthTrend: "growing",
      marketPosition: "strong",
      competitiveAdvantage: true,
      industryGrowth: "growing",
    },
    strategy: {
      readinessScore: 75,
    },
    region: "west",
  };

  const testComprehensiveAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/exit-planning/comprehensive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleBusinessData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setResults(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Exit Planning API Demo
          </CardTitle>
          <CardDescription>
            Test the comprehensive exit planning analysis with sample data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={testComprehensiveAnalysis}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              "Run Comprehensive Analysis"
            )}
          </Button>

          {error && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="mt-6 space-y-4">
              {/* Executive Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {results.summary.keyFindings.map(
                    (finding: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="text-sm">{finding}</span>
                      </div>
                    ),
                  )}

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {results.summary.timeline}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {results.summary.nextMeeting}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Valuation Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Business Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.valuation.estimatedValue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated Value
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {formatCurrency(results.valuation.range.low)} -{" "}
                        {formatCurrency(results.valuation.range.high)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Valuation Range
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {results.valuation.confidence}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Confidence
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress
                      value={results.valuation.confidence}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Methodology: {results.valuation.methodology}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Readiness Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Exit Readiness Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Overall Readiness</span>
                      <Badge
                        variant={
                          results.readiness.overallScore >= 80
                            ? "default"
                            : results.readiness.overallScore >= 60
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {results.readiness.readinessLevel}
                      </Badge>
                    </div>
                    <Progress
                      value={results.readiness.overallScore}
                      className="h-3"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {results.readiness.overallScore}% ready for exit
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(results.readiness.dimensions).map(
                      ([dimension, score]) => (
                        <div
                          key={dimension}
                          className="flex items-center justify-between"
                        >
                          <span className="capitalize">{dimension}:</span>
                          <span className="font-semibold">
                            {score as number}%
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge
                      variant={
                        results.risks.riskLevel === "Low"
                          ? "default"
                          : results.risks.riskLevel === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {results.risks.riskLevel} Risk
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Overall risk score: {results.risks.overallRisk.toFixed(1)}
                      %
                    </span>
                  </div>

                  <div className="space-y-2">
                    {results.risks.risks.map((risk: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{risk.category}</span>
                        <Badge
                          variant={
                            risk.level >= 70
                              ? "destructive"
                              : risk.level >= 50
                                ? "secondary"
                                : "default"
                          }
                        >
                          {risk.level}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.summary.priorityActions.map(
                      (action: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {index + 1}
                          </Badge>
                          <span>{action}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
