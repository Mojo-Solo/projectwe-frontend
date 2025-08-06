import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { MLService } from "@/lib/ml-service-direct";

// Document analysis configuration
const ANALYSIS_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
  ],
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://localhost:8001",
  storageDir: process.env.DOCUMENT_STORAGE_PATH || "./storage/documents",
};

interface DocumentAnalysisResult {
  financialMetrics: {
    revenue: number;
    profit: number;
    profitMargin: number;
    growthRate: number;
    cashFlow: number;
    debtRatio: number;
  };
  riskFactors: Array<{
    category: string;
    severity: "low" | "medium" | "high";
    description: string;
    impact: string;
    recommendation: string;
  }>;
  insights: Array<{
    type: "opportunity" | "concern" | "compliance" | "valuation";
    title: string;
    description: string;
    confidence: number;
    impact: "low" | "medium" | "high";
  }>;
  classification: {
    documentType: string;
    confidence: number;
    extractedEntities: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
  };
  compliance: {
    score: number;
    issues: Array<{
      regulation: string;
      status: "compliant" | "non-compliant" | "requires-review";
      description: string;
    }>;
  };
  valuationImpact: {
    positiveFactors: string[];
    negativeFactors: string[];
    estimatedImpact: {
      low: number;
      high: number;
    };
  };
  processingTime: number;
  modelVersion: string;
  confidence: number;
}

export async function POST(request: NextRequest) {
  // Check if ML API key is configured
  if (!process.env.ML_API_KEY) {
    return NextResponse.json(
      {
        error: "ML service not configured",
        details: "ML_API_KEY environment variable is required",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentId = formData.get("documentId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file
    if (file.size > ANALYSIS_CONFIG.maxFileSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    if (!ANALYSIS_CONFIG.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 },
      );
    }

    // Ensure storage directory exists
    if (!existsSync(ANALYSIS_CONFIG.storageDir)) {
      await mkdir(ANALYSIS_CONFIG.storageDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(
      ANALYSIS_CONFIG.storageDir,
      `${documentId}_${file.name}`,
    );
    await writeFile(filePath, buffer);

    // Analyze document with ML service
    const analysisResult = await analyzeDocumentWithML(
      filePath,
      file,
      documentId,
    );

    // Store analysis in database (if you have Laravel API)
    if (process.env.LARAVEL_API_URL) {
      await storeAnalysisResult(documentId, file.name, analysisResult);
    }

    // Publish to Kafka for real-time processing
    if (process.env.KAFKA_ENABLED === "true") {
      await publishDocumentEvent(documentId, file.name, analysisResult);
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      { error: "Document analysis failed" },
      { status: 500 },
    );
  }
}

async function analyzeDocumentWithML(
  filePath: string,
  file: File,
  documentId: string,
): Promise<DocumentAnalysisResult> {
  const startTime = Date.now();

  try {
    // Prepare form data for ML service
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([await file.arrayBuffer()], { type: file.type }),
      file.name,
    );
    formData.append("document_id", documentId);
    formData.append("analysis_type", "comprehensive");

    // Call ML service
    const response = await fetch(
      `${ANALYSIS_CONFIG.mlServiceUrl}/v1/documents/analyze`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.ML_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      // If ML service fails, throw error to be caught by outer try-catch
      throw new Error(
        `ML service returned ${response.status}: ${response.statusText}`,
      );
    }

    const mlResult = await response.json();
    const processingTime = Date.now() - startTime;

    // Transform ML result to frontend format
    return transformMLResult(mlResult, processingTime);
  } catch (error) {
    console.error("ML service call failed:", error);

    // Fallback to OpenAI analysis
    console.warn("Falling back to OpenAI analysis");
    return await analyzeWithOpenAI(file, documentId);
  }
}

function transformMLResult(
  mlResult: any,
  processingTime: number,
): DocumentAnalysisResult {
  return {
    financialMetrics: {
      revenue: mlResult.financial_analysis?.revenue || 0,
      profit: mlResult.financial_analysis?.profit || 0,
      profitMargin: mlResult.financial_analysis?.profit_margin || 0,
      growthRate: mlResult.financial_analysis?.growth_rate || 0,
      cashFlow: mlResult.financial_analysis?.cash_flow || 0,
      debtRatio: mlResult.financial_analysis?.debt_ratio || 0,
    },
    riskFactors:
      mlResult.risk_assessment?.factors?.map((factor: any) => ({
        category: factor.category,
        severity: factor.severity,
        description: factor.description,
        impact: factor.impact,
        recommendation: factor.recommendation,
      })) || [],
    insights:
      mlResult.insights?.map((insight: any) => ({
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        impact: insight.impact,
      })) || [],
    classification: {
      documentType: mlResult.classification?.document_type || "Unknown",
      confidence: mlResult.classification?.confidence || 0,
      extractedEntities: mlResult.classification?.entities || [],
    },
    compliance: {
      score: mlResult.compliance?.score || 0,
      issues: mlResult.compliance?.issues || [],
    },
    valuationImpact: {
      positiveFactors: mlResult.valuation?.positive_factors || [],
      negativeFactors: mlResult.valuation?.negative_factors || [],
      estimatedImpact: {
        low: mlResult.valuation?.impact_range?.low || 0,
        high: mlResult.valuation?.impact_range?.high || 0,
      },
    },
    processingTime,
    modelVersion: mlResult.model_info?.version || "v1.0",
    confidence: mlResult.overall_confidence || 0.85,
  };
}

async function storeAnalysisResult(
  documentId: string,
  fileName: string,
  analysis: DocumentAnalysisResult,
): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.LARAVEL_API_URL}/api/v1/documents/analysis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          file_name: fileName,
          analysis_result: analysis,
          created_at: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to store analysis result:", response.statusText);
    }
  } catch (error) {
    console.error("Error storing analysis result:", error);
  }
}

async function publishDocumentEvent(
  documentId: string,
  fileName: string,
  analysis: DocumentAnalysisResult,
): Promise<void> {
  try {
    // This would integrate with your Kafka producer
    const event = {
      eventType: "DOCUMENT_ANALYZED",
      eventId: `analysis_${documentId}`,
      timestamp: new Date().toISOString(),
      data: {
        documentId,
        fileName,
        analysis,
        processingTime: analysis.processingTime,
      },
    };

    // Import and use your KafkaProducerService
    console.log("Would publish to Kafka:", event);
  } catch (error) {
    console.error("Failed to publish document event:", error);
  }
}

async function analyzeWithOpenAI(
  file: File,
  documentId: string,
): Promise<DocumentAnalysisResult> {
  try {
    // Read file content (limited to prevent token overflow)
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString("utf-8").substring(0, 10000);

    // Analyze with OpenAI
    const analysis = await MLService.analyzeDocument({
      documentId,
      content,
      documentType: file.type,
    });

    // Transform to expected format
    const result: DocumentAnalysisResult = {
      financialMetrics: {
        revenue: extractNumber(content, /revenue[:\s]+\$?([\d,]+)/i) || 0,
        profit: extractNumber(content, /profit[:\s]+\$?([\d,]+)/i) || 0,
        profitMargin: extractNumber(content, /margin[:\s]+([\d.]+)%/i) || 0,
        growthRate: extractNumber(content, /growth[:\s]+([\d.]+)%/i) || 0,
        cashFlow: extractNumber(content, /cash\s*flow[:\s]+\$?([\d,]+)/i) || 0,
        debtRatio: extractNumber(content, /debt\s*ratio[:\s]+([\d.]+)/i) || 0,
      },
      riskFactors: analysis.risks.map((risk) => ({
        category: "General Risk",
        severity: "medium" as const,
        description: risk,
        impact: "May affect business operations",
        recommendation: "Review and address this risk factor",
      })),
      insights: analysis.keyPoints.map((point, index) => ({
        type: "opportunity" as const,
        title: `Key Finding ${index + 1}`,
        description: point,
        confidence: 0.85,
        impact: "medium" as const,
      })),
      classification: {
        documentType: analysis.classification?.category || "Business Document",
        confidence: analysis.classification?.confidence || 0.9,
        extractedEntities: analysis.entities || [],
      },
      compliance: {
        score: analysis.score,
        issues: [],
      },
      valuationImpact: {
        positiveFactors: analysis.keyPoints.filter(
          (p) =>
            p.toLowerCase().includes("positive") ||
            p.toLowerCase().includes("strong"),
        ),
        negativeFactors: analysis.risks,
        estimatedImpact: {
          low: 0,
          high: 0,
        },
      },
      processingTime: Date.now(),
      modelVersion: "openai-direct",
      confidence: 0.85,
    };

    return result;
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw error;
  }
}

function extractNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  if (match && match[1]) {
    return parseFloat(match[1].replace(/,/g, ""));
  }
  return null;
}
