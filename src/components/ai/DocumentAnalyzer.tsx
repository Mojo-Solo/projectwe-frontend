"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Bot,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AIApiService from "@/lib/ai-api";

interface AnalyzedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: "uploading" | "analyzing" | "completed" | "failed";
  analysis?: {
    summary: string;
    keyTerms: string[];
    extractedData: Record<string, any>;
    confidence: number;
    insights: string[];
  };
  error?: string;
}

interface DocumentAnalyzerProps {
  onAnalysisComplete?: (document: AnalyzedDocument) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
}

export function DocumentAnalyzer({
  onAnalysisComplete,
  acceptedFormats = [".pdf", ".doc", ".docx", ".txt"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: DocumentAnalyzerProps) {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<AnalyzedDocument | null>(null);

  const apiService = new AIApiService();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, [e, preventDefault, setIsDragging, true]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, [e, preventDefault, setIsDragging, false]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [e, preventDefault, setIsDragging, false, const, files, Array, from, dataTransfer, handleFiles]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    [],
  );

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      // Validate file
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        alert(`File type ${fileExtension} not supported`);
        continue;
      }

      if (file.size > maxFileSize) {
        alert(
          `File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`,
        );
        continue;
      }

      // Create document entry
      const document: AnalyzedDocument = {
        id: Date.now().toString() + "-" + file.name,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        status: "uploading",
      };

      setDocuments((prev) => [...prev, document]);

      // Upload and analyze
      try {
        // Update status to analyzing
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === document.id ? { ...doc, status: "analyzing" } : doc,
          ),
        );

        // Call API
        const analysis = await apiService.analyzeDocument(file);

        // Update with results
        const updatedDocument: AnalyzedDocument = {
          ...document,
          status: "completed",
          analysis: {
            summary: analysis.summary,
            keyTerms: analysis.keyTerms,
            extractedData: analysis.extractedData,
            confidence: analysis.confidence,
            insights: analysis.insights,
          },
        };

        setDocuments((prev) =>
          prev.map((doc) => (doc.id === document.id ? updatedDocument : doc)),
        );

        if (onAnalysisComplete) {
          onAnalysisComplete(updatedDocument);
        }
      } catch (error) {
        // Update with error
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === document.id
              ? { ...doc, status: "failed", error: (error as Error).message }
              : doc,
          ),
        );
      }
    }
  };

  const removeDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
    }
  };

  const downloadAnalysis = (document: AnalyzedDocument) => {
    const data = {
      fileName: document.fileName,
      uploadDate: document.uploadDate,
      analysis: document.analysis,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${document.fileName}.json`;
    a.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusIcon = (status: AnalyzedDocument["status"]) => {
    switch (status) {
      case "uploading":
        return <Upload key={index} className="w-4 h-4 text-blue-500" />;
      case "analyzing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept={acceptedFormats.join(",")}
              onChange={handleFileSelect}
            />

            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">
              Drop documents here or click to upload
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: {acceptedFormats.join(", ")} (max{" "}
              {maxFileSize / 1024 / 1024}MB)
            </p>
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzed Documents</CardTitle>
            <CardDescription>
              AI-powered analysis of your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={index}
                  key={doc.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    selectedDocument?.id === doc.id && "ring-2 ring-primary",
                  )}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.fileName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.fileSize)} •{" "}
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                        {doc.status === "completed" && doc.analysis && (
                          <div className="mt-2">
                            <p className="text-sm line-clamp-2">
                              {doc.analysis.summary}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.analysis.keyTerms
                                .slice(0, 3)
                                .map((term, i) => (
                                  <Badge key={i}
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {term}
                                  </Badge>
                                ))}
                              {doc.analysis.keyTerms.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{doc.analysis.keyTerms.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {doc.status === "failed" && (
                          <p className="text-sm text-red-500 mt-1">
                            {doc.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      {doc.status === "completed" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadAnalysis(doc);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDocument(doc.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Document Details */}
      {selectedDocument &&
        selectedDocument.status === "completed" &&
        selectedDocument.analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>{selectedDocument.fileName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    {selectedDocument.analysis.summary}
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Terms & Entities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.analysis.keyTerms.map((term, i) => (
                    <Badge key={i} key={i} variant="secondary">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI Insights</h4>
                <div className="space-y-2">
                  {selectedDocument.analysis.insights.map((insight, i) => (
                    <div key={i} key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Extracted Data</h4>
                <ScrollArea className="h-[200px] border rounded-lg p-3">
                  <pre className="text-sm">
                    {JSON.stringify(
                      selectedDocument.analysis.extractedData,
                      null,
                      2,
                    )}
                  </pre>
                </ScrollArea>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Badge variant="outline">
                  Confidence:{" "}
                  {Math.round(selectedDocument.analysis.confidence * 100)}%
                </Badge>
                <Button onClick={() => downloadAnalysis(selectedDocument)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
