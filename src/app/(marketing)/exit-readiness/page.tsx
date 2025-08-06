"use client";

import { useState, useEffect } from "react";
import { useABTest } from "@/lib/ab-testing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface BusinessData {
  // Company basics
  companyName: string;
  industry: string;
  companyAge: number;
  employeeCount: number;

  // Financial data
  annualRevenue: number;
  profitMargin: number;
  revenueGrowth: number;

  // Business model
  businessModel: string;
  primaryRevenueSources: string[];
  customerConcentration: string;

  // Operational data
  hasDocumentedProcesses: boolean;
  hasFinancialRecords: boolean;
  hasLegalCompliance: boolean;
  hasIntellectualProperty: boolean;

  // Strategic position
  marketPosition: string;
  competitiveAdvantage: string;
  reasonForExit: string;
  timeframe: string;
}

interface ReadinessScore {
  overallScore: number;
  financialScore: number;
  operationalScore: number;
  strategicScore: number;
  legalScore: number;
  recommendations: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    estimatedImpact: string;
  }>;
  estimatedValuation: {
    low: number;
    high: number;
    confidence: number;
  };
  timeToReadiness: number; // months
}

export default function ExitReadinessPage() {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState<Partial<BusinessData>>({});
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // A/B Test for form layout
  const formTest = useABTest("exit-readiness-form-v1", undefined, sessionId, {
    page: "exit-readiness",
  });

  // A/B Test for ML model
  const modelTest = useABTest("ml-model-comparison-v1", undefined, sessionId, {
    feature: "exit-readiness-prediction",
  });

  const formConfig = formTest.getConfig({
    formType: "multi-step",
    steps: 4,
    showProgress: true,
    submitButtonText: "Calculate Score",
  });

  const totalSteps =
    formConfig.formType === "single-page" ? 1 : formConfig.steps;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Generate session ID on mount
    setSessionId(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    );
  }, []);

  useEffect(() => {
    // Track form view
    if (!formTest.isLoading) {
      formTest.trackEvent("form_viewed", {
        formType: formConfig.formType,
        variant: formTest.variant?.id,
      });
    }
  }, [formTest.isLoading]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: keyof BusinessData, value: any) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateReadinessScore = async () => {
    setIsLoading(true);

    // Track form submission attempt
    formTest.trackEvent("form_submitted", {
      formType: formConfig.formType,
      completedSteps: step,
      variant: formTest.variant?.id,
    });

    try {
      // Add A/B test data to request
      const requestData = {
        ...businessData,
        abTestData: {
          formVariant: formTest.variant?.id,
          modelVariant: modelTest.variant?.id,
          sessionId: sessionId,
        },
      };

      // Call your ML API for real exit readiness calculation
      const response = await fetch("/api/ml/exit-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const score = await response.json();
        setReadinessScore(score);
        setStep(5); // Results step

        // Track successful completion
        formTest.trackEvent("form_completed", {
          overallScore: score.overallScore,
          processingTime: score.mlMetadata?.processingTimeMs,
          variant: formTest.variant?.id,
        });

        modelTest.trackEvent("prediction_generated", {
          modelVersion: score.mlMetadata?.modelVersion,
          confidenceScore: score.mlMetadata?.confidenceScore,
          processingTime: score.mlMetadata?.processingTimeMs,
          variant: modelTest.variant?.id,
        });
      } else {
        // Fallback demo calculation for now
        const demoScore = calculateDemoScore();
        setReadinessScore(demoScore);
        setStep(5);

        // Track fallback usage
        formTest.trackEvent("fallback_used", {
          reason: "api_error",
          variant: formTest.variant?.id,
        });
      }
    } catch (error) {
      console.error("Error calculating readiness score:", error);
      // Show demo results
      const demoScore = calculateDemoScore();
      setReadinessScore(demoScore);
      setStep(5);

      // Track error
      formTest.trackEvent("calculation_error", {
        error: error instanceof Error ? error.message : "unknown",
        variant: formTest.variant?.id,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDemoScore = (): ReadinessScore => {
    const financial = calculateFinancialScore();
    const operational = calculateOperationalScore();
    const strategic = calculateStrategicScore();
    const legal = calculateLegalScore();

    const overall = Math.round(
      (financial + operational + strategic + legal) / 4,
    );

    return {
      overallScore: overall,
      financialScore: financial,
      operationalScore: operational,
      strategicScore: strategic,
      legalScore: legal,
      recommendations: generateRecommendations(overall),
      estimatedValuation: {
        low: (businessData.annualRevenue || 1000000) * 2,
        high: (businessData.annualRevenue || 1000000) * 5,
        confidence: overall > 80 ? 85 : overall > 60 ? 70 : 50,
      },
      timeToReadiness: overall > 80 ? 3 : overall > 60 ? 6 : 12,
    };
  };

  const calculateFinancialScore = (): number => {
    let score = 0;
    if (businessData.annualRevenue && businessData.annualRevenue > 1000000)
      score += 30;
    if (businessData.profitMargin && businessData.profitMargin > 15)
      score += 25;
    if (businessData.revenueGrowth && businessData.revenueGrowth > 10)
      score += 25;
    if (businessData.hasFinancialRecords) score += 20;
    return Math.min(score, 100);
  };

  const calculateOperationalScore = (): number => {
    let score = 0;
    if (businessData.hasDocumentedProcesses) score += 30;
    if (businessData.employeeCount && businessData.employeeCount > 10)
      score += 25;
    if (businessData.customerConcentration === "diversified") score += 25;
    if (businessData.businessModel && businessData.businessModel !== "other")
      score += 20;
    return Math.min(score, 100);
  };

  const calculateStrategicScore = (): number => {
    let score = 0;
    if (businessData.marketPosition === "leader") score += 40;
    else if (businessData.marketPosition === "strong") score += 30;
    if (
      businessData.competitiveAdvantage &&
      businessData.competitiveAdvantage.length > 50
    )
      score += 30;
    if (businessData.hasIntellectualProperty) score += 30;
    return Math.min(score, 100);
  };

  const calculateLegalScore = (): number => {
    let score = 0;
    if (businessData.hasLegalCompliance) score += 50;
    if (businessData.hasIntellectualProperty) score += 25;
    if (businessData.companyAge && businessData.companyAge > 3) score += 25;
    return Math.min(score, 100);
  };

  const generateRecommendations = (
    score: number,
  ): ReadinessScore["recommendations"] => {
    const recommendations = [];

    if (!businessData.hasFinancialRecords) {
      recommendations.push({
        category: "Financial",
        priority: "high" as const,
        title: "Organize Financial Records",
        description:
          "Ensure all financial statements are accurate, audited, and up-to-date for the past 3-5 years.",
        estimatedImpact: "+15-20 points to overall score",
      });
    }

    if (!businessData.hasDocumentedProcesses) {
      recommendations.push({
        category: "Operational",
        priority: "high" as const,
        title: "Document Business Processes",
        description:
          "Create comprehensive documentation of all key business processes and procedures.",
        estimatedImpact: "+10-15 points to operational score",
      });
    }

    if (businessData.customerConcentration === "concentrated") {
      recommendations.push({
        category: "Strategic",
        priority: "medium" as const,
        title: "Diversify Customer Base",
        description:
          "Reduce dependency on major customers to minimize business risk.",
        estimatedImpact: "+5-10 points to strategic score",
      });
    }

    return recommendations;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60)
      return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Analyzing Your Business
              </h3>
              <p className="text-gray-600">
                Our AI is evaluating your exit readiness...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 5 && readinessScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Exit Readiness Score
            </h1>
            <p className="text-xl text-gray-600">
              Based on AI analysis of your business data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Score */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Overall Readiness</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div
                    className={`text-6xl font-bold ${getScoreColor(readinessScore.overallScore)} mb-4`}
                  >
                    {readinessScore.overallScore}
                  </div>
                  {getScoreBadge(readinessScore.overallScore)}
                  <p className="text-sm text-gray-600 mt-4">
                    Estimated time to exit readiness:{" "}
                    <strong>{readinessScore.timeToReadiness} months</strong>
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Estimated Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    $
                    {(readinessScore.estimatedValuation.low / 1000000).toFixed(
                      1,
                    )}
                    M - $
                    {(readinessScore.estimatedValuation.high / 1000000).toFixed(
                      1,
                    )}
                    M
                  </div>
                  <p className="text-sm text-gray-600">
                    Confidence: {readinessScore.estimatedValuation.confidence}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Scores */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Financial Health</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={readinessScore.financialScore}
                        className="w-24"
                      />
                      <span
                        className={`font-semibold ${getScoreColor(readinessScore.financialScore)}`}
                      >
                        {readinessScore.financialScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Operational Excellence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={readinessScore.operationalScore}
                        className="w-24"
                      />
                      <span
                        className={`font-semibold ${getScoreColor(readinessScore.operationalScore)}`}
                      >
                        {readinessScore.operationalScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Strategic Position</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={readinessScore.strategicScore}
                        className="w-24"
                      />
                      <span
                        className={`font-semibold ${getScoreColor(readinessScore.strategicScore)}`}
                      >
                        {readinessScore.strategicScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Legal Compliance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={readinessScore.legalScore}
                        className="w-24"
                      />
                      <span
                        className={`font-semibold ${getScoreColor(readinessScore.legalScore)}`}
                      >
                        {readinessScore.legalScore}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {readinessScore.recommendations.map((rec, index) => (
                      <div key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {rec.priority} priority
                          </Badge>
                          <span className="font-semibold">{rec.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {rec.description}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          {rec.estimatedImpact}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button size="lg" className="mr-4">
                  Get Detailed Report
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exit Readiness Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Get your AI-powered business exit readiness score in minutes
          </p>

          <div className="mt-6">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Company Basics"}
              {step === 2 && "Financial Information"}
              {step === 3 && "Business Operations"}
              {step === 4 && "Strategic Position"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={businessData.companyName || ""}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("industry", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">
                        Professional Services
                      </SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyAge">Company Age (years)</Label>
                    <Input
                      id="companyAge"
                      type="number"
                      value={businessData.companyAge || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "companyAge",
                          parseInt(e.target.value),
                        )
                      }
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={businessData.employeeCount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "employeeCount",
                          parseInt(e.target.value),
                        )
                      }
                      placeholder="25"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={businessData.annualRevenue || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "annualRevenue",
                        parseInt(e.target.value),
                      )
                    }
                    placeholder="1000000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                    <Input
                      id="profitMargin"
                      type="number"
                      value={businessData.profitMargin || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "profitMargin",
                          parseFloat(e.target.value),
                        )
                      }
                      placeholder="15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueGrowth">Revenue Growth (%)</Label>
                    <Input
                      id="revenueGrowth"
                      type="number"
                      value={businessData.revenueGrowth || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "revenueGrowth",
                          parseFloat(e.target.value),
                        )
                      }
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Model</Label>
                  <RadioGroup
                    value={businessData.businessModel}
                    onValueChange={(value) =>
                      handleInputChange("businessModel", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="saas" id="saas" />
                      <Label htmlFor="saas">SaaS/Subscription</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ecommerce" id="ecommerce" />
                      <Label htmlFor="ecommerce">E-commerce</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="marketplace" id="marketplace" />
                      <Label htmlFor="marketplace">Marketplace</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="service" id="service" />
                      <Label htmlFor="service">Service-based</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Customer Concentration</Label>
                  <RadioGroup
                    value={businessData.customerConcentration}
                    onValueChange={(value) =>
                      handleInputChange("customerConcentration", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diversified" id="diversified" />
                      <Label htmlFor="diversified">
                        Diversified (no customer &gt;10% of revenue)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">
                        Moderate (1-2 customers 10-25% of revenue)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="concentrated" id="concentrated" />
                      <Label htmlFor="concentrated">
                        Concentrated (customers &gt;25% of revenue)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Business Documentation</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="processes"
                        checked={businessData.hasDocumentedProcesses || false}
                        onChange={(e) =>
                          handleInputChange(
                            "hasDocumentedProcesses",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="processes">
                        Documented business processes
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="financial"
                        checked={businessData.hasFinancialRecords || false}
                        onChange={(e) =>
                          handleInputChange(
                            "hasFinancialRecords",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="financial">
                        Audited financial records (3+ years)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="legal"
                        checked={businessData.hasLegalCompliance || false}
                        onChange={(e) =>
                          handleInputChange(
                            "hasLegalCompliance",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="legal">
                        Legal compliance documentation
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ip"
                        checked={businessData.hasIntellectualProperty || false}
                        onChange={(e) =>
                          handleInputChange(
                            "hasIntellectualProperty",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="ip">
                        Intellectual property protection
                      </Label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Market Position</Label>
                  <RadioGroup
                    value={businessData.marketPosition}
                    onValueChange={(value) =>
                      handleInputChange("marketPosition", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leader" id="leader" />
                      <Label htmlFor="leader">Market leader in niche</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="strong" id="strong" />
                      <Label htmlFor="strong">
                        Strong competitive position
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average">Average market position</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weak" id="weak" />
                      <Label htmlFor="weak">Struggling to compete</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advantage">Competitive Advantage</Label>
                  <Textarea
                    id="advantage"
                    value={businessData.competitiveAdvantage || ""}
                    onChange={(e) =>
                      handleInputChange("competitiveAdvantage", e.target.value)
                    }
                    placeholder="Describe your key competitive advantages..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reason for Exit</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("reasonForExit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="new-venture">
                        New business venture
                      </SelectItem>
                      <SelectItem value="financial">
                        Financial opportunity
                      </SelectItem>
                      <SelectItem value="market-timing">
                        Market timing
                      </SelectItem>
                      <SelectItem value="partnership">
                        Strategic partnership
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Desired Exit Timeframe</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("timeframe", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-months">Within 6 months</SelectItem>
                      <SelectItem value="1-year">Within 1 year</SelectItem>
                      <SelectItem value="2-years">Within 2 years</SelectItem>
                      <SelectItem value="3-plus-years">3+ years</SelectItem>
                      <SelectItem value="flexible">Flexible timing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={calculateReadinessScore}>
                  {formConfig.submitButtonText}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
