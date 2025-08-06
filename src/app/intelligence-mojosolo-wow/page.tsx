"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Users,
  Brain,
  Sparkles,
  Clock,
  Target,
  Zap,
  Activity,
  Calendar,
  Download,
  Send,
  Bell,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

// Real-time client health monitoring
interface ClientHealth {
  name: string;
  revenue: string;
  sentiment: number;
  lastContact: number;
  riskScore: number;
  nextAction: string;
  trend: "up" | "down" | "stable";
}

export default function MojoSoloWowDashboard() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [predictiveInsight, setPredictiveInsight] = useState<string>("");
  const [revenueImpact, setRevenueImpact] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueImpact((prev) => prev + Math.random() * 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const criticalClients: ClientHealth[] = [
    {
      name: "MMMM-130",
      revenue: "$125k",
      sentiment: 0.0,
      lastContact: 30,
      riskScore: 95,
      nextAction: "Emergency call TODAY",
      trend: "down",
    },
    {
      name: "David & Chas - MojoMosaic",
      revenue: "$85k",
      sentiment: 0.2,
      lastContact: 7,
      riskScore: 78,
      nextAction: "Address content concerns",
      trend: "down",
    },
    {
      name: "ProjectWE Integration",
      revenue: "$150k",
      sentiment: 0.8,
      lastContact: 2,
      riskScore: 15,
      nextAction: "Upsell opportunity",
      trend: "up",
    },
  ];

  const generatePredictiveInsight = () => {
    const insights = [
      "Based on pattern analysis: Clients with <20% sentiment have 87% chance of churning within 30 days. Take action on 3 accounts NOW.",
      "Opportunity detected: 12 clients showing expansion signals. Potential revenue increase of $450k if engaged this week.",
      "Brief clarity correlation found: Meetings with structured agendas show 82% higher client satisfaction. Implement immediately.",
      "Revenue predictor: Your pipeline velocity suggests $2.3M in Q2 if current patterns continue.",
    ];
    setPredictiveInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Futuristic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MojoSolo Intelligence Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Powered by 1,691 meeting transcripts • 5,073 hours analyzed •
              $25.6M monitored
            </p>
          </div>
          <div className="flex gap-4">
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-4 py-2"
            >
              <Activity className="h-4 w-4 text-green-500" />
              LIVE
            </Badge>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Intelligence
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Real-time Revenue Impact Ticker */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        className="mb-8"
      >
        <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  AI-Identified Revenue at Risk
                </p>
                <p className="text-4xl font-bold text-destructive">
                  ${(25600000 - revenueImpact).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Saved Through Interventions
                </p>
                <p className="text-4xl font-bold text-green-600">
                  +${revenueImpact.toLocaleString()}
                </p>
              </div>
            </div>
            <Progress
              value={(revenueImpact / 25600000) * 100}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="command" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="command">Command Center</TabsTrigger>
          <TabsTrigger value="predictive">Predictive AI</TabsTrigger>
          <TabsTrigger value="automation">Auto-Actions</TabsTrigger>
          <TabsTrigger value="insights">Deep Insights</TabsTrigger>
          <TabsTrigger value="reports">Smart Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="command" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Client Health Monitor */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-Time Client Health Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalClients.map((client, index) => (
                    <motion.div
                      key={client.name}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedClient(client.name)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        client.riskScore > 70
                          ? "border-red-500/50 bg-red-500/5"
                          : client.riskScore > 40
                            ? "border-yellow-500/50 bg-yellow-500/5"
                            : "border-green-500/50 bg-green-500/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full animate-pulse ${
                              client.riskScore > 70
                                ? "bg-red-500"
                                : client.riskScore > 40
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div>
                            <p className="font-semibold">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Last contact: {client.lastContact} days ago
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{client.revenue}</p>
                          <div className="flex items-center gap-1">
                            {client.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : client.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="h-4 w-4">→</span>
                            )}
                            <span className="text-sm">
                              {(client.sentiment * 100).toFixed(0)}% sentiment
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          variant={
                            client.riskScore > 70 ? "destructive" : "secondary"
                          }
                        >
                          Risk: {client.riskScore}%
                        </Badge>
                        <p className="text-sm font-medium text-primary">
                          Action: {client.nextAction}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    <strong>NOW:</strong> Call MMMM-130 within 2 hours. 95%
                    churn probability detected.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>TODAY:</strong> Send brief clarity template to all
                    clients. Save 5,073 revision hours.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>THIS WEEK:</strong> Pitch expansion to 12
                    high-sentiment clients. $450k opportunity.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full mt-4"
                  onClick={generatePredictiveInsight}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Next Insight
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pattern Discovery */}
          <Card>
            <CardHeader>
              <CardTitle>Pattern Discovery Engine</CardTitle>
              <CardDescription>
                AI-discovered patterns from your meeting data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Meeting Success</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agendas = 82% higher satisfaction
                  </p>
                  <Progress value={82} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Retention Driver</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Weekly check-ins = 3x retention
                  </p>
                  <Progress value={75} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Revenue Predictor</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Brief clarity = 45% higher value
                  </p>
                  <Progress value={45} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Intelligence Engine</CardTitle>
              <CardDescription>
                What will happen next based on 1,691 meeting patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictiveInsight && (
                <Alert className="mb-4">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="text-lg">
                    {predictiveInsight}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">30-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Predicted Churn</span>
                        <span className="font-bold text-red-600">
                          3 clients
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue at Risk</span>
                        <span className="font-bold text-red-600">$305k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expansion Opportunities</span>
                        <span className="font-bold text-green-600">
                          12 clients
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potential Growth</span>
                        <span className="font-bold text-green-600">$450k</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Success Probability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Client Retention</span>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                        <Progress value={87} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Revenue Growth</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Brief Clarity</span>
                          <span className="text-sm font-medium">68%</span>
                        </div>
                        <Progress value={68} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Action Engine</CardTitle>
              <CardDescription>
                Set it and forget it - AI handles the rest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Auto Client Health Alerts</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically notify when sentiment drops below 30%
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Bell className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      Weekly Intelligence Reports
                    </h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Every Monday: Client health, opportunities, and actions
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      Opportunity Auto-Discovery
                    </h4>
                    <Badge variant="secondary">Setup Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI identifies and ranks expansion opportunities daily
                  </p>
                  <Button size="sm">
                    <Zap className="h-4 w-4 mr-1" />
                    Enable Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
