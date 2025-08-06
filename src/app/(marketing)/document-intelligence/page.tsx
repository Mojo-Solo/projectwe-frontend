"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface DocumentAnalysis {
  documentId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  status: "processing" | "completed" | "error";
  analysisResults?: {
    // Financial Analysis
    financialMetrics: {
      revenue: number;
      profit: number;
      profitMargin: number;
      growthRate: number;
      cashFlow: number;
      debtRatio: number;
    };

    // Risk Assessment
    riskFactors: Array<{
      category: string;
      severity: "low" | "medium" | "high";
      description: string;
      impact: string;
      recommendation: string;
    }>;

    // Key Insights
    insights: Array<{
      type: "opportunity" | "concern" | "compliance" | "valuation";
      title: string;
      description: string;
      confidence: number;
      impact: "low" | "medium" | "high";
    }>;

    // Document Classification
    classification: {
      documentType: string;
      confidence: number;
      extractedEntities: Array<{
        type: string;
        value: string;
        confidence: number;
      }>;
    };

    // Compliance Check
    compliance: {
      score: number;
      issues: Array<{
        regulation: string;
        status: "compliant" | "non-compliant" | "requires-review";
        description: string;
      }>;
    };

    // Valuation Impact
    valuationImpact: {
      positiveFactors: string[];
      negativeFactors: string[];
      estimatedImpact: {
        low: number;
        high: number;
      };
    };

    // Processing Metadata
    processingTime: number;
    modelVersion: string;
    confidence: number;
  };
}

export default function DocumentIntelligencePage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<
    DocumentAnalysis[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentAnalysis | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      // Create document entry
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDocument: DocumentAnalysis = {
        documentId,
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        status: "processing",
      };

      setUploadedDocuments((prev) => [...prev, newDocument]);

      try {
        // Upload and analyze document
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentId", documentId);

        const response = await fetch("/api/documents/analyze", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const analysisResult = await response.json();

          // Update document with analysis results
          setUploadedDocuments((prev) =>
            prev.map((doc) =>
              doc.documentId === documentId
                ? {
                    ...doc,
                    status: "completed",
                    analysisResults: analysisResult,
                  }
                : doc,
            ),
          );
        } else {
          // Handle error
          setUploadedDocuments((prev) =>
            prev.map((doc) =>
              doc.documentId === documentId ? { ...doc, status: "error" } : doc,
            ),
          );
        }
      } catch (error) {
        console.error("Document analysis failed:", error);
        setUploadedDocuments((prev) =>
          prev.map((doc) =>
            doc.documentId === documentId ? { ...doc, status: "error" } : doc,
          ),
        );
      }
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const getRiskBadgeColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp key={index} className="h-4 w-4 text-green-600" />;
      case "concern":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "compliance":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "valuation":
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Intelligence
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered analysis of your business documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-blue-600 font-medium">
                      Drop documents here...
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">
                        Drag & drop documents here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, Excel, Word, CSV files (max 10MB)
                      </p>
                    </>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processing documents...</span>
                    </div>
                  </div>
                )}

                {/* Document List */}
                <div className="mt-6 space-y-3">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.documentId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.documentId === doc.documentId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium truncate">
                            {doc.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.status === "processing" && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          )}
                          {doc.status === "completed" && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                          {doc.status === "error" && (
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {!selectedDocument ? (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Select a document to view analysis
                    </h3>
                    <p className="text-gray-500">
                      Upload documents to get AI-powered insights about your
                      business
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : selectedDocument.status === "processing" ? (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Analyzing Document
                    </h3>
                    <p className="text-gray-500">
                      Our AI is processing {selectedDocument.fileName}...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : selectedDocument.status === "error" ? (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Analysis Failed
                    </h3>
                    <p className="text-gray-500">
                      Unable to analyze {selectedDocument.fileName}. Please try
                      again.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Analysis Results Display
              <div className="space-y-6">
                {/* Document Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">
                        {selectedDocument.fileName}
                      </h2>
                      <Badge className="bg-green-100 text-green-800">
                        {
                          selectedDocument.analysisResults?.classification
                            .documentType
                        }
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(
                            (selectedDocument.analysisResults?.confidence ||
                              0) * 100,
                          )}
                          %
                        </div>
                        <div className="text-sm text-gray-600">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDocument.analysisResults?.compliance.score ||
                            0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Compliance Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDocument.analysisResults?.processingTime ||
                            0}
                          ms
                        </div>
                        <div className="text-sm text-gray-600">
                          Processing Time
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Tabs */}
                <Tabs defaultValue="insights" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="insights">Key Insights</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          AI-Generated Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedDocument.analysisResults?.insights.map(
                            (insight, index) => (
                              <div key={index}
                                className="border-l-4 border-blue-500 pl-4"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {getInsightIcon(insight.type)}
                                  <h4 className="font-semibold">
                                    {insight.title}
                                  </h4>
                                  <Badge
                                    variant={
                                      insight.impact === "high"
                                        ? "destructive"
                                        : insight.impact === "medium"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {insight.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mb-2">
                                  {insight.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    Confidence:{" "}
                                    {Math.round(insight.confidence * 100)}%
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financial">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Financial Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Revenue
                              </label>
                              <div className="text-2xl font-bold">
                                $
                                {(
                                  selectedDocument.analysisResults
                                    ?.financialMetrics.revenue || 0
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Profit
                              </label>
                              <div className="text-2xl font-bold text-green-600">
                                $
                                {(
                                  selectedDocument.analysisResults
                                    ?.financialMetrics.profit || 0
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Cash Flow
                              </label>
                              <div className="text-2xl font-bold">
                                $
                                {(
                                  selectedDocument.analysisResults
                                    ?.financialMetrics.cashFlow || 0
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Profit Margin
                              </label>
                              <div className="text-2xl font-bold">
                                {(
                                  (selectedDocument.analysisResults
                                    ?.financialMetrics.profitMargin || 0) * 100
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Growth Rate
                              </label>
                              <div className="text-2xl font-bold text-blue-600">
                                {(
                                  (selectedDocument.analysisResults
                                    ?.financialMetrics.growthRate || 0) * 100
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Debt Ratio
                              </label>
                              <div className="text-2xl font-bold">
                                {(
                                  (selectedDocument.analysisResults
                                    ?.financialMetrics.debtRatio || 0) * 100
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedDocument.analysisResults?.riskFactors.map(
                            (risk, index) => (
                              <div key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">
                                    {risk.category}
                                  </h4>
                                  <Badge
                                    className={getRiskBadgeColor(risk.severity)}
                                  >
                                    {risk.severity} risk
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mb-2">
                                  {risk.description}
                                </p>
                                <div className="bg-gray-50 p-3 rounded">
                                  <p className="text-sm">
                                    <strong>Impact:</strong> {risk.impact}
                                  </p>
                                  <p className="text-sm mt-1">
                                    <strong>Recommendation:</strong>{" "}
                                    {risk.recommendation}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="compliance">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Compliance Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Overall Compliance Score
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              {
                                selectedDocument.analysisResults?.compliance
                                  .score
                              }
                              /100
                            </span>
                          </div>
                          <Progress
                            value={
                              selectedDocument.analysisResults?.compliance
                                .score || 0
                            }
                            className="h-3"
                          />
                        </div>

                        <div className="space-y-3">
                          {selectedDocument.analysisResults?.compliance.issues.map(
                            (issue, index) => (
                              <div key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <h4 className="font-medium">
                                    {issue.regulation}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {issue.description}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    issue.status === "compliant"
                                      ? "bg-green-100 text-green-800"
                                      : issue.status === "non-compliant"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {issue.status}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="valuation">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Valuation Impact
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Positive Factors
                            </h4>
                            <ul className="space-y-2">
                              {selectedDocument.analysisResults?.valuationImpact.positiveFactors.map(
                                (factor, index) => (
                                  <li key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{factor}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Negative Factors
                            </h4>
                            <ul className="space-y-2">
                              {selectedDocument.analysisResults?.valuationImpact.negativeFactors.map(
                                (factor, index) => (
                                  <li key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{factor}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Estimated Valuation Impact
                          </h4>
                          <div className="text-2xl font-bold">
                            $
                            {(
                              selectedDocument.analysisResults?.valuationImpact
                                .estimatedImpact.low || 0
                            ).toLocaleString()}{" "}
                            - $
                            {(
                              selectedDocument.analysisResults?.valuationImpact
                                .estimatedImpact.high || 0
                            ).toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Range based on document analysis and market
                            comparables
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <Button size="lg">Download Full Report</Button>
                  <Button variant="outline" size="lg">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
