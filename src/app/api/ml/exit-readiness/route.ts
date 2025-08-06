import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MLService } from "@/lib/ml-service-direct";

// Business data schema for validation
const BusinessDataSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  companyAge: z.number().min(0),
  employeeCount: z.number().min(1),
  annualRevenue: z.number().min(0),
  profitMargin: z.number().min(-100).max(100),
  revenueGrowth: z.number().min(-100).max(1000),
  businessModel: z.string().min(1),
  primaryRevenueSources: z.array(z.string()).optional(),
  customerConcentration: z.enum(["diversified", "moderate", "concentrated"]),
  hasDocumentedProcesses: z.boolean(),
  hasFinancialRecords: z.boolean(),
  hasLegalCompliance: z.boolean(),
  hasIntellectualProperty: z.boolean(),
  marketPosition: z.enum(["leader", "strong", "average", "weak"]),
  competitiveAdvantage: z.string(),
  reasonForExit: z.string(),
  timeframe: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const businessData = BusinessDataSchema.parse(body);

    // Prepare data for ML analysis
    const mlData = {
      financial: {
        revenue: businessData.annualRevenue,
        profitMargin: businessData.profitMargin,
        revenueGrowth: businessData.revenueGrowth,
        hasRecords: businessData.hasFinancialRecords,
      },
      operational: {
        employeeCount: businessData.employeeCount,
        hasProcesses: businessData.hasDocumentedProcesses,
        businessModel: businessData.businessModel,
        companyAge: businessData.companyAge,
      },
      legal: {
        hasCompliance: businessData.hasLegalCompliance,
        hasIP: businessData.hasIntellectualProperty,
      },
      market: {
        industry: businessData.industry,
        position: businessData.marketPosition,
        competitiveAdvantage: businessData.competitiveAdvantage,
        customerConcentration: businessData.customerConcentration,
      },
    };

    // Get exit readiness assessment from OpenAI
    const assessment = await MLService.analyzeExitReadiness(mlData);

    // Calculate estimated valuation
    const valuationData = {
      financials: {
        revenue: businessData.annualRevenue,
        profit: businessData.annualRevenue * (businessData.profitMargin / 100),
        ebitda:
          businessData.annualRevenue * (businessData.profitMargin / 100) * 1.2, // Rough EBITDA estimate
        growth: businessData.revenueGrowth,
      },
      industry: businessData.industry,
      region: "United States", // Default for now
    };

    const valuation = await MLService.calculateValuation(valuationData);

    // Combine results into the expected format
    const result = {
      overallScore: assessment.overallScore,
      financialScore: assessment.breakdown.financial || 0,
      operationalScore: assessment.breakdown.operational || 0,
      strategicScore: assessment.breakdown.strategic || 0,
      legalScore: assessment.breakdown.legal || 0,
      recommendations: assessment.recommendations.map((rec, index) => ({
        category: determineCategory(rec),
        priority: determinePriority(assessment.overallScore, index),
        title: rec,
        description: generateDescription(rec, businessData),
        estimatedImpact: generateImpact(rec),
      })),
      estimatedValuation: {
        low: valuation.range.low,
        high: valuation.range.high,
        confidence: Math.round(valuation.confidence * 100),
      },
      timeToReadiness: parseTimeframe(assessment.timeline),
      mlMetadata: {
        modelVersion: "openai-direct-v1",
        predictionId: `pred_${Date.now()}`,
        confidenceScore: assessment.confidence,
        processingTimeMs: 0, // Will be calculated
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Exit readiness API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid business data", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("OpenAI")) {
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper functions
function determineCategory(recommendation: string): string {
  const lower = recommendation.toLowerCase();
  if (
    lower.includes("financial") ||
    lower.includes("revenue") ||
    lower.includes("profit")
  ) {
    return "Financial";
  } else if (lower.includes("process") || lower.includes("operation")) {
    return "Operational";
  } else if (lower.includes("legal") || lower.includes("compliance")) {
    return "Legal";
  } else if (lower.includes("market") || lower.includes("customer")) {
    return "Strategic";
  }
  return "General";
}

function determinePriority(
  overallScore: number,
  index: number,
): "high" | "medium" | "low" {
  if (overallScore < 50 && index < 2) return "high";
  if (index < 3) return "medium";
  return "low";
}

function generateDescription(
  recommendation: string,
  businessData: any,
): string {
  // Expand the recommendation based on business context
  const descriptions: Record<string, string> = {
    "improve financial": `Based on your ${businessData.profitMargin}% profit margin and ${businessData.revenueGrowth}% growth rate, focusing on financial improvements will significantly enhance your exit readiness.`,
    "document process":
      "Creating comprehensive documentation of all business processes will make due diligence smoother and increase buyer confidence.",
    "diversify customer": `With ${businessData.customerConcentration} customer concentration, reducing dependency on major customers will minimize business risk and increase attractiveness to buyers.`,
  };

  for (const [key, desc] of Object.entries(descriptions)) {
    if (recommendation.toLowerCase().includes(key)) {
      return desc;
    }
  }

  return (
    recommendation +
    " This will improve your overall exit readiness and business valuation."
  );
}

function generateImpact(recommendation: string): string {
  const impacts = [
    "+5-10 points to overall score",
    "+10-15 points to relevant category",
    "+15-20% potential valuation increase",
    "Reduce exit timeline by 3-6 months",
  ];
  return impacts[Math.floor(Math.random() * impacts.length)];
}

function parseTimeframe(timeline: string): number {
  const match = timeline.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1]);
    if (timeline.includes("month")) return num;
    if (timeline.includes("year")) return num * 12;
  }
  return 12; // Default to 12 months
}
