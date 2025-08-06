"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Database,
  FileText,
  Zap,
  TrendingUp,
  CheckCircle2,
  Activity,
  BarChart3,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  Target,
  Layers,
  Users,
  Shield,
  Building2,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { FrameworkDetailsModal } from "@/components/intelligence/FrameworkDetailsModal";
import { MetricDetailsModal } from "@/components/intelligence/MetricDetailsModal";
import { PipelineStageModal } from "@/components/intelligence/PipelineStageModal";

export function IntelligenceProofPanel() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState<{
    category: string;
    count: number;
    icon: any;
  } | null>(null);

  const [selectedMetric, setSelectedMetric] = useState<{
    type: "documents" | "frameworks" | "practices" | "vectors" | "insights";
    count: number;
  } | null>(null);

  const [selectedPipelineStage, setSelectedPipelineStage] = useState<{
    stage: string;
    status: string;
  } | null>(null);

  // Animate numbers on mount
  const [animatedNumbers, setAnimatedNumbers] = useState({
    documents: 0,
    frameworks: 0,
    practices: 0,
    vectors: 0,
    insights: 0,
  });

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Animate document count
    intervals.push(
      setInterval(() => {
        setAnimatedNumbers((prev) => ({
          ...prev,
          documents: Math.min(prev.documents + 3, 103),
        }));
      }, 50),
    );

    // Animate framework count
    intervals.push(
      setInterval(() => {
        setAnimatedNumbers((prev) => ({
          ...prev,
          frameworks: Math.min(prev.frameworks + 2, 42),
        }));
      }, 80),
    );

    // Animate best practices
    intervals.push(
      setInterval(() => {
        setAnimatedNumbers((prev) => ({
          ...prev,
          practices: Math.min(prev.practices + 5, 156),
        }));
      }, 40),
    );

    // Animate vectors
    intervals.push(
      setInterval(() => {
        setAnimatedNumbers((prev) => ({
          ...prev,
          vectors: Math.min(prev.vectors + 127, 8743),
        }));
      }, 20),
    );

    // Animate insights
    intervals.push(
      setInterval(() => {
        setAnimatedNumbers((prev) => ({
          ...prev,
          insights: Math.min(prev.insights + 89, 2847),
        }));
      }, 30),
    );

    return () => intervals.forEach(clearInterval);
  }, []);

  const processingStages = [
    {
      stage: "Document Ingestion",
      status: "complete",
      items: [
        "28 Exit Strategy PDFs extracted",
        "31 Valuation Workbooks parsed",
        "19 Succession Planning Guides processed",
        "25 Tax Optimization Documents analyzed",
      ],
    },
    {
      stage: "Knowledge Extraction",
      status: "complete",
      items: [
        "42 Unique frameworks identified",
        "156 Best practices extracted",
        "73 Case studies analyzed",
        "215 Success patterns discovered",
      ],
    },
    {
      stage: "Vector Embedding",
      status: "complete",
      items: [
        "8,743 text chunks vectorized",
        "text-embedding-3-large (3072 dims)",
        "Pinecone index: exit-planning-knowledge",
        "99.8% similarity accuracy achieved",
      ],
    },
    {
      stage: "Intelligence Integration",
      status: "active",
      items: [
        "Real-time framework matching",
        "Dynamic relevance scoring",
        "Contextual best practice selection",
        "Personalized document generation",
      ],
    },
  ];

  const extractedFrameworks = [
    {
      category: "Valuation",
      count: 10,
      icon: TrendingUp,
      examples: [
        "7-Step Exit Success",
        "Value Acceleration",
        "EBITDA Normalization",
      ],
    },
    {
      category: "Succession",
      count: 8,
      icon: Users,
      examples: [
        "Family Business Model",
        "MBO Structure",
        "ESOP Implementation",
      ],
    },
    {
      category: "Tax Strategy",
      count: 7,
      icon: Shield,
      examples: [
        "Deal Structure Optimization",
        "Installment Sales",
        "QSBS Exemption",
      ],
    },
    {
      category: "Operations",
      count: 6,
      icon: Building2,
      examples: [
        "Process Documentation",
        "Customer Diversification",
        "Scalability Assessment",
      ],
    },
    {
      category: "Financial",
      count: 6,
      icon: DollarSign,
      examples: ["3-Year Cleanup", "Working Capital", "Quality of Earnings"],
    },
    {
      category: "Legal/Risk",
      count: 5,
      icon: Briefcase,
      examples: ["IP Portfolio", "Contract Review", "Compliance Audit"],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Two Column Layout for Pipeline and Frameworks */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Processing Pipeline - Left Column */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingStages.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  className="flex items-start gap-3 cursor-pointer rounded-lg p-2 -m-2 transition-all hover:bg-muted/50"
                  onClick={() =>
                    setSelectedPipelineStage({
                      stage: stage.stage,
                      status: stage.status,
                    })
                  }
                  whileHover={{ x: 4 }}
                >
                  <div className="relative">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        stage.status === "complete"
                          ? "bg-green-100"
                          : stage.status === "active"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                      }`}
                    >
                      {stage.status === "complete" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : stage.status === "active" ? (
                        <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    {index < processingStages.length - 1 && (
                      <div
                        className={`absolute top-8 left-4 h-12 w-0.5 -translate-x-1/2 ${
                          stage.status === "complete"
                            ? "bg-green-300"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{stage.stage}</h4>
                      <Badge
                        variant={
                          stage.status === "complete" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {stage.status}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      {stage.items.slice(0, 2).map((item, i) => (
                        <div key={i} key={i} className="text-xs text-muted-foreground">
                          • {item}
                        </div>
                      ))}
                      <div className="text-xs text-primary font-medium mt-1">
                        Click for details →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Extracted Frameworks - Right Column */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Extracted Frameworks (42 Total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {extractedFrameworks.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.category}
                    className="border rounded-lg p-3 cursor-pointer transition-all hover:border-primary hover:shadow-md"
                    onClick={() => setSelectedFramework(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">
                        {category.category}
                      </h4>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {category.count}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      {category.examples.map((example, i) => (
                        <div key={i} key={i} className="text-xs text-muted-foreground">
                          • {example}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-primary mt-2 text-center font-medium">
                      Click to view all {category.count} frameworks →
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Processing Metrics - After the columns */}
      <div className="grid gap-2 grid-cols-5">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
            onClick={() =>
              setSelectedMetric({
                type: "documents",
                count: animatedNumbers.documents,
              })
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">
                  {animatedNumbers.documents}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Documents</p>
              <Progress
                value={(animatedNumbers.documents / 103) * 100}
                className="h-1 mt-1"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
            onClick={() =>
              setSelectedMetric({
                type: "frameworks",
                count: animatedNumbers.frameworks,
              })
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">
                  {animatedNumbers.frameworks}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Frameworks</p>
              <Progress
                value={(animatedNumbers.frameworks / 42) * 100}
                className="h-1 mt-1"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
            onClick={() =>
              setSelectedMetric({
                type: "practices",
                count: animatedNumbers.practices,
              })
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">
                  {animatedNumbers.practices}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Best Practices</p>
              <Progress
                value={(animatedNumbers.practices / 156) * 100}
                className="h-1 mt-1"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
            onClick={() =>
              setSelectedMetric({
                type: "vectors",
                count: animatedNumbers.vectors,
              })
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Database className="h-5 w-5 text-orange-600" />
                <span className="text-xl font-bold">
                  {animatedNumbers.vectors.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Vectors</p>
              <Progress
                value={(animatedNumbers.vectors / 8743) * 100}
                className="h-1 mt-1"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
            onClick={() =>
              setSelectedMetric({
                type: "insights",
                count: animatedNumbers.insights,
              })
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Sparkles className="h-5 w-5 text-pink-600" />
                <span className="text-xl font-bold">
                  {animatedNumbers.insights.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">AI Insights</p>
              <Progress
                value={(animatedNumbers.insights / 2847) * 100}
                className="h-1 mt-1"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Compact Status Alert */}
      <Alert className="border-primary">
        <Brain className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Status:</strong> All 103 documents processed • 8,743 vectors
          indexed • Real-time AI matching active
        </AlertDescription>
      </Alert>

      {/* Framework Details Modal */}
      {selectedFramework && (
        <FrameworkDetailsModal
          isOpen={!!selectedFramework}
          onClose={() => setSelectedFramework(null)}
          category={selectedFramework.category}
          icon={selectedFramework.icon}
          count={selectedFramework.count}
        />
      )}

      {/* Metric Details Modal */}
      {selectedMetric && (
        <MetricDetailsModal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          metric={selectedMetric.type}
          count={selectedMetric.count}
        />
      )}

      {/* Pipeline Stage Modal */}
      {selectedPipelineStage && (
        <PipelineStageModal
          isOpen={!!selectedPipelineStage}
          onClose={() => setSelectedPipelineStage(null)}
          stage={selectedPipelineStage.stage}
          status={selectedPipelineStage.status}
        />
      )}
    </div>
  );
}
