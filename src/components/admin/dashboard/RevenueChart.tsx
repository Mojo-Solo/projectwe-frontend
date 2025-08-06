
interface RevenueChartProps {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

export default function RevenueChart() {
  const revenue = {
    mrr: "$458,923",
    arr: "$5,507,076",
    growth: "+23.8%",
    projectedMrr: "$523,000",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Monthly and annual recurring revenue
            </CardDescription>
          </div>
          <Select defaultValue="2024">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-600">MRR</p>
              <p className="text-2xl font-bold mt-1">{revenue.mrr}</p>
              <p className="text-sm text-blue-600 mt-1">{revenue.growth}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-600">ARR</p>
              <p className="text-2xl font-bold mt-1">{revenue.arr}</p>
              <p className="text-sm text-green-600 mt-1">
                Projected: {revenue.projectedMrr}
              </p>
            </div>
          </div>

          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Replace with actual chart component */}
            <div className="text-center text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Revenue chart visualization</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
