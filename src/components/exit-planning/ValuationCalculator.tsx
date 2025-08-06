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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  TrendingUp,
  Info,
  DollarSign,
  BarChart3,
  Target,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryMultiple {
  name: string;
  revenueMultiple: { min: number; max: number; avg: number };
  ebitdaMultiple: { min: number; max: number; avg: number };
  description: string;
}

interface ValuationResult {
  revenueValuation: {
    low: number;
    high: number;
    average: number;
  };
  ebitdaValuation: {
    low: number;
    high: number;
    average: number;
  };
  recommendedRange: {
    low: number;
    high: number;
  };
  confidence: number;
  methodology: string;
}

interface ValuationCalculatorProps {
  onValuationComplete?: (result: ValuationResult) => void;
  className?: string;
}

const INDUSTRY_MULTIPLES: Record<string, IndustryMultiple> = {
  technology: {
    name: "Technology/SaaS",
    revenueMultiple: { min: 3.0, max: 8.0, avg: 5.5 },
    ebitdaMultiple: { min: 12.0, max: 25.0, avg: 18.0 },
    description: "Software, SaaS, and technology services",
  },
  healthcare: {
    name: "Healthcare Services",
    revenueMultiple: { min: 1.5, max: 4.0, avg: 2.8 },
    ebitdaMultiple: { min: 8.0, max: 15.0, avg: 11.5 },
    description: "Medical practices, healthcare technology, services",
  },
  manufacturing: {
    name: "Manufacturing",
    revenueMultiple: { min: 0.8, max: 2.5, avg: 1.6 },
    ebitdaMultiple: { min: 5.0, max: 12.0, avg: 8.5 },
    description: "Traditional manufacturing and industrial businesses",
  },
  retail: {
    name: "Retail/E-commerce",
    revenueMultiple: { min: 0.5, max: 2.0, avg: 1.2 },
    ebitdaMultiple: { min: 6.0, max: 12.0, avg: 9.0 },
    description: "Retail stores, e-commerce, consumer goods",
  },
  services: {
    name: "Professional Services",
    revenueMultiple: { min: 1.0, max: 3.0, avg: 2.0 },
    ebitdaMultiple: { min: 4.0, max: 10.0, avg: 7.0 },
    description: "Consulting, accounting, legal, marketing services",
  },
  construction: {
    name: "Construction/Engineering",
    revenueMultiple: { min: 0.3, max: 1.5, avg: 0.9 },
    ebitdaMultiple: { min: 3.0, max: 8.0, avg: 5.5 },
    description: "Construction, engineering, real estate services",
  },
  foodservice: {
    name: "Food & Beverage",
    revenueMultiple: { min: 0.4, max: 1.8, avg: 1.1 },
    ebitdaMultiple: { min: 4.0, max: 9.0, avg: 6.5 },
    description: "Restaurants, food production, beverage companies",
  },
};

export function ValuationCalculator({
  onValuationComplete,
  className,
}: ValuationCalculatorProps) {
  const [formData, setFormData] = useState({
    annualRevenue: "",
    ebitda: "",
    industry: "",
    growthRate: "",
    profitMargin: "",
    recurringRevenue: "",
    businessAge: "",
  });

  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.annualRevenue || parseFloat(formData.annualRevenue) <= 0) {
      newErrors.annualRevenue =
        "Annual revenue is required and must be positive";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry selection is required";
    }

    if (formData.ebitda && parseFloat(formData.ebitda) < 0) {
      newErrors.ebitda = "EBITDA cannot be negative";
    }

    if (
      formData.growthRate &&
      (parseFloat(formData.growthRate) < -50 ||
        parseFloat(formData.growthRate) > 500)
    ) {
      newErrors.growthRate = "Growth rate should be between -50% and 500%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateValuation = (): ValuationResult => {
    const revenue = parseFloat(formData.annualRevenue);
    const ebitda = parseFloat(formData.ebitda) || revenue * 0.15; // Default 15% margin if not provided
    const industry = INDUSTRY_MULTIPLES[formData.industry];
    const growthRate = parseFloat(formData.growthRate) || 0;
    const recurringRevenue = parseFloat(formData.recurringRevenue) || 0;

    // Revenue-based valuation
    const revenueValuation = {
      low: revenue * industry.revenueMultiple.min,
      high: revenue * industry.revenueMultiple.max,
      average: revenue * industry.revenueMultiple.avg,
    };

    // EBITDA-based valuation
    const ebitdaValuation = {
      low: ebitda * industry.ebitdaMultiple.min,
      high: ebitda * industry.ebitdaMultiple.max,
      average: ebitda * industry.ebitdaMultiple.avg,
    };

    // Apply adjustments for growth, recurring revenue, etc.
    const growthAdjustment = 1 + (growthRate / 100) * 0.1; // 10% valuation increase per 100% growth
    const recurringAdjustment = 1 + (recurringRevenue / 100) * 0.2; // 20% premium for 100% recurring revenue

    const adjustmentFactor = growthAdjustment * recurringAdjustment;

    // Recommended range (blend of revenue and EBITDA methods)
    const blendedLow =
      ((revenueValuation.low + ebitdaValuation.low) / 2) * adjustmentFactor;
    const blendedHigh =
      ((revenueValuation.high + ebitdaValuation.high) / 2) * adjustmentFactor;

    // Calculate confidence based on data completeness
    let confidence = 0.6; // Base confidence
    if (formData.ebitda) confidence += 0.15;
    if (formData.growthRate) confidence += 0.1;
    if (formData.recurringRevenue) confidence += 0.1;
    if (formData.businessAge) confidence += 0.05;

    return {
      revenueValuation: {
        low: revenueValuation.low * adjustmentFactor,
        high: revenueValuation.high * adjustmentFactor,
        average: revenueValuation.average * adjustmentFactor,
      },
      ebitdaValuation: {
        low: ebitdaValuation.low * adjustmentFactor,
        high: ebitdaValuation.high * adjustmentFactor,
        average: ebitdaValuation.average * adjustmentFactor,
      },
      recommendedRange: {
        low: blendedLow,
        high: blendedHigh,
      },
      confidence: Math.min(confidence, 0.95),
      methodology: `${industry.name} industry multiples with growth and recurring revenue adjustments`,
    };
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    try {
      // Use the new API endpoint for enhanced valuation calculation
      const response = await fetch("/api/exit-planning/valuation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revenue: parseFloat(formData.revenue),
          profitMargin: parseFloat(formData.profitMargin || "0"),
          industry: formData.industry,
          growth: parseFloat(formData.growthRate || "0"),
          assets: parseFloat(formData.assets || "0"),
          auditedFinancials: formData.auditedFinancials === "yes",
          recentAppraisal: formData.recentAppraisal === "yes",
          industryComps: formData.industryComps === "yes",
        }),
      });

      if (response.ok) {
        const apiResult = await response.json();

        // Transform API result to match component interface
        const transformedResult: ValuationResult = {
          revenueValuation: {
            low: apiResult.data.range.low,
            high: apiResult.data.range.high,
            average: apiResult.data.estimatedValue,
          },
          ebitdaValuation: {
            low: apiResult.data.components.primaryValue * 0.8,
            high: apiResult.data.components.primaryValue * 1.2,
            average: apiResult.data.components.primaryValue,
          },
          recommendedRange: {
            low: apiResult.data.range.low,
            high: apiResult.data.range.high,
          },
          confidence: apiResult.data.confidence / 100,
          methodology: `${apiResult.data.methodology} with ${apiResult.data.multiplier.toFixed(1)}x multiplier`,
        };

        setValuation(transformedResult);

        if (onValuationComplete) {
          onValuationComplete(transformedResult);
        }
      } else {
        // Fallback to local calculation if API fails
        const result = calculateValuation();
        setValuation(result);

        if (onValuationComplete) {
          onValuationComplete(result);
        }
      }
    } catch (error) {
      console.error("Valuation API error:", error);
      // Fallback to local calculation
      const result = calculateValuation();
      setValuation(result);

      if (onValuationComplete) {
        onValuationComplete(result);
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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

  const selectedIndustry = formData.industry
    ? INDUSTRY_MULTIPLES[formData.industry]
    : null;

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Business Valuation Calculator
          </CardTitle>
          <CardDescription>
            Get an estimated valuation range using industry-standard multiples
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualRevenue">
                Annual Revenue <span className="text-red-500">*</span>
              </Label>
              <Input
                id="annualRevenue"
                type="number"
                placeholder="1000000"
                value={formData.annualRevenue}
                onChange={(e) =>
                  handleFieldChange("annualRevenue", e.target.value)
                }
                className={cn(errors.annualRevenue && "border-red-500")}
              />
              {errors.annualRevenue && (
                <p className="text-sm text-red-500">{errors.annualRevenue}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleFieldChange("industry", value)}
              >
                <SelectTrigger
                  className={cn(errors.industry && "border-red-500")}
                >
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INDUSTRY_MULTIPLES).map(([key, industry]) => (
                    <SelectItem key={key} value={key}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ebitda">EBITDA (optional)</Label>
              <Input
                id="ebitda"
                type="number"
                placeholder="150000"
                value={formData.ebitda}
                onChange={(e) => handleFieldChange("ebitda", e.target.value)}
                className={cn(errors.ebitda && "border-red-500")}
              />
              {errors.ebitda && (
                <p className="text-sm text-red-500">{errors.ebitda}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="growthRate">
                Annual Growth Rate % (optional)
              </Label>
              <Input
                id="growthRate"
                type="number"
                placeholder="15"
                value={formData.growthRate}
                onChange={(e) =>
                  handleFieldChange("growthRate", e.target.value)
                }
                className={cn(errors.growthRate && "border-red-500")}
              />
              {errors.growthRate && (
                <p className="text-sm text-red-500">{errors.growthRate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurringRevenue">
                Recurring Revenue % (optional)
              </Label>
              <Input
                id="recurringRevenue"
                type="number"
                placeholder="80"
                value={formData.recurringRevenue}
                onChange={(e) =>
                  handleFieldChange("recurringRevenue", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAge">Business Age (years)</Label>
              <Input
                id="businessAge"
                type="number"
                placeholder="5"
                value={formData.businessAge}
                onChange={(e) =>
                  handleFieldChange("businessAge", e.target.value)
                }
              />
            </div>
          </div>

          {/* Industry Information */}
          {selectedIndustry && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>{selectedIndustry.name}</strong>:{" "}
                {selectedIndustry.description}
                <br />
                Typical multiples: {selectedIndustry.revenueMultiple.min}x -{" "}
                {selectedIndustry.revenueMultiple.max}x revenue,
                {selectedIndustry.ebitdaMultiple.min}x -{" "}
                {selectedIndustry.ebitdaMultiple.max}x EBITDA
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Valuation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Valuation Results */}
      {valuation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Valuation Results
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>
                Based on {valuation.methodology}
              </CardDescription>
              <Badge variant="secondary">
                {Math.round(valuation.confidence * 100)}% Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recommended Range */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">
                  Recommended Valuation Range
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(valuation.recommendedRange.low)} -{" "}
                  {formatCurrency(valuation.recommendedRange.high)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Blended methodology
                </span>
              </div>
            </div>

            {/* Methodology Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    Revenue Multiple
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Low:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.revenueValuation.low)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.revenueValuation.average)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.revenueValuation.high)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    EBITDA Multiple
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Low:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.ebitdaValuation.low)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.ebitdaValuation.average)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High:</span>
                      <span className="font-semibold">
                        {formatCurrency(valuation.ebitdaValuation.high)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Confidence Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Confidence Level</Label>
                <span className="text-sm font-medium">
                  {Math.round(valuation.confidence * 100)}%
                </span>
              </div>
              <Progress value={valuation.confidence * 100} />
              <p className="text-xs text-muted-foreground">
                Confidence improves with more complete financial data. Consider
                adding EBITDA, growth rate, and other metrics for a more
                accurate valuation.
              </p>
            </div>

            {/* Disclaimers */}
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                <strong>Important:</strong> This is an estimate based on
                industry averages. Actual valuations depend on many factors
                including market conditions, company-specific risks, asset
                quality, and buyer motivations. Consult with a qualified
                business appraiser or investment banker for a formal valuation.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
