"use client";

import { useState } from "react";
import {
  ChevronRight,
  Target,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";

interface SuccessMetric {
  id: string;
  label: string;
  value: string;
  icon: any;
  color: string;
}

export function SuccessDefinitionWizard() {
  const [step, setStep] = useState(1);
  const [successDefinition, setSuccessDefinition] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");

  const metrics: SuccessMetric[] = [
    {
      id: "revenue",
      label: "Revenue Growth",
      value: "$2.3M annual",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "efficiency",
      label: "Process Efficiency",
      value: "80% faster",
      icon: Target,
      color: "text-blue-600",
    },
    {
      id: "reach",
      label: "Market Reach",
      value: "500+ advisors",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: "time",
      label: "Time to Value",
      value: "90 days",
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId],
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Define Your Success
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Step {step} of 3
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What does success look like for your organization?
            </label>
            <textarea
              value={successDefinition}
              onChange={(e) => setSuccessDefinition(e.target.value)}
              placeholder="Example: Smooth business exits with maximum value for both sellers and buyers, supported by expert advisors using AI-powered tools..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Success Definition Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Focus on outcomes, not methods</li>
              <li>• Include stakeholder benefits</li>
              <li>• Be specific about impact</li>
              <li>• Think beyond just revenue</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!successDefinition.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Metrics
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How will you measure success?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const isSelected = selectedMetrics.includes(metric.id);

                return (
                  <div key={index}
                    key={metric.id}
                    onClick={() => handleMetricToggle(metric.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="font-medium text-gray-900">
                        {metric.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{metric.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedMetrics.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Set Timeline
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              When do you need to achieve this success?
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {["90 days", "6 months", "12 months"].map((option) => (
                <button key={index}
                  key={option}
                  onClick={() => setTimeline(option)}
                  className={`p-4 border-2 rounded-lg font-medium transition-all duration-200 ${
                    timeline === option
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Success Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              🎯 Your Success Definition
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Goal:</strong> {successDefinition}
              </div>
              <div>
                <strong>Metrics:</strong> {selectedMetrics.length} key
                indicators
              </div>
              <div>
                <strong>Timeline:</strong> {timeline || "Not set"}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              disabled={!timeline}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              ✨ Generate AI Blueprint
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
