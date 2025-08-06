"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Area } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  Filler,
);

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#333",
      borderWidth: 1,
    },
  },
};

// Chart color palettes
export const chartColors = {
  primary: [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ],
  gradients: [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ],
};

interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

interface CategoryData {
  category: string;
  value: number;
  percentage?: number;
}

interface MultiSeriesData {
  date: string;
  [key: string]: string | number;
}

// Line Chart Component
interface LineChartProps {
  data: TimeSeriesData[];
  title?: string;
  color?: string;
  showArea?: boolean;
  height?: number;
}

export function LineChart({
  data,
  title,
  color = chartColors.primary[0],
  showArea = false,
  height = 300,
}: LineChartProps) {
  const chartData = {
    labels: data.map((item) => format(new Date(item.date), "MMM dd")),
    datasets: [
      {
        label: title || "Metric",
        data: data.map((item) => item.value),
        borderColor: color,
        backgroundColor: showArea ? `${color}20` : "transparent",
        fill: showArea,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return typeof value === "number" ? value.toLocaleString() : value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div key={index} style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Bar Chart Component
interface BarChartProps {
  data: CategoryData[];
  title?: string;
  color?: string;
  horizontal?: boolean;
  height?: number;
}

export function BarChart({
  data,
  title,
  color = chartColors.primary[1],
  horizontal = false,
  height = 300,
}: BarChartProps) {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: title || "Value",
        data: data.map((item) => item.value),
        backgroundColor: data.map(
          (_, index) => chartColors.primary[index % chartColors.primary.length],
        ),
        borderColor: data.map(
          (_, index) => chartColors.primary[index % chartColors.primary.length],
        ),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...commonOptions,
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    scales: {
      [horizontal ? "x" : "y"]: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return typeof value === "number" ? value.toLocaleString() : value;
          },
        },
      },
      [horizontal ? "y" : "x"]: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div key={index} style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Pie Chart Component
interface PieChartProps {
  data: CategoryData[];
  title?: string;
  height?: number;
  showPercentages?: boolean;
}

export function PieChart({
  data,
  title,
  height = 300,
  showPercentages = true,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: data.map((item) =>
      showPercentages
        ? `${item.category} (${((item.value / total) * 100).toFixed(1)}%)`
        : item.category,
    ),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: chartColors.primary,
        borderColor: "#fff",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div key={index} style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}

// Doughnut Chart Component
interface DoughnutChartProps {
  data: CategoryData[];
  title?: string;
  height?: number;
  centerText?: string;
}

export function DoughnutChart({
  data,
  title,
  height = 300,
  centerText,
}: DoughnutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: chartColors.primary,
        borderColor: "#fff",
        borderWidth: 2,
        hoverBorderWidth: 3,
        cutout: "60%",
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div key={index} style={{ height, position: "relative" }}>
      <Doughnut data={chartData} options={options} />
      {centerText && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            {total.toLocaleString()}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>{centerText}</div>
        </div>
      )}
    </div>
  );
}

// Multi-Series Line Chart Component
interface MultiLineChartProps {
  data: MultiSeriesData[];
  series: { key: string; label: string; color?: string }[];
  title?: string;
  height?: number;
}

export function MultiLineChart({
  data,
  series,
  title,
  height = 300,
}: MultiLineChartProps) {
  const chartData = {
    labels: data.map((item) => format(new Date(item.date), "MMM dd")),
    datasets: series.map((serie, index) => ({
      label: serie.label,
      data: data.map((item) => item[serie.key] as number),
      borderColor:
        serie.color || chartColors.primary[index % chartColors.primary.length],
      backgroundColor: "transparent",
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor:
        serie.color || chartColors.primary[index % chartColors.primary.length],
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const options = {
    ...commonOptions,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return typeof value === "number" ? value.toLocaleString() : value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div key={index} style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Stacked Bar Chart Component
interface StackedBarChartProps {
  data: MultiSeriesData[];
  series: { key: string; label: string; color?: string }[];
  title?: string;
  height?: number;
}

export function StackedBarChart({
  data,
  series,
  title,
  height = 300,
}: StackedBarChartProps) {
  const chartData = {
    labels: data.map((item) => format(new Date(item.date), "MMM dd")),
    datasets: series.map((serie, index) => ({
      label: serie.label,
      data: data.map((item) => item[serie.key] as number),
      backgroundColor:
        serie.color || chartColors.primary[index % chartColors.primary.length],
      borderColor:
        serie.color || chartColors.primary[index % chartColors.primary.length],
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    })),
  };

  const options = {
    ...commonOptions,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return typeof value === "number" ? value.toLocaleString() : value;
          },
        },
      },
    },
  };

  return (
    <div key={index} style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Metric Card with Trend
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  format?: "number" | "currency" | "percentage" | "duration";
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  trend = "neutral",
  icon,
  format = "number",
}: MetricCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "duration":
        return `${val.toFixed(1)}m`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${getTrendColor()}`}>
              <span className="mr-1">{getTrendIcon()}</span>
              {change > 0 ? "+" : ""}
              {change}% {changeLabel}
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
