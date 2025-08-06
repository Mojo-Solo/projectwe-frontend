"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Building,
  Zap,
  ArrowUpRight,
  PieChart,
  Clock,
  Target,
} from "lucide-react";

interface RevenueStream {
  id: string;
  name: string;
  model: string;
  monthlyRevenue: number;
  growth: number;
  customers: number;
  margin: number;
  timeToLaunch: string;
  confidence: number;
}

interface MonetizationMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
}

export function MonetizationEngine() {
  const [selectedStreams, setSelectedStreams] = useState<string[]>([
    "licensing",
    "saas",
  ]);
  const [timeframe, setTimeframe] = useState("12-months");

  const revenueStreams: RevenueStream[] = [
    {
      id: "licensing",
      name: "Advisor Licensing",
      model: "B2B Licensing",
      monthlyRevenue: 80000,
      growth: 15,
      customers: 45,
      margin: 85,
      timeToLaunch: "30 days",
      confidence: 94,
    },
    {
      id: "saas",
      name: "SaaS Platform",
      model: "Subscription",
      monthlyRevenue: 42000,
      growth: 25,
      customers: 120,
      margin: 78,
      timeToLaunch: "90 days",
      confidence: 87,
    },
    {
      id: "data-sales",
      name: "AI Training Data",
      model: "Data Licensing",
      monthlyRevenue: 70000,
      growth: 8,
      customers: 8,
      margin: 95,
      timeToLaunch: "14 days",
      confidence: 91,
    },
    {
      id: "consulting",
      name: "AI Implementation",
      model: "Professional Services",
      monthlyRevenue: 35000,
      growth: 18,
      customers: 12,
      margin: 65,
      timeToLaunch: "7 days",
      confidence: 89,
    },
  ];

  const metrics: MonetizationMetric[] = [
    {
      label: "Monthly Recurring Revenue",
      value:
        "$" +
        selectedStreams
          .reduce((sum, id) => {
            const stream = revenueStreams.find((s) => s.id === id);
            return sum + (stream?.monthlyRevenue || 0);
          }, 0)
          .toLocaleString(),
      change: "+127%",
      positive: true,
      icon: DollarSign,
    },
    {
      label: "Customer Acquisition",
      value:
        selectedStreams
          .reduce((sum, id) => {
            const stream = revenueStreams.find((s) => s.id === id);
            return sum + (stream?.customers || 0);
          }, 0)
          .toString() + " customers",
      change: "+89%",
      positive: true,
      icon: Users,
    },
    {
      label: "Average Margin",
      value:
        Math.round(
          selectedStreams.reduce((sum, id) => {
            const stream = revenueStreams.find((s) => s.id === id);
            return sum + (stream?.margin || 0);
          }, 0) / selectedStreams.length,
        ) + "%",
      change: "+12%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Time to Revenue",
      value:
        Math.min(
          ...selectedStreams.map((id) => {
            const stream = revenueStreams.find((s) => s.id === id);
            return parseInt(stream?.timeToLaunch.split(" ")[0] || "0");
          }),
        ) + " days",
      change: "-67%",
      positive: true,
      icon: Clock,
    },
  ];

  const calculateAnnualRevenue = () => {
    return selectedStreams.reduce((sum, id) => {
      const stream = revenueStreams.find((s) => s.id === id);
      if (!stream) return sum;

      // Apply growth over 12 months
      const growthFactor = Math.pow(1 + stream.growth / 100, 12);
      return sum + stream.monthlyRevenue * 12 * growthFactor;
    }, 0);
  };

  const toggleStream = (streamId: string) => {
    setSelectedStreams((prev) =>
      prev.includes(streamId)
        ? prev.filter((id) => id !== streamId)
        : [...prev, streamId],
    );
  };

  return (
    <div key={index} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Monetization Engine
        </h2>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <DollarSign className="w-4 h-4" />
          Revenue Optimized
        </div>
      </div>

      {/* Annual Revenue Projection */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ${(calculateAnnualRevenue() / 1000000).toFixed(1)}M
        </div>
        <div className="text-gray-600">Projected Annual Revenue</div>
        <div className="text-sm text-green-600 font-medium">
          ↗ Based on selected streams
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index}
              key={index}
              className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {metric.label}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {metric.value}
              </div>
              <div
                className={`text-xs font-medium ${metric.positive ? "text-green-600" : "text-red-600"}`}
              >
                {metric.change} vs baseline
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Streams */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Revenue Stream Selection
        </h3>
        <div className="space-y-3">
          {revenueStreams.map((stream) => {
            const isSelected = selectedStreams.includes(stream.id);

            return (
              <div key={index}
                key={stream.id}
                onClick={() => toggleStream(stream.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {stream.name}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {stream.model}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${stream.monthlyRevenue.toLocaleString()}/mo
                    </div>
                    <div className="text-sm text-gray-500">
                      {stream.confidence}% confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Growth</div>
                    <div className="font-medium text-blue-600">
                      +{stream.growth}%/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Customers</div>
                    <div className="font-medium">{stream.customers}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Margin</div>
                    <div className="font-medium text-green-600">
                      {stream.margin}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Launch</div>
                    <div className="font-medium text-purple-600">
                      {stream.timeToLaunch}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          Revenue Breakdown (12 months)
        </h4>
        <div className="space-y-2">
          {selectedStreams.map((id) => {
            const stream = revenueStreams.find((s) => s.id === id);
            if (!stream) return null;

            const growthFactor = Math.pow(1 + stream.growth / 100, 12);
            const annualRevenue = stream.monthlyRevenue * 12 * growthFactor;
            const percentage = (annualRevenue / calculateAnnualRevenue()) * 100;

            return (
              <div key={index}
                key={id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{stream.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    ${(annualRevenue / 1000).toFixed(0)}K
                  </span>
                  <span className="text-gray-500">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WeExit Success Factors */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          🎯 WeExit Success Factors
        </h4>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-blue-600" />
            <span>
              <strong>Domain Expertise:</strong> 20+ years exit planning
              knowledge
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3 text-purple-600" />
            <span>
              <strong>Market Demand:</strong> 500+ advisors need AI tools
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-green-600" />
            <span>
              <strong>AI Advantage:</strong> Structured knowledge = competitive
              moat
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={selectedStreams.length === 0}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <DollarSign className="w-4 h-4" />
        Activate Revenue Streams
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}
