"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Plus,
  ArrowUpRight,
  Clock,
  Target,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, ClientStatus, EngagementLevel } from "@/types/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardData {
  clients: Client[];
  portfolioStats: {
    overview: {
      total: number;
      active: number;
      prospects: number;
      avgEngagement: number;
      recentActivity: number;
    };
    breakdown: {
      byStatus: Record<string, number>;
      byIndustry: Record<string, number>;
      byExitStrategy: Record<string, number>;
    };
  };
  upcomingFollowUps: any[];
  recentActivities: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [engagementFilter, setEngagementFilter] = useState<EngagementLevel | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.role !== 'ADVISOR') {
      router.push('/dashboard');
      return;
    }
    loadDashboardData();
  }, [user, currentPage, statusFilter, engagementFilter, searchQuery]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (engagementFilter !== 'all') params.append('engagementLevel', engagementFilter);

      // Fetch clients
      const clientsResponse = await fetch(`/api/clients?${params}`);
      if (!clientsResponse.ok) {
        throw new Error('Failed to fetch clients');
      }
      const clientsData = await clientsResponse.json();

      // Fetch portfolio stats
      const statsResponse = await fetch('/api/clients/stats');
      const portfolioStats = statsResponse.ok ? await statsResponse.json() : null;

      // Fetch upcoming follow-ups
      const followUpsResponse = await fetch('/api/clients/follow-ups');
      const upcomingFollowUps = followUpsResponse.ok ? await followUpsResponse.json() : [];

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/clients/recent-activities');
      const recentActivities = activitiesResponse.ok ? await activitiesResponse.json() : [];

      setDashboardData({
        clients: clientsData.clients,
        portfolioStats: portfolioStats || {
          overview: { total: 0, active: 0, prospects: 0, avgEngagement: 0, recentActivity: 0 },
          breakdown: { byStatus: {}, byIndustry: {}, byExitStrategy: {} }
        },
        upcomingFollowUps,
        recentActivities,
        pagination: clientsData.pagination,
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const getStatusColor = (status: ClientStatus) => {
    const colors = {
      PROSPECT: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      ENGAGED: 'bg-purple-100 text-purple-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      INACTIVE: 'bg-red-100 text-red-800',
      CHURNED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEngagementColor = (level: EngagementLevel) => {
    const colors = {
      LOW: 'text-red-600',
      MEDIUM: 'text-yellow-600',
      HIGH: 'text-blue-600',
      VERY_HIGH: 'text-green-600',
    };
    return colors[level] || 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getExitReadinessScore = (client: Client) => {
    const intelligence = client.aiInsights as any;
    return intelligence?.exitReadinessScore || 0;
  };

  const getValuationEstimate = (client: Client) => {
    const intelligence = client.aiInsights as any;
    return intelligence?.valuationRange?.estimated || 0;
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={loadDashboardData}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { clients, portfolioStats, upcomingFollowUps, recentActivities, pagination } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Advisory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here&apos;s your client portfolio overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/clients/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioStats.overview.total}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{portfolioStats.overview.active}</span> active clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioStats.overview.prospects}</div>
            <p className="text-xs text-muted-foreground">
              Potential new clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Engagement
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioStats.overview.avgEngagement}%
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio engagement level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioStats.overview.recentActivity}
            </div>
            <p className="text-xs text-muted-foreground">
              Actions this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ClientStatus | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PROSPECT">Prospect</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ENGAGED">Engaged</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={engagementFilter} onValueChange={(value) => setEngagementFilter(value as EngagementLevel | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Engagement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="VERY_HIGH">Very High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Client Portfolio
          </CardTitle>
          <CardDescription>
            Your current client engagements and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          )}
          
          {!loading && clients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clients found matching your criteria.</p>
              <Button className="mt-4" onClick={() => router.push('/clients/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            </div>
          )}

          {!loading && clients.length > 0 && (
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={index}
                  key={client.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleClientClick(client.id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Client Info */}
                    <div>
                      <h3 className="font-semibold">{client.companyName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {client.firstName} {client.lastName} • {client.industry}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn("mt-1 text-xs", getStatusColor(client.status))}
                      >
                        {client.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Exit Readiness */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Exit Readiness
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold">
                          {getExitReadinessScore(client)}%
                        </span>
                      </div>
                    </div>

                    {/* Valuation */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Est. Valuation
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold">
                          {getValuationEstimate(client) > 0 
                            ? formatCurrency(getValuationEstimate(client))
                            : 'TBD'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Engagement Level */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Engagement
                      </p>
                      <span className={cn("font-medium", getEngagementColor(client.engagementLevel))}>
                        {client.engagementLevel.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-right mr-4">
                        <p className="text-xs text-muted-foreground">
                          Last updated
                        </p>
                        <p className="text-sm">{formatDate(client.updatedAt)}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} clients
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Follow-ups */}
      {upcomingFollowUps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingFollowUps.slice(0, 5).map((followUp: any) => (
                <div key={followUp.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{followUp.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {followUp.firstName} {followUp.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(followUp.nextFollowUpDate)}
                    </p>
                    <Badge variant="outline" className={getStatusColor(followUp.status)}>
                      {followUp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Create progress reports for your clients
            </p>
            <Button size="sm" className="w-full">
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Set up meetings with your clients
            </p>
            <Button size="sm" className="w-full">
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Practice Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View your advisory practice metrics
            </p>
            <Button size="sm" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}