
interface UserGrowthChartProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

export default function UserGrowthChart() {
  // Mock data - replace with actual chart implementation
  const growth = {
    daily: "+127",
    weekly: "+892",
    monthly: "+3,421",
    percentChange: "+12.5%",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </div>
          <Tabs defaultValue="monthly" className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs px-2 py-1">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-2 py-1">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-2 py-1">
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          {/* Replace with actual chart component like Recharts */}
          <div className="text-center">
            <p className="text-3xl font-bold">{growth.monthly}</p>
            <p className="text-sm text-gray-600 mt-1">New users this month</p>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {growth.percentChange}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
