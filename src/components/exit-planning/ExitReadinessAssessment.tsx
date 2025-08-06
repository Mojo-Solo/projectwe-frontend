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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Users,
  FileText,
  DollarSign,
  Briefcase,
  Target,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
    description?: string;
  }[];
  weight: number;
}

interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  readinessLevel: "Low" | "Fair" | "Good" | "Excellent";
}

interface ExitReadinessAssessmentProps {
  onAssessmentComplete?: (result: AssessmentResult) => void;
  className?: string;
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "financial-records",
    category: "Financial Health",
    question: "How would you rate the quality of your financial records?",
    options: [
      {
        value: "excellent",
        label: "Excellent - Audited financials, clean books",
        score: 100,
        description: "Professional audit, GAAP compliance",
      },
      {
        value: "good",
        label: "Good - Reviewed financials, mostly organized",
        score: 75,
        description: "CPA reviewed, minor adjustments needed",
      },
      {
        value: "fair",
        label: "Fair - Basic bookkeeping, some gaps",
        score: 50,
        description: "Internal bookkeeping, needs professional review",
      },
      {
        value: "poor",
        label: "Poor - Incomplete or messy records",
        score: 25,
        description: "Significant work needed before sale",
      },
    ],
    weight: 20,
  },
  {
    id: "profit-consistency",
    category: "Financial Health",
    question: "How consistent are your profits over the past 3 years?",
    options: [
      { value: "increasing", label: "Consistently increasing", score: 100 },
      { value: "stable", label: "Stable with minor fluctuations", score: 80 },
      {
        value: "variable",
        label: "Variable but generally positive",
        score: 60,
      },
      { value: "declining", label: "Declining or inconsistent", score: 30 },
    ],
    weight: 15,
  },
  {
    id: "management-team",
    category: "Operations",
    question: "How strong is your management team?",
    options: [
      {
        value: "independent",
        label: "Runs independently without owner involvement",
        score: 100,
      },
      {
        value: "strong",
        label: "Strong team with minimal owner oversight",
        score: 80,
      },
      {
        value: "developing",
        label: "Competent but requires owner guidance",
        score: 60,
      },
      { value: "dependent", label: "Heavily dependent on owner", score: 30 },
    ],
    weight: 18,
  },
  {
    id: "customer-concentration",
    category: "Market Position",
    question: "What percentage of revenue comes from your largest customer?",
    options: [
      { value: "low", label: "Less than 10%", score: 100 },
      { value: "moderate", label: "10-25%", score: 75 },
      { value: "high", label: "25-50%", score: 45 },
      { value: "very-high", label: "More than 50%", score: 20 },
    ],
    weight: 15,
  },
  {
    id: "competitive-position",
    category: "Market Position",
    question: "How would you describe your competitive position?",
    options: [
      {
        value: "leader",
        label: "Market leader with strong differentiation",
        score: 100,
      },
      {
        value: "strong",
        label: "Strong position with loyal customers",
        score: 80,
      },
      {
        value: "average",
        label: "Average position, faces competition",
        score: 60,
      },
      { value: "weak", label: "Weak position, intense competition", score: 30 },
    ],
    weight: 12,
  },
  {
    id: "legal-compliance",
    category: "Legal & Regulatory",
    question: "Are you fully compliant with all relevant regulations?",
    options: [
      {
        value: "excellent",
        label: "Fully compliant with documented processes",
        score: 100,
      },
      {
        value: "good",
        label: "Generally compliant with minor issues",
        score: 75,
      },
      {
        value: "fair",
        label: "Mostly compliant but needs attention",
        score: 50,
      },
      { value: "poor", label: "Significant compliance gaps", score: 25 },
    ],
    weight: 10,
  },
  {
    id: "intellectual-property",
    category: "Legal & Regulatory",
    question: "How well protected is your intellectual property?",
    options: [
      {
        value: "strong",
        label: "Strong IP portfolio with proper protection",
        score: 100,
      },
      {
        value: "moderate",
        label: "Some protection but could be strengthened",
        score: 70,
      },
      { value: "basic", label: "Basic protection or trade secrets", score: 50 },
      { value: "minimal", label: "Minimal or no IP protection", score: 20 },
    ],
    weight: 8,
  },
  {
    id: "growth-trajectory",
    category: "Strategic Positioning",
    question: "What is your business growth trajectory?",
    options: [
      {
        value: "strong",
        label: "Strong growth with clear expansion plans",
        score: 100,
      },
      {
        value: "moderate",
        label: "Moderate growth with some opportunities",
        score: 75,
      },
      { value: "stable", label: "Stable with limited growth", score: 50 },
      { value: "declining", label: "Declining or stagnant", score: 25 },
    ],
    weight: 12,
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Financial Health": <DollarSign className="w-4 h-4" />,
  Operations: <Briefcase className="w-4 h-4" />,
  "Market Position": <Target className="w-4 h-4" />,
  "Legal & Regulatory": <Shield className="w-4 h-4" />,
  "Strategic Positioning": <TrendingUp className="w-4 h-4" />,
};

export function ExitReadinessAssessment({
  onAssessmentComplete,
  className,
}: ExitReadinessAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
  const isLastQuestion =
    currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

  const calculateResults = (): AssessmentResult => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    const categoryTotals: Record<string, { score: number; weight: number }> =
      {};

    // Calculate weighted scores
    ASSESSMENT_QUESTIONS.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          const weightedScore = option.score * question.weight;
          totalWeightedScore += weightedScore;
          totalWeight += question.weight * 100; // Since scores are out of 100

          // Track category scores
          if (!categoryTotals[question.category]) {
            categoryTotals[question.category] = { score: 0, weight: 0 };
          }
          categoryTotals[question.category].score += weightedScore;
          categoryTotals[question.category].weight += question.weight * 100;
        }
      }
    });

    const overallScore = Math.round((totalWeightedScore / totalWeight) * 100);

    // Calculate category scores
    const categoryScores: Record<string, number> = {};
    Object.entries(categoryTotals).forEach(([category, data]) => {
      categoryScores[category] = Math.round((data.score / data.weight) * 100);
    });

    // Determine readiness level
    let readinessLevel: "Low" | "Fair" | "Good" | "Excellent";
    if (overallScore >= 85) readinessLevel = "Excellent";
    else if (overallScore >= 70) readinessLevel = "Good";
    else if (overallScore >= 55) readinessLevel = "Fair";
    else readinessLevel = "Low";

    // Generate insights
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score >= 80) {
        strengths.push(`Strong ${category.toLowerCase()}`);
      } else if (score < 60) {
        improvements.push(`Improve ${category.toLowerCase()}`);
      }
    });

    // Add specific recommendations based on scores
    if (categoryScores["Financial Health"] < 70) {
      recommendations.push(
        "Work with a CPA to clean up financial records and ensure GAAP compliance",
      );
    }
    if (categoryScores["Operations"] < 70) {
      recommendations.push(
        "Strengthen management team and reduce owner dependency",
      );
    }
    if (categoryScores["Market Position"] < 70) {
      recommendations.push(
        "Diversify customer base and strengthen competitive position",
      );
    }
    if (categoryScores["Legal & Regulatory"] < 70) {
      recommendations.push(
        "Address compliance gaps and strengthen IP protection",
      );
    }

    return {
      overallScore,
      categoryScores,
      strengths,
      improvements,
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              "Continue maintaining strong business practices",
              "Consider strategic improvements to maximize exit value",
            ],
      readinessLevel,
    };
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const assessmentResult = calculateResults();
      setResult(assessmentResult);
      setIsCompleted(true);

      if (onAssessmentComplete) {
        onAssessmentComplete(assessmentResult);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case "Excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Fair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isCompleted && result) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Exit Readiness Assessment Complete
              </CardTitle>
              <Badge className={getReadinessColor(result.readinessLevel)}>
                {result.readinessLevel} Readiness
              </Badge>
            </div>
            <CardDescription>
              Your business exit readiness analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div
                className={cn(
                  "text-6xl font-bold",
                  getScoreColor(result.overallScore),
                )}
              >
                {result.overallScore}
              </div>
              <p className="text-muted-foreground">Overall Readiness Score</p>
              <Progress value={result.overallScore} className="h-3" />
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold">Category Breakdown</h3>
              <div className="grid gap-3">
                {Object.entries(result.categoryScores).map(
                  ([category, score]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {CATEGORY_ICONS[category]}
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold", getScoreColor(score))}>
                          {score}%
                        </span>
                        <div className="w-20">
                          <Progress value={score} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Key Strengths
                </h3>
                <ul className="space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {result.improvements.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                This assessment provides a preliminary evaluation of your exit
                readiness. For a comprehensive analysis, consider consulting
                with exit planning professionals who can provide detailed
                recommendations tailored to your specific situation.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exit Readiness Assessment</CardTitle>
              <CardDescription>
                Evaluate your business&apos;s readiness for a successful exit
              </CardDescription>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {CATEGORY_ICONS[currentQuestion.category]}
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {currentQuestion.category}
                </Badge>
                <h3 className="text-lg font-medium leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>
            </div>

            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="mt-1"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    {option.description && (
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              {isLastQuestion ? (
                <>
                  Complete Assessment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
