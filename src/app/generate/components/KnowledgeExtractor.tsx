"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Brain,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ExtractionSource {
  id: string;
  type: "document" | "sme" | "process";
  name: string;
  status: "pending" | "processing" | "complete";
  progress: number;
  extractedValue: string;
  insights: number;
}

export function KnowledgeExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [sources] = useState<ExtractionSource[]>([
    {
      id: "1",
      type: "document",
      name: "Julie Keyes Exit Planning PDFs",
      status: "complete",
      progress: 100,
      extractedValue: "$840K",
      insights: 103,
    },
    {
      id: "2",
      type: "sme",
      name: "Senior Exit Advisors",
      status: "processing",
      progress: 67,
      extractedValue: "$520K",
      insights: 45,
    },
    {
      id: "3",
      type: "process",
      name: "Deal Flow Optimization",
      status: "pending",
      progress: 0,
      extractedValue: "$280K",
      insights: 0,
    },
  ]);

  const [totalValue, setTotalValue] = useState(0);
  const [totalInsights, setTotalInsights] = useState(0);

  useEffect(() => {
    const completedSources = sources.filter((s) => s.status === "complete");
    const value = completedSources.reduce((sum, source) => {
      return sum + parseInt(source.extractedValue.replace(/[$K,]/g, "")) * 1000;
    }, 0);
    const insights = completedSources.reduce(
      (sum, source) => sum + source.insights,
      0,
    );

    setTotalValue(value);
    setTotalInsights(insights);
  }, [sources]);

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "sme":
        return Users;
      case "process":
        return Brain;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600";
      case "processing":
        return "text-blue-600";
      case "pending":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const startExtraction = () => {
    setIsExtracting(true);
    // Simulate extraction process
    setTimeout(() => setIsExtracting(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Knowledge Extraction
        </h2>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Brain className="w-4 h-4" />
          AI Powered
        </div>
      </div>

      {/* Value Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${(totalValue / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-green-700">Extracted Value</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {totalInsights}
          </div>
          <div className="text-sm text-blue-700">Knowledge Insights</div>
        </div>
      </div>

      {/* Extraction Sources */}
      <div className="space-y-4 mb-6">
        {sources.map((source) => {
          const Icon = getIcon(source.type);
          const statusColor = getStatusColor(source.status);

          return (
            <div key={index}
              key={source.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${statusColor}`} />
                  <span className="font-medium text-gray-900">
                    {source.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {source.status === "complete" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {source.status === "processing" && (
                    <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  <span className={`text-sm font-medium ${statusColor}`}>
                    {source.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    source.status === "complete"
                      ? "bg-green-500"
                      : source.status === "processing"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                  }`}
                  style={{ width: `${source.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>{source.insights} insights extracted</span>
                <span className="font-semibold text-green-600">
                  {source.extractedValue} value
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Interview Simulator */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          🤖 AI SME Interview
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Our AI conducts structured interviews with your subject matter experts
          to extract tacit knowledge.
        </p>
        <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
          <strong>Current Question:</strong> &quot;Walk me through your most
          challenging exit scenario and how you resolved the valuation
          discrepancy...&quot;
        </div>
      </div>

      {/* Extraction Controls */}
      <div className="space-y-4">
        <button
          onClick={startExtraction}
          disabled={isExtracting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isExtracting ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Extracting Knowledge...
            </>
          ) : (
            <>
              Start Knowledge Extraction
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Extraction Methods */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <FileText className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <div className="font-medium">Document Analysis</div>
            <div className="text-gray-500">PDF processing</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <Users className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <div className="font-medium">SME Interviews</div>
            <div className="text-gray-500">Guided extraction</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <Brain className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <div className="font-medium">Process Mining</div>
            <div className="text-gray-500">Workflow analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
}
