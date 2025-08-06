import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

// ML Service Configuration
const ML_SERVICE_CONFIG = {
  baseUrl: process.env.ML_SERVICE_URL || "http://localhost:8001",
  apiKey: process.env.ML_API_KEY || "your-ml-api-key",
  timeout: 30000, // 30 seconds
};

// Laravel API Configuration
const LARAVEL_API_CONFIG = {
  baseUrl: process.env.LARAVEL_API_URL || "http://localhost:8000",
  timeout: 30000,
};

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
  timeToReadiness: number;
  mlMetadata: {
    modelVersion: string;
    predictionId: string;
    confidenceScore: number;
    processingTimeMs: number;
  };
}

async function callMLService(businessData: any): Promise<ReadinessScore> {
  const startTime = Date.now();

  try {
    // Transform business data to ML features
    const features = transformToMLFeatures(businessData);

    const response = await fetch(
      `${ML_SERVICE_CONFIG.baseUrl}/v1/predict/exit-readiness`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ML_SERVICE_CONFIG.apiKey}`,
          "X-Request-ID": generateRequestId(),
        },
        body: JSON.stringify({
          features,
          model_config: {
            use_ensemble: true,
            return_explanations: true,
            confidence_threshold: 0.7,
          },
        }),
        signal: AbortSignal.timeout(ML_SERVICE_CONFIG.timeout),
      },
    );

    if (!response.ok) {
      throw new Error(
        `ML Service error: ${response.status} ${response.statusText}`,
      );
    }

    const mlResult = await response.json();
    const processingTime = Date.now() - startTime;

    // Transform ML result to frontend format
    return {
      overallScore: Math.round(mlResult.predictions.overall_score * 100),
      financialScore: Math.round(mlResult.predictions.financial_score * 100),
      operationalScore: Math.round(
        mlResult.predictions.operational_score * 100,
      ),
      strategicScore: Math.round(mlResult.predictions.strategic_score * 100),
      legalScore: Math.round(mlResult.predictions.legal_score * 100),
      recommendations: generateRecommendations(
        mlResult.explanations,
        businessData,
      ),
      estimatedValuation: {
        low: mlResult.predictions.valuation_range.low,
        high: mlResult.predictions.valuation_range.high,
        confidence: Math.round(mlResult.predictions.valuation_confidence * 100),
      },
      timeToReadiness: mlResult.predictions.time_to_readiness_months,
      mlMetadata: {
        modelVersion: mlResult.model_info.version,
        predictionId: mlResult.prediction_id,
        confidenceScore: mlResult.predictions.confidence_score,
        processingTimeMs: processingTime,
      },
    };
  } catch (error) {
    console.error("ML Service call failed:", error);
    throw new Error("Failed to get ML prediction");
  }
}

async function savePredictionToLaravel(
  businessData: any,
  prediction: ReadinessScore,
  userInfo?: any,
) {
  try {
    const response = await fetch(
      `${LARAVEL_API_CONFIG.baseUrl}/api/v1/predictions/exit-readiness`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          business_data: businessData,
          prediction_result: prediction,
          user_info: userInfo,
          created_at: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(LARAVEL_API_CONFIG.timeout),
      },
    );

    if (response.ok) {
      const result = await response.json();
      return result.data.id; // Return prediction ID
    }
  } catch (error) {
    console.error("Failed to save prediction to Laravel:", error);
    // Don't throw - this is not critical for user experience
  }
  return null;
}

function transformToMLFeatures(businessData: any): Record<string, any> {
  return {
    // Company features
    company_age_years: businessData.companyAge,
    employee_count: businessData.employeeCount,
    industry: businessData.industry,

    // Financial features
    annual_revenue: businessData.annualRevenue,
    profit_margin: businessData.profitMargin / 100, // Convert to decimal
    revenue_growth_rate: businessData.revenueGrowth / 100,

    // Business model features
    business_model: businessData.businessModel,
    customer_concentration: mapCustomerConcentration(
      businessData.customerConcentration,
    ),

    // Operational features
    has_documented_processes: businessData.hasDocumentedProcesses ? 1 : 0,
    has_financial_records: businessData.hasFinancialRecords ? 1 : 0,
    has_legal_compliance: businessData.hasLegalCompliance ? 1 : 0,
    has_intellectual_property: businessData.hasIntellectualProperty ? 1 : 0,

    // Strategic features
    market_position: mapMarketPosition(businessData.marketPosition),
    competitive_advantage_strength: assessCompetitiveAdvantage(
      businessData.competitiveAdvantage,
    ),

    // Exit features
    exit_reason: businessData.reasonForExit,
    desired_timeframe: mapTimeframe(businessData.timeframe),

    // Derived features
    revenue_per_employee:
      businessData.annualRevenue / businessData.employeeCount,
    company_maturity: businessData.companyAge > 5 ? 1 : 0,
    profit_absolute:
      businessData.annualRevenue * (businessData.profitMargin / 100),
  };
}

function mapCustomerConcentration(concentration: string): number {
  const mapping = { diversified: 0, moderate: 1, concentrated: 2 };
  return mapping[concentration as keyof typeof mapping] || 1;
}

function mapMarketPosition(position: string): number {
  const mapping = { leader: 3, strong: 2, average: 1, weak: 0 };
  return mapping[position as keyof typeof mapping] || 1;
}

function mapTimeframe(timeframe: string): number {
  const mapping = {
    "6-months": 0.5,
    "1-year": 1,
    "2-years": 2,
    "3-plus-years": 3,
    flexible: 2,
  };
  return mapping[timeframe as keyof typeof mapping] || 2;
}

function assessCompetitiveAdvantage(advantage: string): number {
  // Simple scoring based on text length and key terms
  const length = advantage.length;
  const keyTerms = [
    "unique",
    "patent",
    "proprietary",
    "technology",
    "market",
    "brand",
    "customer",
  ];
  const termCount = keyTerms.filter((term) =>
    advantage.toLowerCase().includes(term),
  ).length;

  return Math.min(10, Math.round(length / 50 + termCount * 2));
}

function generateRecommendations(
  explanations: any,
  businessData: any,
): ReadinessScore["recommendations"] {
  const recommendations = [];

  // Generate recommendations based on ML explanations and business data
  if (explanations?.low_scores?.includes("financial")) {
    recommendations.push({
      category: "Financial",
      priority: "high" as const,
      title: "Improve Financial Metrics",
      description:
        "Focus on increasing profitability and revenue growth to enhance business attractiveness.",
      estimatedImpact: "+15-25 points to financial score",
    });
  }

  if (!businessData.hasFinancialRecords) {
    recommendations.push({
      category: "Financial",
      priority: "high" as const,
      title: "Organize Financial Records",
      description:
        "Ensure all financial statements are accurate, audited, and up-to-date for the past 3-5 years.",
      estimatedImpact: "+10-20 points to overall score",
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

  if (
    !businessData.hasIntellectualProperty &&
    businessData.industry === "technology"
  ) {
    recommendations.push({
      category: "Legal",
      priority: "medium" as const,
      title: "Protect Intellectual Property",
      description:
        "File patents, trademarks, and copyrights to protect your competitive advantages.",
      estimatedImpact: "+5-15 points to legal score",
    });
  }

  return recommendations;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in an hour." },
        { status: 429 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const businessData = BusinessDataSchema.parse(body);

    // Get ML prediction
    const prediction = await callMLService(businessData);

    // Save to Laravel API (non-blocking)
    const userInfo = {
      ip,
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    };

    savePredictionToLaravel(businessData, prediction, userInfo).catch(
      console.error,
    );

    // Publish event to Kafka (if available)
    if (process.env.KAFKA_ENABLED === "true") {
      publishExitReadinessEvent(businessData, prediction, userInfo).catch(
        console.error,
      );
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Exit readiness API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid business data", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("ML Service")) {
      return NextResponse.json(
        { error: "ML service temporarily unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function publishExitReadinessEvent(
  businessData: any,
  prediction: ReadinessScore,
  userInfo: any,
) {
  try {
    // This would use your existing Kafka producer
    const event = {
      eventType: "EXIT_READINESS_CALCULATED",
      eventId: prediction.mlMetadata.predictionId,
      timestamp: new Date().toISOString(),
      data: {
        businessData,
        prediction,
        userInfo,
      },
    };

    // Import and use your KafkaProducerService
    // await kafkaProducer.publish('business_events', event);
  } catch (error) {
    console.error("Failed to publish Kafka event:", error);
  }
}
