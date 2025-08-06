import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AdminMetricsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export default function AdminMetricsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
}: AdminMetricsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center space-x-1 text-sm">
                {trend === "up" && (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">{change}</span>
                  </>
                )}
                {trend === "down" && (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">{change}</span>
                  </>
                )}
                {trend === "neutral" && (
                  <span className="text-gray-500">{change}</span>
                )}
                <span className="text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
