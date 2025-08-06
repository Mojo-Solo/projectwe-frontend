"use client";

import { Radar, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface ReadinessVisualizationProps {
  readinessData?: {
    financial: number;
    operations: number;
    legal: number;
    market: number;
    management: number;
    strategic: number;
  };
  historicalData?: Array<{
    month: string;
    score: number;
  }>;
}

export function ReadinessVisualization({
  readinessData = {
    financial: 75,
    operations: 82,
    legal: 68,
    market: 90,
    management: 72,
    strategic: 85,
  },
  historicalData = [
    { month: "Jan", score: 62 },
    { month: "Feb", score: 65 },
    { month: "Mar", score: 68 },
    { month: "Apr", score: 71 },
    { month: "May", score: 74 },
    { month: "Jun", score: 78 },
  ],
}: ReadinessVisualizationProps) {
  const overallScore = Math.round(
    Object.values(readinessData).reduce((a, b) => a + b, 0) /
      Object.keys(readinessData).length,
  );

  const radarData = {
    labels: [
      "Financial",
      "Operations",
      "Legal",
      "Market",
      "Management",
      "Strategic",
    ],
    datasets: [
      {
        label: "Current Readiness",
        data: Object.values(readinessData),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      },
      {
        label: "Target Readiness",
        data: [90, 90, 90, 90, 90, 90],
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.5)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(34, 197, 94, 0.5)",
        pointBorderColor: "#fff",
      },
    ],
  };

  const radarOptions: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ": " + context.parsed.r + "%";
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const barData = {
    labels: Object.keys(readinessData).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1),
    ),
    datasets: [
      {
        label: "Readiness Score",
        data: Object.values(readinessData),
        backgroundColor: Object.values(readinessData).map((score) =>
          score >= 80
            ? "rgba(34, 197, 94, 0.8)"
            : score >= 60
              ? "rgba(251, 146, 60, 0.8)"
              : "rgba(239, 68, 68, 0.8)",
        ),
        borderWidth: 0,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y + "%";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const doughnutData = {
    labels: ["Ready", "Needs Improvement"],
    datasets: [
      {
        data: [overallScore, 100 - overallScore],
        backgroundColor: [
          overallScore >= 80
            ? "rgba(34, 197, 94, 0.8)"
            : overallScore >= 60
              ? "rgba(251, 146, 60, 0.8)"
              : "rgba(239, 68, 68, 0.8)",
          "rgba(229, 231, 235, 0.5)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ": " + context.parsed + "%";
          },
        },
      },
    },
  };

  const lineData = {
    labels: historicalData.map((d) => d.month),
    datasets: [
      {
        label: "Readiness Score Trend",
        data: historicalData.map((d) => d.score),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "Score: " + context.parsed.y + "%";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Exit Readiness</CardTitle>
          <CardDescription>
            Your comprehensive readiness score across all dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto w-48 h-48">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold">{overallScore}%</p>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Visualizations */}
      <Tabs defaultValue="radar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="radar">Dimensions</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Readiness by Dimension</CardTitle>
              <CardDescription>
                Compare your current readiness against target levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Dimension Comparison</CardTitle>
              <CardDescription>
                See which areas need the most improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={barData} options={barOptions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>
                Track how your readiness has improved over the past months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={lineData} options={lineOptions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            AI-generated recommendations based on your scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(readinessData)
            .filter(([_, score]) => score < 75)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 3)
            .map(([dimension, score]) => (
              <div
                key={dimension}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    score < 50
                      ? "bg-red-500"
                      : score < 75
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {dimension} - {score}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dimension === "legal" &&
                      "Consider engaging legal counsel to review contracts and compliance."}
                    {dimension === "management" &&
                      "Strengthen your management team and document key processes."}
                    {dimension === "financial" &&
                      "Focus on improving financial reporting and EBITDA margins."}
                    {dimension === "operations" &&
                      "Streamline operations and implement efficiency improvements."}
                    {dimension === "market" &&
                      "Research market trends and identify potential acquirers."}
                    {dimension === "strategic" &&
                      "Develop a clear strategic plan for the next 3-5 years."}
                  </p>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
