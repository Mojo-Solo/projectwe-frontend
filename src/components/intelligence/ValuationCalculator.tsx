"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ValuationInputs {
  revenue: number;
  ebitda: number;
  industry: string;
  growth_rate: number;
  market_conditions: "excellent" | "good" | "fair" | "poor";
  company_size: "small" | "medium" | "large";
  profitability_trend: "increasing" | "stable" | "decreasing";
  customer_concentration: number;
  recurring_revenue: number;
  debt_to_equity: number;
  working_capital: number;
}

interface ValuationResult {
  base_valuation: number;
  adjusted_valuation: number;
  valuation_range: {
    low: number;
    mid: number;
    high: number;
  };
  confidence_score: number;
  key_metrics: {
    revenue_multiple: number;
    ebitda_multiple: number;
    growth_adjusted_multiple: number;
  };
  risk_factors: Array<{
    factor: string;
    impact: "positive" | "negative" | "neutral";
    magnitude: number;
    description: string;
  }>;
  market_comparables: Array<{
    company: string;
    multiple: number;
    similarity_score: number;
  }>;
  predictions: {
    twelve_month_outlook: "positive" | "stable" | "negative";
    growth_trajectory: number;
    market_position: string;
  };
}

interface ValuationScenario {
  name: string;
  adjustments: Partial<ValuationInputs>;
  description: string;
}

const DEFAULT_INPUTS: ValuationInputs = {
  revenue: 5000000,
  ebitda: 1250000,
  industry: "technology",
  growth_rate: 15,
  market_conditions: "good",
  company_size: "medium",
  profitability_trend: "increasing",
  customer_concentration: 25,
  recurring_revenue: 60,
  debt_to_equity: 0.3,
  working_capital: 500000,
};

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology", multiple_range: "3-8x" },
  { value: "healthcare", label: "Healthcare", multiple_range: "2-6x" },
  { value: "manufacturing", label: "Manufacturing", multiple_range: "1-4x" },
  { value: "retail", label: "Retail", multiple_range: "0.5-2x" },
  { value: "services", label: "Professional Services", multiple_range: "1-3x" },
  { value: "finance", label: "Financial Services", multiple_range: "2-5x" },
  { value: "real_estate", label: "Real Estate", multiple_range: "1-3x" },
  { value: "energy", label: "Energy", multiple_range: "2-6x" },
];

const VALUATION_SCENARIOS: ValuationScenario[] = [
  {
    name: "Optimistic",
    description: "Best-case market conditions and performance",
    adjustments: {
      growth_rate: 25,
      market_conditions: "excellent",
      profitability_trend: "increasing",
      customer_concentration: 15,
      recurring_revenue: 80,
    },
  },
  {
    name: "Conservative",
    description: "Cautious outlook with market headwinds",
    adjustments: {
      growth_rate: 5,
      market_conditions: "fair",
      profitability_trend: "stable",
      customer_concentration: 40,
      recurring_revenue: 40,
    },
  },
  {
    name: "Distressed",
    description: "Economic downturn scenario",
    adjustments: {
      growth_rate: -5,
      market_conditions: "poor",
      profitability_trend: "decreasing",
      customer_concentration: 50,
      recurring_revenue: 20,
    },
  },
];

export function ValuationCalculator() {
  const [inputs, setInputs] = useState<ValuationInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string>("current");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<
    Array<{
      timestamp: Date;
      inputs: ValuationInputs;
      result: ValuationResult;
    }>
  >([]);

  const { toast } = useToast();

  const calculateValuation = useCallback(
    async (inputData: ValuationInputs) => {
      setIsCalculating(true);

      try {
        // Simulate API call to ML service
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ML_API_URL}/api/v1/intelligence/valuation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key":
                process.env.NEXT_PUBLIC_ML_API_KEY || "dev-api-key-2025",
            },
            body: JSON.stringify({
              inputs: inputData,
              include_predictions: true,
              include_comparables: true,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Valuation calculation failed");
        }

        const calculationResult: ValuationResult = await response.json();

        // Mock calculation for demo purposes if API is not available
        if (!calculationResult || Object.keys(calculationResult).length === 0) {
          const mockResult = generateMockValuation(inputData);
          setResult(mockResult);

          // Add to history
          setCalculationHistory((prev) => [
            {
              timestamp: new Date(),
              inputs: inputData,
              result: mockResult,
            },
            ...prev.slice(0, 9),
          ]);
        } else {
          setResult(calculationResult);
          setCalculationHistory((prev) => [
            {
              timestamp: new Date(),
              inputs: inputData,
              result: calculationResult,
            },
            ...prev.slice(0, 9),
          ]);
        }

        toast({
          title: "Valuation calculated",
          description: "AI-powered valuation analysis complete",
        });
      } catch (error) {
        console.error("Valuation calculation error:", error);

        // Fallback to mock calculation
        const mockResult = generateMockValuation(inputData);
        setResult(mockResult);

        toast({
          title: "Using offline calculation",
          description: "Connected to ML service failed, using local model",
          variant: "destructive",
        });
      } finally {
        setIsCalculating(false);
      }
    },
    [toast],
  );

  const generateMockValuation = (inputs: ValuationInputs): ValuationResult => {
    // Mock calculation logic
    const industryMultiples = {
      technology: 5.5,
      healthcare: 4.0,
      manufacturing: 2.5,
      retail: 1.2,
      services: 2.0,
      finance: 3.5,
      real_estate: 2.0,
      energy: 4.0,
    };

    const baseMultiple =
      industryMultiples[inputs.industry as keyof typeof industryMultiples] ||
      3.0;
    const growthAdjustment = 1 + (inputs.growth_rate / 100) * 0.5;
    const marketAdjustment = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6,
    }[inputs.market_conditions];

    const adjustedMultiple = baseMultiple * growthAdjustment * marketAdjustment;
    const baseValuation = inputs.ebitda * adjustedMultiple;

    const riskAdjustment = 1 - (inputs.customer_concentration / 100) * 0.3;
    const recurringRevenueBonus = 1 + (inputs.recurring_revenue / 100) * 0.2;

    const adjustedValuation =
      baseValuation * riskAdjustment * recurringRevenueBonus;

    return {
      base_valuation: baseValuation,
      adjusted_valuation: adjustedValuation,
      valuation_range: {
        low: adjustedValuation * 0.8,
        mid: adjustedValuation,
        high: adjustedValuation * 1.3,
      },
      confidence_score: Math.min(
        95,
        60 +
          (inputs.recurring_revenue / 100) * 20 +
          (100 - inputs.customer_concentration) * 0.3,
      ),
      key_metrics: {
        revenue_multiple: adjustedValuation / inputs.revenue,
        ebitda_multiple: adjustedMultiple,
        growth_adjusted_multiple: adjustedMultiple,
      },
      risk_factors: [
        {
          factor: "Customer Concentration",
          impact: inputs.customer_concentration > 30 ? "negative" : "positive",
          magnitude: Math.abs(30 - inputs.customer_concentration) / 10,
          description: `Top customers represent ${inputs.customer_concentration}% of revenue`,
        },
        {
          factor: "Revenue Predictability",
          impact: inputs.recurring_revenue > 50 ? "positive" : "negative",
          magnitude: Math.abs(50 - inputs.recurring_revenue) / 10,
          description: `${inputs.recurring_revenue}% of revenue is recurring`,
        },
        {
          factor: "Growth Trajectory",
          impact: inputs.growth_rate > 10 ? "positive" : "negative",
          magnitude: Math.abs(inputs.growth_rate) / 5,
          description: `${inputs.growth_rate}% annual growth rate`,
        },
      ],
      market_comparables: [
        {
          company: "Industry Leader A",
          multiple: adjustedMultiple * 1.2,
          similarity_score: 85,
        },
        {
          company: "Similar Company B",
          multiple: adjustedMultiple * 0.9,
          similarity_score: 92,
        },
        {
          company: "Competitor C",
          multiple: adjustedMultiple * 1.1,
          similarity_score: 78,
        },
      ],
      predictions: {
        twelve_month_outlook:
          inputs.growth_rate > 10
            ? "positive"
            : inputs.growth_rate > 0
              ? "stable"
              : "negative",
        growth_trajectory: inputs.growth_rate,
        market_position:
          inputs.growth_rate > 15
            ? "Market Leader"
            : inputs.growth_rate > 5
              ? "Strong Position"
              : "Stable Position",
      },
    };
  };

  const applyScenario = (scenarioName: string) => {
    if (scenarioName === "current") {
      setActiveScenario("current");
      return;
    }

    const scenario = VALUATION_SCENARIOS.find(
      (s) => s.name.toLowerCase() === scenarioName,
    );
    if (scenario) {
      const scenarioInputs = { ...inputs, ...scenario.adjustments };
      setInputs(scenarioInputs);
      setActiveScenario(scenarioName);
      calculateValuation(scenarioInputs);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMultiple = (multiple: number) => {
    return `${multiple.toFixed(1)}x`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-blue-600 bg-blue-50";
    if (confidence >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateValuation(inputs);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputs, calculateValuation]);

  const exportReport = () => {
    if (!result) return;

    const report = {
      calculation_date: new Date().toISOString(),
      inputs,
      valuation_result: result,
      scenario: activeScenario,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `valuation-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">AI Valuation Calculator</h2>
              <p className="text-muted-foreground">
                ML-powered business valuation with predictive analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportReport}
              disabled={!result}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateValuation(inputs)}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Recalculate
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Company Inputs</span>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="advanced-toggle" className="text-sm">
                      Advanced
                    </Label>
                    <Switch
                      id="advanced-toggle"
                      checked={showAdvanced}
                      onCheckedChange={setShowAdvanced}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Inputs */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={inputs.revenue}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          revenue: Number(e.target.value),
                        }))
                      }
                      placeholder="5000000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(inputs.revenue)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ebitda">EBITDA</Label>
                    <Input
                      id="ebitda"
                      type="number"
                      value={inputs.ebitda}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          ebitda: Number(e.target.value),
                        }))
                      }
                      placeholder="1250000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(inputs.ebitda)} (
                      {((inputs.ebitda / inputs.revenue) * 100).toFixed(1)}%
                      margin)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={inputs.industry}
                      onValueChange={(value) =>
                        setInputs((prev) => ({ ...prev, industry: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <SelectItem key={index}
                            key={industry.value}
                            value={industry.value}
                          >
                            <div className="flex justify-between w-full">
                              <span>{industry.label}</span>
                              <Badge variant="secondary" className="ml-2">
                                {industry.multiple_range}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="growth-rate">Growth Rate (%)</Label>
                    <Slider
                      id="growth-rate"
                      min={-20}
                      max={50}
                      step={1}
                      value={[inputs.growth_rate]}
                      onValueChange={([value]) =>
                        setInputs((prev) => ({ ...prev, growth_rate: value }))
                      }
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {inputs.growth_rate}% annual growth
                    </p>
                  </div>
                </div>

                {/* Advanced Inputs */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="market-conditions">
                        Market Conditions
                      </Label>
                      <Select
                        value={inputs.market_conditions}
                        onValueChange={(value) =>
                          setInputs((prev) => ({
                            ...prev,
                            market_conditions: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="customer-concentration">
                        Customer Concentration (%)
                      </Label>
                      <Slider
                        id="customer-concentration"
                        min={0}
                        max={100}
                        step={5}
                        value={[inputs.customer_concentration]}
                        onValueChange={([value]) =>
                          setInputs((prev) => ({
                            ...prev,
                            customer_concentration: value,
                          }))
                        }
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Top customers: {inputs.customer_concentration}%
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="recurring-revenue">
                        Recurring Revenue (%)
                      </Label>
                      <Slider
                        id="recurring-revenue"
                        min={0}
                        max={100}
                        step={5}
                        value={[inputs.recurring_revenue]}
                        onValueChange={([value]) =>
                          setInputs((prev) => ({
                            ...prev,
                            recurring_revenue: value,
                          }))
                        }
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recurring: {inputs.recurring_revenue}%
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={
                      activeScenario === "current" ? "default" : "outline"
                    }
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => applyScenario("current")}
                  >
                    Current Inputs
                  </Button>
                  {VALUATION_SCENARIOS.map((scenario) => (
                    <Tooltip key={scenario.name}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            activeScenario === scenario.name.toLowerCase()
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() =>
                            applyScenario(scenario.name.toLowerCase())
                          }
                        >
                          {scenario.name}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{scenario.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {result ? (
              <>
                {/* Valuation Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Valuation Summary</span>
                      <Badge
                        variant="outline"
                        className={getConfidenceColor(result.confidence_score)}
                      >
                        {Math.round(result.confidence_score)}% Confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(result.valuation_range.low)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Conservative
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {formatCurrency(result.valuation_range.mid)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Most Likely
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(result.valuation_range.high)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Optimistic
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Progress
                        value={
                          ((result.valuation_range.mid -
                            result.valuation_range.low) /
                            (result.valuation_range.high -
                              result.valuation_range.low)) *
                          100
                        }
                        className="h-3"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {formatCurrency(result.valuation_range.low)}
                        </span>
                        <span>
                          {formatCurrency(result.valuation_range.high)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="metrics" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                    <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                    <TabsTrigger value="comparables">Comparables</TabsTrigger>
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metrics">
                    <Card>
                      <CardHeader>
                        <CardTitle>Valuation Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">
                              {formatMultiple(
                                result.key_metrics.revenue_multiple,
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Revenue Multiple
                            </div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">
                              {formatMultiple(
                                result.key_metrics.ebitda_multiple,
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              EBITDA Multiple
                            </div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">
                              {formatMultiple(
                                result.key_metrics.growth_adjusted_multiple,
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Growth Adjusted
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks">
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {result.risk_factors.map((risk, index) => (
                            <div key={index}
                              key={index}
                              className="flex items-start space-x-3 p-4 bg-muted rounded-lg"
                            >
                              {getRiskImpactIcon(risk.impact)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{risk.factor}</h4>
                                  <Badge
                                    variant={
                                      risk.impact === "positive"
                                        ? "default"
                                        : risk.impact === "negative"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                  >
                                    {risk.impact}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {risk.description}
                                </p>
                                <Progress
                                  value={risk.magnitude * 10}
                                  className="mt-2 h-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comparables">
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Comparables</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.market_comparables.map((comp, index) => (
                            <div key={index}
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div>
                                <div className="font-medium">
                                  {comp.company}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {comp.similarity_score}% similarity
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">
                                  {formatMultiple(comp.multiple)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  EBITDA Multiple
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="predictions">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-lg font-bold capitalize">
                                {result.predictions.twelve_month_outlook}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                12-Month Outlook
                              </div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-lg font-bold">
                                {result.predictions.growth_trajectory > 0
                                  ? "+"
                                  : ""}
                                {result.predictions.growth_trajectory}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Growth Trajectory
                              </div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-lg font-bold">
                                {result.predictions.market_position}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Market Position
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">
                        Calculating Valuation
                      </h3>
                      <p className="text-muted-foreground">
                        AI is analyzing your inputs and market data...
                      </p>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">
                        Enter Company Details
                      </h3>
                      <p className="text-muted-foreground">
                        Fill in the company information to get an AI-powered
                        valuation
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
