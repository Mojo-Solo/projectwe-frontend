import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface BillingMetricsProps {
  metrics: {
    mrr: number;
    arr: number;
    avgRevenuePerUser: number;
    churnRate: number;
    ltv: number;
    totalSubscriptions: number;
    trialConversions: number;
    failedPayments: number;
  };
}

export default function BillingMetrics({ metrics }: BillingMetricsProps) {
  const metricCards = [
    {
      title: "Monthly Recurring Revenue",
      value: `$${metrics.mrr.toLocaleString()}`,
      change: "+23.8%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Annual Recurring Revenue",
      value: `$${metrics.arr.toLocaleString()}`,
      change: "+28.4%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Average Revenue Per User",
      value: `$${metrics.avgRevenuePerUser}`,
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Churn Rate",
      value: `${metrics.churnRate}%`,
      change: "-0.3%",
      trend: "down",
      icon: ArrowDownRight,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Customer Lifetime Value",
      value: `$${metrics.ltv.toLocaleString()}`,
      change: "+12.1%",
      trend: "up",
      icon: DollarSign,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Active Subscriptions",
      value: metrics.totalSubscriptions.toLocaleString(),
      change: "+8.7%",
      trend: "up",
      icon: CreditCard,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Trial Conversion Rate",
      value: `${metrics.trialConversions}%`,
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-teal-100 text-teal-600",
    },
    {
      title: "Failed Payments",
      value: metrics.failedPayments.toString(),
      change: "+3",
      trend: "up",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              {metric.trend && (
                <div
                  className={`flex items-center text-sm ${
                    metric.trend === "up"
                      ? metric.title.includes("Churn") ||
                        metric.title.includes("Failed")
                        ? "text-red-600"
                        : "text-green-600"
                      : "text-green-600"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
