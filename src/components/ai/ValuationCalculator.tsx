"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Bot,
  Calculator,
  Info,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AIApiService from "@/lib/ai-api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ValuationResult {
  method: string;
  value: number;
  confidence: number;
  factors: { name: string; impact: number; description: string }[];
}

interface ValuationCalculatorProps {
  onValuationComplete?: (results: ValuationResult[]) => void;
  initialData?: any;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function ValuationCalculator({
  onValuationComplete,
  initialData,
}: ValuationCalculatorProps) {
  const [financialData, setFinancialData] = useState({
    revenue: initialData?.revenue || "",
    ebitda: initialData?.ebitda || "",
    netProfit: initialData?.netProfit || "",
    assets: initialData?.assets || "",
    liabilities: initialData?.liabilities || "",
    growthRate: initialData?.growthRate || "",
    industry: initialData?.industry || "technology",
    yearsInBusiness: initialData?.yearsInBusiness || "",
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResults, setValuationResults] = useState<ValuationResult[]>(
    [],
  );
  const [aiInsights, setAiInsights] = useState<string>("");
  const [marketComparables, setMarketComparables] = useState<any[]>([]);

  const apiService = new AIApiService();

  const handleInputChange = (name: string, value: string) => {
    setFinancialData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateValuation = async () => {
    setIsCalculating(true);

    try {
      // Call AI valuation service
      const response = await apiService.calculateValuation(financialData);

      // Process results
      const results: ValuationResult[] = [
        {
          method: "Revenue Multiple",
          value: response.revenueMultiple.value,
          confidence: response.revenueMultiple.confidence,
          factors: response.revenueMultiple.factors,
        },
        {
          method: "EBITDA Multiple",
          value: response.ebitdaMultiple.value,
          confidence: response.ebitdaMultiple.confidence,
          factors: response.ebitdaMultiple.factors,
        },
        {
          method: "Discounted Cash Flow",
          value: response.dcf.value,
          confidence: response.dcf.confidence,
          factors: response.dcf.factors,
        },
        {
          method: "Asset-Based",
          value: response.assetBased.value,
          confidence: response.assetBased.confidence,
          factors: response.assetBased.factors,
        },
      ];

      setValuationResults(results);
      setAiInsights(response.insights);
      setMarketComparables(response.comparables || []);

      if (onValuationComplete) {
        onValuationComplete(results);
      }
    } catch (error) {
      console.error("Valuation calculation failed:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getAverageValuation = () => {
    if (valuationResults.length === 0) return 0;

    const weightedSum = valuationResults.reduce(
      (sum, result) => sum + result.value * result.confidence,
      0,
    );
    const totalConfidence = valuationResults.reduce(
      (sum, result) => sum + result.confidence,
      0,
    );

    return weightedSum / totalConfidence;
  };

  const getValuationRange = () => {
    if (valuationResults.length === 0) return { min: 0, max: 0 };

    const values = valuationResults.map((r) => r.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const exportResults = () => {
    const data = {
      financialData,
      valuationResults,
      averageValuation: getAverageValuation(),
      range: getValuationRange(),
      aiInsights,
      marketComparables,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `valuation-${Date.now()}.json`;
    a.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div key={index} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            AI-Powered Valuation Calculator
          </CardTitle>
          <CardDescription>
            Get an instant business valuation using multiple methods and AI
            analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Financial Data</TabsTrigger>
              <TabsTrigger
                value="results"
                disabled={valuationResults.length === 0}
              >
                Results
              </TabsTrigger>
              <TabsTrigger value="insights" disabled={!aiInsights}>
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenue">Annual Revenue</Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="1000000"
                    value={financialData.revenue}
                    onChange={(e) =>
                      handleInputChange("revenue", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ebitda">EBITDA</Label>
                  <Input
                    id="ebitda"
                    type="number"
                    placeholder="200000"
                    value={financialData.ebitda}
                    onChange={(e) =>
                      handleInputChange("ebitda", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="netProfit">Net Profit</Label>
                  <Input
                    id="netProfit"
                    type="number"
                    placeholder="150000"
                    value={financialData.netProfit}
                    onChange={(e) =>
                      handleInputChange("netProfit", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="growthRate">Annual Growth Rate (%)</Label>
                  <Input
                    id="growthRate"
                    type="number"
                    placeholder="15"
                    value={financialData.growthRate}
                    onChange={(e) =>
                      handleInputChange("growthRate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="assets">Total Assets</Label>
                  <Input
                    id="assets"
                    type="number"
                    placeholder="500000"
                    value={financialData.assets}
                    onChange={(e) =>
                      handleInputChange("assets", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="liabilities">Total Liabilities</Label>
                  <Input
                    id="liabilities"
                    type="number"
                    placeholder="200000"
                    value={financialData.liabilities}
                    onChange={(e) =>
                      handleInputChange("liabilities", e.target.value)
                    }
                  />
                </div>
              </div>

              <Button
                onClick={calculateValuation}
                disabled={
                  isCalculating ||
                  !financialData.revenue ||
                  !financialData.ebitda
                }
                className="w-full"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Calculate Valuation
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {valuationResults.length > 0 && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Average Valuation
                          </p>
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {formatCurrency(getAverageValuation())}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Valuation Range
                          </p>
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-semibold mt-2">
                          {formatCurrency(getValuationRange().min)} -{" "}
                          {formatCurrency(getValuationRange().max)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Confidence Score
                          </p>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2">
                          <Progress
                            value={
                              (valuationResults.reduce(
                                (sum, r) => sum + r.confidence,
                                0,
                              ) /
                                valuationResults.length) *
                              100
                            }
                            className="h-2"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.round(
                              (valuationResults.reduce(
                                (sum, r) => sum + r.confidence,
                                0,
                              ) /
                                valuationResults.length) *
                                100,
                            )}
                            %
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Valuation Methods Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={valuationResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="method" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {valuationResults.map((result, index) => (
                      <Card key={result.method}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{result.method}</h4>
                              <p className="text-2xl font-bold mt-1">
                                {formatCurrency(result.value)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">
                                  {Math.round(result.confidence * 100)}%
                                  confidence
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Key Factors
                              </p>
                              <div className="space-y-1 mt-2">
                                {result.factors.slice(0, 3).map((factor, i) => (
                                  <div key={i}
                                    key={i}
                                    className="flex items-center gap-1 text-sm"
                                  >
                                    {factor.impact > 0 ? (
                                      <ArrowUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <ArrowDown className="w-3 h-3 text-red-500" />
                                    )}
                                    <span className="text-muted-foreground">
                                      {factor.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={exportResults}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Valuation Report
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {aiInsights && (
                <Alert>
                  <Bot className="w-4 h-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">AI Analysis</p>
                      <div className="whitespace-pre-line">{aiInsights}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {marketComparables.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Market Comparables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {marketComparables.map((comp, index) => (
                        <div key={index}
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{comp.company}</p>
                            <p className="text-sm text-muted-foreground">
                              {comp.industry} • {comp.size}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{comp.multiple}x</p>
                            <p className="text-sm text-muted-foreground">
                              {comp.metric}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
