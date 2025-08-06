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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  TrendingUp,
  Target,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AIApiService from "@/lib/ai-api";
import { AIInsight } from "@/types/ai";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "radio";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  aiAssisted?: boolean;
}

interface FormData {
  [key: string]: any;
}

interface ExitPlanningWizardProps {
  onComplete?: (data: FormData, insights: AIInsight[]) => void;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "business-overview",
    title: "Business Overview",
    description: "Tell us about your business",
    icon: <FileText className="w-5 h-5" />,
    fields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "Enter your business name",
        required: true,
      },
      {
        name: "industry",
        label: "Industry",
        type: "select",
        required: true,
        options: [
          { value: "technology", label: "Technology" },
          { value: "healthcare", label: "Healthcare" },
          { value: "retail", label: "Retail" },
          { value: "manufacturing", label: "Manufacturing" },
          { value: "services", label: "Professional Services" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "yearsInBusiness",
        label: "Years in Business",
        type: "number",
        placeholder: "How many years?",
        required: true,
      },
      {
        name: "businessDescription",
        label: "Business Description",
        type: "textarea",
        placeholder: "Briefly describe what your business does",
        required: true,
        aiAssisted: true,
      },
    ],
  },
  {
    id: "financial-metrics",
    title: "Financial Metrics",
    description: "Key financial information for valuation",
    icon: <TrendingUp className="w-5 h-5" />,
    fields: [
      {
        name: "annualRevenue",
        label: "Annual Revenue",
        type: "number",
        placeholder: "Last year's revenue",
        required: true,
      },
      {
        name: "profitMargin",
        label: "Profit Margin (%)",
        type: "number",
        placeholder: "Average profit margin",
        required: true,
      },
      {
        name: "growthRate",
        label: "Annual Growth Rate (%)",
        type: "number",
        placeholder: "Year-over-year growth",
        required: true,
      },
      {
        name: "recurringRevenue",
        label: "Recurring Revenue (%)",
        type: "number",
        placeholder: "Percentage of recurring revenue",
      },
    ],
  },
  {
    id: "exit-goals",
    title: "Exit Goals",
    description: "What are you looking to achieve?",
    icon: <Target className="w-5 h-5" />,
    fields: [
      {
        name: "exitTimeframe",
        label: "Exit Timeframe",
        type: "select",
        required: true,
        options: [
          { value: "6months", label: "Within 6 months" },
          { value: "1year", label: "Within 1 year" },
          { value: "2years", label: "Within 2 years" },
          { value: "3-5years", label: "3-5 years" },
          { value: "flexible", label: "Flexible" },
        ],
      },
      {
        name: "valuationExpectation",
        label: "Valuation Expectation",
        type: "number",
        placeholder: "Target sale price",
        aiAssisted: true,
      },
      {
        name: "exitType",
        label: "Preferred Exit Type",
        type: "radio",
        required: true,
        options: [
          { value: "acquisition", label: "Strategic Acquisition" },
          { value: "financial", label: "Financial Buyer" },
          { value: "management", label: "Management Buyout" },
          { value: "ipo", label: "IPO" },
          { value: "merger", label: "Merger" },
        ],
      },
      {
        name: "postExitGoals",
        label: "Post-Exit Goals",
        type: "textarea",
        placeholder: "What do you plan to do after the exit?",
        aiAssisted: true,
      },
    ],
  },
  {
    id: "readiness-assessment",
    title: "Exit Readiness",
    description: "Assess your current readiness",
    icon: <Shield className="w-5 h-5" />,
    fields: [
      {
        name: "financialRecords",
        label: "Financial Records Quality",
        type: "radio",
        required: true,
        options: [
          { value: "excellent", label: "Excellent - Audited financials" },
          { value: "good", label: "Good - Clean books" },
          { value: "fair", label: "Fair - Need some cleanup" },
          { value: "poor", label: "Poor - Major work needed" },
        ],
      },
      {
        name: "managementTeam",
        label: "Management Team Strength",
        type: "radio",
        required: true,
        options: [
          { value: "strong", label: "Strong - Can run without owner" },
          { value: "developing", label: "Developing - Some gaps" },
          { value: "weak", label: "Weak - Owner dependent" },
        ],
      },
      {
        name: "customerConcentration",
        label: "Largest Customer Revenue %",
        type: "number",
        placeholder: "Percentage from largest customer",
      },
      {
        name: "concerns",
        label: "Main Concerns",
        type: "textarea",
        placeholder: "What are your biggest concerns about exiting?",
        aiAssisted: true,
      },
    ],
  },
];

export function ExitPlanningWizard({ onComplete }: ExitPlanningWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>(
    {},
  );
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const apiService = new AIApiService();
  const currentStepData = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getAISuggestion = async (fieldName: string) => {
    try {
      const context = {
        field: fieldName,
        currentData: formData,
        step: currentStepData.id,
      };

      const response = await apiService.generateInsight(
        "field_suggestion",
        context,
      );
      setAiSuggestions((prev) => ({
        ...prev,
        [fieldName]: response.details.suggestion,
      }));
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    currentStepData.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step - generate insights
      await generateFinalInsights();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const generateFinalInsights = async () => {
    setIsGeneratingInsights(true);

    try {
      // Generate insights for each area
      const insightPromises = [
        apiService.calculateValuation(formData),
        apiService.generateExitStrategy(formData),
        apiService.assessRisks(formData),
        apiService.generateTimeline(formData),
      ];

      const results = await Promise.all(insightPromises);

      const generatedInsights: AIInsight[] = [
        {
          id: "1",
          type: "valuation",
          title: "Business Valuation",
          summary: results[0].summary,
          details: results[0],
          confidence: results[0].confidence || 0.85,
          sources: ["Financial Analysis", "Market Comparables"],
          agentId: "valuation",
          createdAt: new Date(),
        },
        {
          id: "2",
          type: "strategy",
          title: "Exit Strategy Recommendation",
          summary: results[1].summary,
          details: results[1],
          confidence: results[1].confidence || 0.9,
          sources: ["Industry Analysis", "Market Trends"],
          agentId: "strategy",
          createdAt: new Date(),
        },
        {
          id: "3",
          type: "risk",
          title: "Risk Assessment",
          summary: results[2].summary,
          details: results[2],
          confidence: results[2].confidence || 0.8,
          sources: ["Business Analysis", "Market Conditions"],
          agentId: "risk",
          createdAt: new Date(),
        },
        {
          id: "4",
          type: "timeline",
          title: "Recommended Timeline",
          summary: results[3].summary,
          details: results[3],
          confidence: results[3].confidence || 0.85,
          sources: ["Process Analysis", "Market Timing"],
          agentId: "timeline",
          createdAt: new Date(),
        },
      ];

      setInsights(generatedInsights);

      if (onComplete) {
        onComplete(formData, generatedInsights);
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];
    const suggestion = aiSuggestions[field.name];

    return (
      <div key={field.name} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.aiAssisted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => getAISuggestion(field.name)}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI Assist
            </Button>
          )}
        </div>

        {suggestion && (
          <Alert className="mb-2">
            <Bot className="w-4 h-4" />
            <AlertDescription>
              <strong>AI Suggestion:</strong> {suggestion}
              <Button
                variant="link"
                size="sm"
                className="ml-2 p-0"
                onClick={() => handleFieldChange(field.name, suggestion)}
              >
                Use this
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {field.type === "text" && (
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={cn(error && "border-red-500")}
          />
        )}

        {field.type === "number" && (
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={cn(error && "border-red-500")}
          />
        )}

        {field.type === "textarea" && (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={cn(error && "border-red-500")}
            rows={3}
          />
        )}

        {field.type === "select" && (
          <Select
            value={value}
            onValueChange={(v) => handleFieldChange(field.name, v)}
          >
            <SelectTrigger className={cn(error && "border-red-500")}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "radio" && (
          <RadioGroup
            value={value}
            onValueChange={(v) => handleFieldChange(field.name, v)}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.name}-${option.value}`}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  };

  if (isGeneratingInsights || insights.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Exit Planning Complete
          </CardTitle>
          <CardDescription>
            {isGeneratingInsights
              ? "Generating your personalized insights..."
              : "Your AI-powered exit plan is ready"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGeneratingInsights ? (
            <div className="flex items-center justify-center py-12">
              <Bot className="w-8 h-8 animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.summary}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {currentStepData.icon}
              {currentStepData.title}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStepData.fields.map(renderField)}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === WIZARD_STEPS.length - 1 ? (
                <>
                  Generate Insights
                  <Bot className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
