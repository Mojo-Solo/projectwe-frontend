import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  HardDrive,
  FileText,
  TrendingUp,
  Shield,
} from "lucide-react";

interface WorkspaceStatsProps {
  stats: {
    totalWorkspaces: number;
    activeWorkspaces: number;
    avgUsersPerWorkspace: number;
    totalStorage: string;
    avgDocuments: number;
    topPlan: string;
  };
}

export default function WorkspaceStats({ stats }: WorkspaceStatsProps) {
  const statCards = [
    {
      title: "Total Workspaces",
      value: stats.totalWorkspaces.toLocaleString(),
      icon: Building2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Workspaces",
      value: stats.activeWorkspaces.toLocaleString(),
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Avg Users/Workspace",
      value: stats.avgUsersPerWorkspace.toFixed(1),
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Storage",
      value: stats.totalStorage,
      icon: HardDrive,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Avg Documents",
      value: stats.avgDocuments.toString(),
      icon: FileText,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Most Popular Plan",
      value: stats.topPlan,
      icon: Shield,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-lg ${stat.color} mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
