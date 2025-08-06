import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMetricsCard from "@/components/admin/dashboard/MetricsCard";
import UserGrowthChart from "@/components/admin/dashboard/UserGrowthChart";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import SystemHealthMonitor from "@/components/admin/dashboard/SystemHealthMonitor";
import AIUsageStats from "@/components/admin/dashboard/AIUsageStats";
import SupportTicketOverview from "@/components/admin/dashboard/SupportTicketOverview";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  // Fetch dashboard data (placeholder)
  const metrics = {
    totalUsers: 12847,
    activeUsers: 8923,
    totalWorkspaces: 3421,
    revenue: 458923,
    userGrowth: 12.5,
    revenueGrowth: 23.8,
    activeSubscriptions: 2841,
    trialConversions: 34.2,
  };

  const systemHealth = {
    apiUptime: 99.98,
    avgResponseTime: 142,
    errorRate: 0.02,
    activeJobs: 23,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricsCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          change={`+${metrics.userGrowth}%`}
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <AdminMetricsCard
          title="Active Workspaces"
          value={metrics.totalWorkspaces.toLocaleString()}
          change="+8.3%"
          trend="up"
          icon={<Building2 className="h-4 w-4" />}
        />
        <AdminMetricsCard
          title="Monthly Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          change={`+${metrics.revenueGrowth}%`}
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <AdminMetricsCard
          title="Trial Conversion"
          value={`${metrics.trialConversions}%`}
          change="+2.1%"
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <RevenueChart />
      </div>

      {/* System Health and AI Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SystemHealthMonitor health={systemHealth} />
        <AIUsageStats />
        <SupportTicketOverview />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
          <CardDescription>
            Latest actions performed by administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
}