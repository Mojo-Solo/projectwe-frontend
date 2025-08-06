"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Brain,
  Database,
  Zap,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
  FolderOpen,
  Hash,
  Layers,
  Cpu,
} from "lucide-react";

interface PipelineStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: string;
  status: string;
}

const stageDetails = {
  "Document Ingestion": {
    icon: FileText,
    description: "Converting raw documents into processable format",
    stats: {
      "Total Files": 103,
      "Total Pages": "4,841",
      "Processing Time": "2.3 hours",
      "Success Rate": "100%",
    },
    processes: [
      {
        name: "PDF Text Extraction",
        details: "OCR + text parsing for all PDF documents",
        items: [
          "28 Exit Strategy PDFs",
          "19 Succession Guides",
          "25 Tax Documents",
        ],
        technology: "PyPDF2, Tesseract OCR",
      },
      {
        name: "Excel Workbook Processing",
        details: "Financial model and valuation data extraction",
        items: [
          "31 Valuation Models",
          "15 Financial Templates",
          "8 ROI Calculators",
        ],
        technology: "pandas, openpyxl",
      },
      {
        name: "Document Validation",
        details: "Quality checks and format standardization",
        items: [
          "Schema validation",
          "Duplicate detection",
          "Language verification",
        ],
        technology: "Custom validation pipeline",
      },
    ],
  },
  "Knowledge Extraction": {
    icon: Brain,
    description: "Identifying frameworks, patterns, and best practices",
    stats: {
      "Frameworks Found": 42,
      "Best Practices": 156,
      "Case Studies": 73,
      "Processing Time": "4.7 hours",
    },
    processes: [
      {
        name: "Framework Detection",
        details: "ML-based identification of exit planning methodologies",
        items: [
          "Named Entity Recognition",
          "Pattern matching",
          "Hierarchical clustering",
        ],
        technology: "spaCy, BERT, custom NER models",
      },
      {
        name: "Best Practice Mining",
        details: "Extracting actionable insights from success stories",
        items: [
          "Success pattern analysis",
          "Outcome correlation",
          "Industry categorization",
        ],
        technology: "GPT-4, Claude 3, custom classifiers",
      },
      {
        name: "Relationship Mapping",
        details: "Building knowledge graph of concepts",
        items: [
          "Entity relationships",
          "Dependency graphs",
          "Prerequisite chains",
        ],
        technology: "NetworkX, Neo4j",
      },
    ],
  },
  "Vector Embedding": {
    icon: Database,
    description: "Converting text into searchable vector representations",
    stats: {
      "Total Vectors": "8,743",
      "Embedding Model": "text-embedding-3-large",
      "Vector Dimensions": "3,072",
      "Index Size": "1.2 GB",
    },
    processes: [
      {
        name: "Text Chunking",
        details: "Optimal segmentation for context preservation",
        items: [
          "Semantic chunking",
          "Overlap strategy",
          "Metadata preservation",
        ],
        technology: "LangChain, NLTK",
      },
      {
        name: "Embedding Generation",
        details: "High-dimensional vector creation",
        items: ["Batch processing", "Normalization", "Quality validation"],
        technology: "OpenAI Embeddings API",
      },
      {
        name: "Vector Indexing",
        details: "Optimized storage and retrieval",
        items: [
          "Pinecone upload",
          "Metadata tagging",
          "Namespace organization",
        ],
        technology: "Pinecone Vector Database",
      },
    ],
  },
  "Intelligence Integration": {
    icon: Zap,
    description: "Real-time AI matching and personalization",
    stats: {
      "Response Time": "<200ms",
      Accuracy: "99.8%",
      "Active Models": 3,
      "Cache Hit Rate": "67%",
    },
    processes: [
      {
        name: "Query Processing",
        details: "Understanding user intent and context",
        items: [
          "Intent classification",
          "Context enrichment",
          "Query expansion",
        ],
        technology: "Custom NLU pipeline",
      },
      {
        name: "Semantic Search",
        details: "Finding most relevant knowledge",
        items: [
          "Vector similarity search",
          "Hybrid ranking",
          "Result re-ranking",
        ],
        technology: "Pinecone, Elasticsearch",
      },
      {
        name: "Response Generation",
        details: "Creating personalized recommendations",
        items: [
          "Template selection",
          "Content generation",
          "Fact verification",
        ],
        technology: "GPT-4, Claude 3, Llama Guard",
      },
    ],
  },
};

export function PipelineStageModal({
  isOpen,
  onClose,
  stage,
  status,
}: PipelineStageModalProps) {
  const details = stageDetails[stage as keyof typeof stageDetails];
  if (!details) return null;

  const Icon = details.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 text-primary" />
            {stage}
            <Badge
              variant={
                status === "complete"
                  ? "default"
                  : status === "active"
                    ? "secondary"
                    : "outline"
              }
              className="ml-2"
            >
              {status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Description */}
            <p className="text-muted-foreground">{details.description}</p>

            {/* Key Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(details.stats).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground">{key}</p>
                      <p className="text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Processing Details
              </h3>

              {details.processes.map((process, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          {process.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {process.details}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium mb-2">Components</p>
                          <ul className="space-y-1">
                            {process.items.map((item, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground flex items-start gap-1"
                              >
                                <span className="text-primary mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-medium mb-2">
                            Technology Stack
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {process.technology}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status Indicator */}
            {status === "complete" && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Stage completed successfully
              </div>
            )}
            {status === "active" && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Clock className="h-4 w-4 animate-pulse" />
                Currently processing...
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
