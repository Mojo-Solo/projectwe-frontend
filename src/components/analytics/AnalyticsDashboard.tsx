"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  MultiLineChart,
  MetricCard,
} from "./charts/ChartComponents";
import {
  Activity,
  Users,
  FileText,
  Brain,
  TrendingUp,
  Clock,
} from "lucide-react";
import { ExportDialog } from "./ExportDialog";

interface AnalyticsData {
  userBehavior: {
    pageViews: number;
    uniqueUsers: number;
    avgSessionDuration: number;
    bounceRate: number;
    topPages: { page: string; views: number }[];
    userFlow: { from: string; to: string; count: number }[];
  };
  documentMetrics: {
    totalDocuments: number;
    documentsAnalyzed: number;
    avgProcessingTime: number;
    documentTypes: { type: string; count: number }[];
  };
  aiInteractions: {
    totalQueries: number;
    avgResponseTime: number;
    satisfactionRate: number;
    topQueries: { query: string; count: number }[];
  };
  businessMetrics: {
    valuationsCalculated: number;
    reportsGenerated: number;
    avgValuationTime: number;
    conversionRate: number;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <ExportDialog
            data={{
              userEngagement: {
                uniqueUsers: data.userBehavior.uniqueUsers,
                totalSessions: data.userBehavior.uniqueUsers, // Approximation
                avgSessionDuration: data.userBehavior.avgSessionDuration,
                pageViews: data.userBehavior.pageViews,
                bounceRate: data.userBehavior.bounceRate,
                topPages: data.userBehavior.topPages.map((p) => ({
                  path: p.page,
                  views: p.views,
                  avgDuration: 0,
                })),
                userGrowth: [],
              },
              documentUsage: {
                totalDocuments: data.documentMetrics.totalDocuments,
                documentsViewed: data.documentMetrics.documentsAnalyzed,
                documentsAnalyzed: data.documentMetrics.documentsAnalyzed,
                avgProcessingTime:
                  data.documentMetrics.avgProcessingTime * 1000,
                topDocumentTypes: data.documentMetrics.documentTypes.map(
                  (t) => ({ type: t.type, count: t.count }),
                ),
                documentActivity: [],
              },
              aiInteractions: {
                totalQueries: data.aiInteractions.totalQueries,
                avgResponseTime: data.aiInteractions.avgResponseTime,
                satisfactionRate: data.aiInteractions.satisfactionRate / 20,
                tokenUsage: 0,
                totalCost: 0,
                topQueryTypes: data.aiInteractions.topQueries.map((q) => ({
                  type: q.query,
                  count: q.count,
                  avgSatisfaction: 4.5,
                })),
                interactionTrends: [],
              },
              businessMetrics: {
                valuationsCalculated: data.businessMetrics.valuationsCalculated,
                reportsGenerated: data.businessMetrics.reportsGenerated,
                conversionRate: data.businessMetrics.conversionRate,
                avgValuationTime: data.businessMetrics.avgValuationTime,
                funnelMetrics: [],
                businessGrowth: [],
              },
              exitPlanning: {
                activeProjects: 0,
                completedProjects: 0,
                avgProjectDuration: 90,
                exitStrategies: [],
                projectProgress: [],
              },
            }}
            timeRange={timeRange}
            organizationName="ProjectWE"
            onExport={(format) => console.log(`Exported as ${format}`)}
          />
          <select key={index}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={data.userBehavior.uniqueUsers}
          change={12}
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />

        <MetricCard
          title="Page Views"
          value={data.userBehavior.pageViews}
          change={8}
          trend="up"
          icon={<Activity className="h-6 w-6" />}
        />

        <MetricCard
          title="Documents Analyzed"
          value={data.documentMetrics.documentsAnalyzed}
          changeLabel={`${data.documentMetrics.avgProcessingTime.toFixed(1)}s avg time`}
          icon={<FileText className="h-6 w-6" />}
        />

        <MetricCard
          title="AI Queries"
          value={data.aiInteractions.totalQueries}
          change={data.aiInteractions.satisfactionRate}
          changeLabel="satisfaction rate"
          format="percentage"
          icon={<Brain className="h-6 w-6" />}
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="behavior" className="space-y-4">
        <TabsList>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai">AI Interactions</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>
                  Most visited pages on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.userBehavior.topPages.map((page) => ({
                    category:
                      page.page.replace("/", "").replace("-", " ") || "Home",
                    value: page.views,
                  }))}
                  title="Page Views"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card key={index}>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
                <CardDescription>User engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart
                  data={[
                    {
                      category: "Engaged Sessions",
                      value: 100 - data.userBehavior.bounceRate,
                    },
                    {
                      category: "Bounced Sessions",
                      value: data.userBehavior.bounceRate,
                    },
                  ]}
                  centerText="Sessions"
                  height={300}
                />
                <div className="mt-4 space-y-2">
                  <MetricCard
                    title="Avg Session Duration"
                    value={`${Math.floor(data.userBehavior.avgSessionDuration / 60)}m ${data.userBehavior.avgSessionDuration % 60}s`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of analyzed documents by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={data.documentMetrics.documentTypes.map((type) => ({
                    category: type.type,
                    value: type.count,
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card key={index}>
              <CardHeader>
                <CardTitle>Document Processing</CardTitle>
                <CardDescription>Document processing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricCard
                    title="Total Documents"
                    value={data.documentMetrics.totalDocuments}
                    icon={<FileText className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Processing Time"
                    value={data.documentMetrics.avgProcessingTime}
                    format="duration"
                    icon={<Clock className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Analysis Rate"
                    value={
                      (data.documentMetrics.documentsAnalyzed /
                        data.documentMetrics.totalDocuments) *
                      100
                    }
                    format="percentage"
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top AI Queries</CardTitle>
                <CardDescription>Most common questions asked</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.aiInteractions.topQueries.map((query) => ({
                    category: query.query,
                    value: query.count,
                  }))}
                  title="Query Count"
                  horizontal={true}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card key={index}>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
                <CardDescription>
                  Response time and satisfaction metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricCard
                    title="Avg Response Time"
                    value={data.aiInteractions.avgResponseTime}
                    format="duration"
                    icon={<Clock className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Satisfaction Rate"
                    value={data.aiInteractions.satisfactionRate}
                    format="percentage"
                    trend="up"
                    icon={<Brain className="h-6 w-6" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Activity</CardTitle>
                <CardDescription>Key business metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricCard
                    title="Valuations Calculated"
                    value={data.businessMetrics.valuationsCalculated}
                    trend="up"
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Reports Generated"
                    value={data.businessMetrics.reportsGenerated}
                    trend="up"
                    icon={<FileText className="h-6 w-6" />}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
                <CardDescription>User journey completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MetricCard
                    title="Conversion Rate"
                    value={data.businessMetrics.conversionRate}
                    format="percentage"
                    trend="up"
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Avg Valuation Time"
                    value={data.businessMetrics.avgValuationTime}
                    format="duration"
                    icon={<Clock className="h-6 w-6" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
