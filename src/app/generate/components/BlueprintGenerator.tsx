"use client";

import { useState } from "react";
import {
  Zap,
  GitBranch,
  Target,
  Users,
  Code,
  Database,
  Cloud,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface BlueprintStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "complete" | "blocked";
  duration: string;
  dependencies: string[];
  components: string[];
}

interface AIPath {
  id: string;
  name: string;
  confidence: number;
  complexity: "low" | "medium" | "high";
  roi: string;
  timeline: string;
}

export function BlueprintGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>("");

  const aiPaths: AIPath[] = [
    {
      id: "saas-first",
      name: "SaaS-First Approach",
      confidence: 94,
      complexity: "medium",
      roi: "$2.3M annually",
      timeline: "6 months",
    },
    {
      id: "licensing-model",
      name: "IP Licensing Model",
      confidence: 87,
      complexity: "low",
      roi: "$960K annually",
      timeline: "3 months",
    },
    {
      id: "ai-marketplace",
      name: "AI Marketplace Play",
      confidence: 76,
      complexity: "high",
      roi: "$4.1M annually",
      timeline: "12 months",
    },
  ];

  const blueprintSteps: BlueprintStep[] = [
    {
      id: "1",
      title: "Knowledge Architecture",
      description: "Structure extracted knowledge into AI-ready formats",
      status: "complete",
      duration: "2 weeks",
      dependencies: [],
      components: ["Vector Database", "Knowledge Graph", "Semantic Layer"],
    },
    {
      id: "2",
      title: "AI Model Development",
      description: "Create domain-specific AI models from extracted knowledge",
      status: "in-progress",
      duration: "4 weeks",
      dependencies: ["Knowledge Architecture"],
      components: ["RAG System", "Fine-tuned Models", "Inference Engine"],
    },
    {
      id: "3",
      title: "Platform Integration",
      description: "Build user-facing platform with AI capabilities",
      status: "pending",
      duration: "6 weeks",
      dependencies: ["AI Model Development"],
      components: ["Web App", "API Layer", "User Management"],
    },
    {
      id: "4",
      title: "Revenue Activation",
      description: "Launch monetization channels and customer acquisition",
      status: "pending",
      duration: "3 weeks",
      dependencies: ["Platform Integration"],
      components: ["Billing System", "Licensing Portal", "Analytics"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const generateBlueprint = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Blueprint Generator
        </h2>
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <Zap className="w-4 h-4" />
          AI Orchestrated
        </div>
      </div>

      {/* AI Path Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔮 AI-Discovered Paths
        </h3>
        <div className="space-y-3">
          {aiPaths.map((path) => (
            <div key={index}
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedPath === path.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{path.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(path.complexity)}`}
                  >
                    {path.complexity}
                  </span>
                  <div className="text-sm text-gray-600">
                    {path.confidence}% confidence
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-semibold text-green-600">{path.roi}</span>
                <span>{path.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blueprint Steps */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏗️ Implementation Blueprint
        </h3>
        <div className="space-y-4">
          {blueprintSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < blueprintSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
              )}

              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {step.components.map((component, idx) => (
                      <span key={idx}
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture Preview */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          🏛️ Technical Architecture
        </h4>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center p-2 bg-white rounded">
            <Database className="w-4 h-4 mx-auto mb-1 text-blue-600" />
            <div className="font-medium">Vector DB</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <Code className="w-4 h-4 mx-auto mb-1 text-green-600" />
            <div className="font-medium">API Layer</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <Cloud className="w-4 h-4 mx-auto mb-1 text-purple-600" />
            <div className="font-medium">Cloud Infra</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <Shield className="w-4 h-4 mx-auto mb-1 text-red-600" />
            <div className="font-medium">Security</div>
          </div>
        </div>
      </div>

      {/* Chaos Navigation */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          🧭 Navigating Organizational Chaos
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3 h-3 text-orange-600" />
            <span>AI identifies 14 conflicting stakeholder priorities</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-red-600" />
            <span>Optimizes for 3 critical success metrics simultaneously</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-purple-600" />
            <span>Balances technical debt with business velocity</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateBlueprint}
        disabled={isGenerating || !selectedPath}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Clock className="w-4 h-4 animate-spin" />
            Generating Blueprint...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Generate Executable Blueprint
          </>
        )}
      </button>
    </div>
  );
}
