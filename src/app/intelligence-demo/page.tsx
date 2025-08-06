
interface IntelligenceDemoPageProps {
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

export const dynamic = 'force-dynamic';

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

export default function IntelligenceDemoPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 min-h-screen bg-background">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Intelligence Dashboard Demo
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights from your processed data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            ML/VDB System Active
          </Badge>
          <Badge variant="secondary">Demo Mode</Badge>
        </div>
      </div>

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
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
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
              Transcripts Processed
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.mojosolo.totalTranscripts}
            </div>
            <p className="text-xs text-muted-foreground">
              With 75.5% cost savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Knowledge Base
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.exitPlanning.frameworks + stats.exitPlanning.bestPractices}
            </div>
            <p className="text-xs text-muted-foreground">
              Frameworks & best practices
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="alerts">Critical Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>MojoSolo Intelligence Chat</CardTitle>
                <CardDescription>
                  Ask questions about your 1,691 meeting transcripts
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px]">
                <NLPChatInterface
                  namespace="mojosolo-transcripts"
                  apiEndpoint="http://localhost:8000/api/v1/intelligence/chat"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Exit Planning Knowledge</CardTitle>
                <CardDescription>
                  Query 103 exit planning documents from Julie Keyes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px]">
                <NLPChatInterface
                  namespace="exit-planning-documents"
                  apiEndpoint="http://localhost:8000/api/v1/intelligence/chat"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Opportunities</CardTitle>
                <CardDescription>
                  AI-identified growth potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    opportunity: "Demo site development",
                    value: "$150k",
                    confidence: 0.92,
                  },
                  {
                    opportunity: "Team-building workshops",
                    value: "$120k",
                    confidence: 0.87,
                  },
                  {
                    opportunity: "AI-enhanced presentations",
                    value: "$180k",
                    confidence: 0.94,
                  },
                ].map((opp) => (
                  <div key={opp.opportunity}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{opp.opportunity}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(opp.confidence * 100)}% confidence
                      </p>
                    </div>
                    <Badge variant="default">{opp.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Analysis</CardTitle>
                <CardDescription>
                  Discovered from transcript analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        Meeting Success Pattern
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Meetings with clear agendas have 82% higher satisfaction
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        Engagement Indicator
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Clients mentioning &quot;expansion&quot; have 3x higher
                        retention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Revenue Predictor</p>
                      <p className="text-sm text-muted-foreground">
                        Brief clarity correlates with 45% higher project value
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Critical Client Alerts
              </CardTitle>
              <CardDescription>Immediate action required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    client: "MMMM-130",
                    risk: "Zero engagement - hasn't responded in 30 days",
                    revenue: "$125k",
                    sentiment: 0.0,
                    action: "Schedule emergency retention call",
                  },
                  {
                    client: "David & Chas - MojoMosaic",
                    risk: "Concerns about content quality and PM system",
                    revenue: "$85k",
                    sentiment: 0.2,
                    action: "Address content issues immediately",
                  },
                  {
                    client: "MMMM-85",
                    risk: "Document errors, needs dedicated team",
                    revenue: "$95k",
                    sentiment: 0.2,
                    action: "Assign dedicated project manager",
                  },
                ].map((alert) => (
                  <div key={alert.client}
                    className="p-4 border border-destructive/20 rounded-lg bg-destructive/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{alert.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.risk}
                        </p>
                        <p className="text-sm font-medium text-destructive">
                          Action: {alert.action}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{alert.revenue}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sentiment: {alert.sentiment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
