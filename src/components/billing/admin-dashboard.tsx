"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/stripe/client";
import { PLANS } from "@/types/billing";

interface CustomerSubscription {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  plan: string;
  status: string;
  mrr: number;
  createdAt: Date;
  currentPeriodEnd: Date;
}

interface RevenueMetrics {
  mrr: number;
  arr: number;
  newMrrThisMonth: number;
  churnedMrrThisMonth: number;
  netRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  churnRate: number;
}

export function AdminBillingDashboard() {
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>(
    [],
  );
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    try {
      // Fetch subscriptions
      const subsResponse = await fetch("/api/admin/billing/subscriptions");
      if (subsResponse.ok) {
        const data = await subsResponse.json();
        setSubscriptions(data.subscriptions);
      }

      // Fetch metrics
      const metricsResponse = await fetch("/api/admin/billing/metrics");
      if (metricsResponse.ok) {
        const data = await metricsResponse.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch admin billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/admin/billing/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "csv",
          dateRange: "last_30_days",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `billing-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Recurring Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.mrr)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(metrics.newMrrThisMonth)} this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.activeSubscriptions}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.trialSubscriptions} in trial
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.churnRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                -{formatCurrency(metrics.churnedMrrThisMonth)} MRR lost
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.netRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Subscriptions</CardTitle>
              <CardDescription>
                Manage and monitor all customer subscriptions
              </CardDescription>
            </div>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {Object.keys(PLANS).map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {PLANS[plan as keyof typeof PLANS].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscriptions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {subscription.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PLANS[subscription.plan as keyof typeof PLANS]?.name ||
                        subscription.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "default"
                          : subscription.status === "trialing"
                            ? "secondary"
                            : subscription.status === "past_due"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(subscription.mrr)}</TableCell>
                  <TableCell>
                    {format(new Date(subscription.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(subscription.currentPeriodEnd),
                      "MMM d, yyyy",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Handle view/edit subscription
                        console.log("View subscription:", subscription.id);
                      }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
