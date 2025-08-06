
interface IntelligenceDashboardProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { NLPChatInterface } from "@/components/intelligence/NLPChatInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Brain,
  Sparkles,
  BarChart3,
} from "lucide-react";

// This would normally come from your API
const stats = {
  mojosolo: {
    totalTranscripts: 1691,
    atRiskClients: 205,
    revenueAtRisk: "$25.6M",
    opportunities: 277,
    briefIssues: 1691,
    avgSentiment: 0.65,
  },
  exitPlanning: {
    totalDocuments: 103,
    frameworks: 42,
    caseStudies: 28,
    bestPractices: 156,
    assessmentTools: 31,
  },
};

export default function IntelligenceDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Intelligence Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            ML/VDB System Active
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mojosolo">MojoSolo Intelligence</TabsTrigger>
          <TabsTrigger value="exitplanning">Exit Planning</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  At-Risk Revenue
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.mojosolo.revenueAtRisk}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.mojosolo.atRiskClients} clients need attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Opportunities
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.mojosolo.opportunities}
                </div>
                <p className="text-xs text-muted-foreground">
                  High-value meetings identified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Brief Issues
                </CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.mojosolo.briefIssues}
                </div>
                <p className="text-xs text-muted-foreground">
                  Meetings need clarity improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Knowledge Base
                </CardTitle>
                <Brain className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.exitPlanning.frameworks +
                    stats.exitPlanning.bestPractices}
                </div>
                <p className="text-xs text-muted-foreground">
                  Frameworks & best practices
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
                <CardDescription>
                  AI-discovered patterns from your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Critical Client Alert</p>
                    <p className="text-sm text-muted-foreground">
                      &quot;MMMM-130&quot; has 0% sentiment score and
                      hasn&apos;t engaged in 30 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Growth Opportunity</p>
                    <p className="text-sm text-muted-foreground">
                      12 clients discussing expansion plans worth $2.3M
                      potential
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pattern Detected</p>
                    <p className="text-sm text-muted-foreground">
                      Meetings with clear agendas have 82% higher satisfaction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Summary</CardTitle>
                <CardDescription>
                  ML pipeline performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MojoSolo Transcripts</span>
                    <span className="text-sm font-medium">1,691 / 2,318</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "73%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exit Planning Docs</span>
                    <span className="text-sm font-medium">103 / 107</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "96%" }}
                    />
                  </div>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-medium">$6.20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost Savings</span>
                    <span className="font-medium text-green-600">75.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Vectors Stored
                    </span>
                    <span className="font-medium">1,794</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mojosolo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>MojoSolo Agency Intelligence</CardTitle>
                <CardDescription>
                  Real-time insights from 1,691 processed meeting transcripts
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <NLPChatInterface
                  namespace="mojosolo-transcripts"
                  onInsightFound={(insight) => {
                    console.log("New insight:", insight);
                  }}
                />
              </CardContent>
            </Card>
            <div className="col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Critical Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        client: "MMMM-130",
                        risk: "No engagement",
                        revenue: "$125k",
                      },
                      {
                        client: "David & Chas - MojoMosaic",
                        risk: "Content concerns",
                        revenue: "$85k",
                      },
                      {
                        client: "MMMM-85",
                        risk: "Document errors",
                        revenue: "$95k",
                      },
                    ].map((alert) => (
                      <div key={index}
                        key={alert.client}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{alert.client}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.risk}
                          </p>
                        </div>
                        <Badge variant="destructive">{alert.revenue}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { opportunity: "Demo site development", value: "$150k" },
                      { opportunity: "Team workshops", value: "$120k" },
                      { opportunity: "AI presentations", value: "$180k" },
                    ].map((opp) => (
                      <div key={index}
                        key={opp.opportunity}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <p className="text-sm">{opp.opportunity}</p>
                        <Badge variant="default">{opp.value}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exitplanning" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Exit Planning Knowledge Base</CardTitle>
                <CardDescription>
                  Julie Keyes&apos; expertise from 103 processed documents
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <NLPChatInterface
                  namespace="exit-planning-documents"
                  onInsightFound={(insight) => {
                    console.log("Exit planning insight:", insight);
                  }}
                />
              </CardContent>
            </Card>
            <div className="col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm">Frameworks</span>
                      </div>
                      <Badge>{stats.exitPlanning.frameworks}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Case Studies</span>
                      </div>
                      <Badge>{stats.exitPlanning.caseStudies}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">Best Practices</span>
                      </div>
                      <Badge>{stats.exitPlanning.bestPractices}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm">Assessment Tools</span>
                      </div>
                      <Badge>{stats.exitPlanning.assessmentTools}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>MojoSolo Intelligence Chat</CardTitle>
                <CardDescription>
                  Query your meeting transcripts
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px]">
                <NLPChatInterface namespace="mojosolo-transcripts" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Exit Planning Knowledge Chat</CardTitle>
                <CardDescription>Query exit planning documents</CardDescription>
              </CardHeader>
              <CardContent className="h-[600px]">
                <NLPChatInterface namespace="exit-planning-documents" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
