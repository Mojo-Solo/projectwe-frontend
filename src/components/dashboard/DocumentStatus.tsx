"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentStatusProps {
  detailed?: boolean;
}

export function DocumentStatus({ detailed = false }: DocumentStatusProps) {
  const documentCategories = [
    {
      category: "Financial Documents",
      total: 12,
      completed: 10,
      required: true,
      documents: [
        {
          name: "3-Year Financial Statements",
          status: "completed",
          lastUpdated: "2024-03-01",
        },
        {
          name: "Tax Returns (3 years)",
          status: "completed",
          lastUpdated: "2024-02-28",
        },
        {
          name: "Accounts Receivable Aging",
          status: "in-review",
          lastUpdated: "2024-03-10",
        },
        { name: "Revenue Projections", status: "missing", lastUpdated: null },
      ],
    },
    {
      category: "Legal Documents",
      total: 8,
      completed: 6,
      required: true,
      documents: [
        {
          name: "Articles of Incorporation",
          status: "completed",
          lastUpdated: "2024-01-15",
        },
        {
          name: "Operating Agreements",
          status: "completed",
          lastUpdated: "2024-01-15",
        },
        {
          name: "Material Contracts",
          status: "in-review",
          lastUpdated: "2024-03-05",
        },
        { name: "IP Documentation", status: "missing", lastUpdated: null },
      ],
    },
    {
      category: "Operational Documents",
      total: 10,
      completed: 7,
      required: false,
      documents: [
        { name: "Org Chart", status: "completed", lastUpdated: "2024-02-20" },
        {
          name: "Process Documentation",
          status: "completed",
          lastUpdated: "2024-02-25",
        },
        {
          name: "Customer Lists",
          status: "in-review",
          lastUpdated: "2024-03-08",
        },
        {
          name: "Vendor Agreements",
          status: "completed",
          lastUpdated: "2024-02-18",
        },
      ],
    },
  ];

  const totalDocs = documentCategories.reduce((sum, cat) => sum + cat.total, 0);
  const completedDocs = documentCategories.reduce(
    (sum, cat) => sum + cat.completed,
    0,
  );
  const completionRate = Math.round((completedDocs / totalDocs) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-review":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "missing":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-review":
        return <Badge className="bg-blue-100 text-blue-700">In Review</Badge>;
      case "missing":
        return <Badge className="bg-red-100 text-red-700">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Document Status
          </CardTitle>
          <Badge variant="secondary">{completionRate}% Complete</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion</span>
            <span className="font-semibold">
              {completedDocs} of {totalDocs}
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {documentCategories.map((category, index) => (
            <motion key={index}.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{category.category}</h4>
                  {category.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {category.completed}/{category.total}
                </span>
              </div>

              <Progress
                value={(category.completed / category.total) * 100}
                className="h-1.5"
              />

              {detailed && (
                <div className="space-y-2 mt-3">
                  {category.documents.map((doc, docIndex) => (
                    <motion key={docIndex}.div
                      key={doc.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: docIndex * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          {doc.lastUpdated && (
                            <p className="text-xs text-muted-foreground">
                              Updated:{" "}
                              {new Date(doc.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "completed" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {doc.status === "missing" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedDocs}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {documentCategories.reduce(
                (sum, cat) =>
                  sum +
                  cat.documents.filter((d) => d.status === "in-review").length,
                0,
              )}
            </p>
            <p className="text-xs text-muted-foreground">In Review</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {totalDocs -
                completedDocs -
                documentCategories.reduce(
                  (sum, cat) =>
                    sum +
                    cat.documents.filter((d) => d.status === "in-review")
                      .length,
                  0,
                )}
            </p>
            <p className="text-xs text-muted-foreground">Missing</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            View All Documents
          </Button>
          <Button className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
