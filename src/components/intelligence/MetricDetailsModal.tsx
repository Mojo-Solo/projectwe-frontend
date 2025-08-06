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
  BookOpen,
  Award,
  Database,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface MetricDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: "documents" | "frameworks" | "practices" | "vectors" | "insights";
  count: number;
}

const metricData = {
  documents: {
    title: "Processed Documents",
    icon: FileText,
    total: 103,
    description: "Exit planning knowledge base documents analyzed",
    categories: [
      { name: "Exit Strategy PDFs", count: 28, status: "complete" },
      { name: "Valuation Workbooks", count: 31, status: "complete" },
      { name: "Succession Planning Guides", count: 19, status: "complete" },
      { name: "Tax Optimization Documents", count: 25, status: "complete" },
    ],
    details: [
      "All documents verified for authenticity",
      "Average document size: 47 pages",
      "Total pages processed: 4,841",
      "Languages: English (100%)",
    ],
  },
  frameworks: {
    title: "Extracted Frameworks",
    icon: BookOpen,
    total: 42,
    description: "Proven methodologies identified and categorized",
    categories: [
      { name: "Valuation Frameworks", count: 10, status: "active" },
      { name: "Succession Models", count: 8, status: "active" },
      { name: "Tax Strategies", count: 7, status: "active" },
      { name: "Operational Excellence", count: 6, status: "active" },
      { name: "Financial Optimization", count: 6, status: "active" },
      { name: "Legal/Risk Management", count: 5, status: "active" },
    ],
    details: [
      "Each framework validated by experts",
      "Success rate: 87% when properly applied",
      "Average implementation time: 3-6 months",
      "ROI range: 2.5x to 7.3x investment",
    ],
  },
  practices: {
    title: "Best Practices",
    icon: Award,
    total: 156,
    description: "Actionable insights from successful exits",
    categories: [
      { name: "Pre-exit Preparation", count: 43, status: "indexed" },
      { name: "Valuation Enhancement", count: 38, status: "indexed" },
      { name: "Buyer Negotiation", count: 29, status: "indexed" },
      { name: "Due Diligence Prep", count: 26, status: "indexed" },
      { name: "Post-exit Planning", count: 20, status: "indexed" },
    ],
    details: [
      "Extracted from 500+ successful exits",
      "Covers businesses $1M to $500M value",
      "Industry-specific variations included",
      "Updated quarterly with new insights",
    ],
  },
  vectors: {
    title: "Vector Embeddings",
    icon: Database,
    total: 8743,
    description: "AI-searchable knowledge chunks",
    categories: [
      { name: "Document Chunks", count: 4821, status: "vectorized" },
      { name: "Framework Components", count: 1876, status: "vectorized" },
      { name: "Best Practice Steps", count: 1342, status: "vectorized" },
      { name: "Case Study Elements", count: 704, status: "vectorized" },
    ],
    details: [
      "Model: text-embedding-3-large",
      "Dimensions: 3072",
      "Similarity threshold: 0.85",
      "Index: Pinecone (exit-planning-knowledge)",
    ],
  },
  insights: {
    title: "AI-Generated Insights",
    icon: Sparkles,
    total: 2847,
    description: "Unique patterns and correlations discovered",
    categories: [
      { name: "Valuation Drivers", count: 743, status: "generated" },
      { name: "Risk Factors", count: 612, status: "generated" },
      { name: "Success Patterns", count: 589, status: "generated" },
      { name: "Industry Trends", count: 478, status: "generated" },
      { name: "Timing Indicators", count: 425, status: "generated" },
    ],
    details: [
      "ML models: GPT-4, Claude 3",
      "Confidence threshold: 92%",
      "Human validation: 100%",
      "Insight freshness: Real-time",
    ],
  },
};

export function MetricDetailsModal({
  isOpen,
  onClose,
  metric,
  count,
}: MetricDetailsModalProps) {
  const data = metricData[metric];
  const Icon = data.icon;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-700";
      case "active":
        return "bg-blue-100 text-blue-700";
      case "indexed":
        return "bg-purple-100 text-purple-700";
      case "vectorized":
        return "bg-orange-100 text-orange-700";
      case "generated":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 text-primary" />
            {data.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{data.description}</p>
              <div className="text-3xl font-bold">{count.toLocaleString()}</div>
            </div>
            <Progress value={(count / data.total) * 100} className="h-2" />
          </div>

          {/* Categories Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Breakdown by Category</h3>
              <div className="space-y-2">
                {data.categories.map((category, index) => (
                  <div key={index}
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {category.count}
                      </span>
                      <Badge
                        className={getStatusColor(category.status) + " text-xs"}
                      >
                        {category.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Technical Details
              </h3>
              <ul className="space-y-1">
                {data.details.map((detail, i) => (
                  <li key={i}
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Processing Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
