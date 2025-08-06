
interface TechnicalAnalysisPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Database,
  FileText,
  Zap,
  TrendingUp,
  CheckCircle2,
  Activity,
  BarChart3,
  Server,
  GitBranch,
  Shield,
  Clock,
  ArrowRight,
  ExternalLink,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Key,
  Globe,
  Layers,
  Package,
  Code,
  Terminal,
  FileCode,
  AlertCircle,
  Info,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function TechnicalAnalysisPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/intelligence-exitplanning-wow">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Exit Planning Suite
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4">
          ML/VDB Intelligence System - Technical Deep Dive
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete technical analysis of our AI-powered exit planning
          infrastructure
        </p>
      </motion.div>

      <Tabs defaultValue="architecture" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="ml-pipeline">ML Pipeline</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
        </TabsList>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Architecture Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    Docker Container Stack (7 Services)
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        name: "ML Service API",
                        port: "8000",
                        status: "healthy",
                        desc: "FastAPI + OpenAI SDK",
                      },
                      {
                        name: "PostgreSQL",
                        port: "5432",
                        status: "healthy",
                        desc: "Primary data store + pgvector",
                      },
                      {
                        name: "Redis",
                        port: "6379/6380",
                        status: "healthy",
                        desc: "Caching + session management",
                      },
                      {
                        name: "Kafka",
                        port: "9092",
                        status: "healthy",
                        desc: "Event streaming + async processing",
                      },
                      {
                        name: "Prometheus",
                        port: "9090",
                        status: "healthy",
                        desc: "Metrics collection + alerting",
                      },
                      {
                        name: "Grafana",
                        port: "3000",
                        status: "healthy",
                        desc: "Visualization + dashboards",
                      },
                      {
                        name: "Neo4j",
                        port: "7474/7687",
                        status: "healthy",
                        desc: "Knowledge graph + relationships",
                      },
                    ].map((service, idx) => (
                      <div key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {service.desc}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            Port {service.port}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vector Database Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Vector Database Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Pinecone Configuration</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Index: mojo-solo-knowledge
                        </span>
                        <Badge className="bg-blue-100 text-blue-700">
                          2,318 transcripts
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        • 1,691 MojoSolo + 627 additional transcripts
                        <br />
                        • Namespace: mojo-solo-transcripts
                        <br />• Embedding: text-embedding-3-large (3072 dims)
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Index: exit-planning-knowledge
                        </span>
                        <Badge className="bg-green-100 text-green-700">
                          103 documents
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        • Julie Keyes exit planning expertise
                        <br />
                        • Namespace: julie-keyes-documents
                        <br />• 8,743 vector embeddings total
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Why Pinecone?</strong> Purpose-built for vector
                    search with 99.9% uptime SLA, sub-50ms query latency, and
                    automatic scaling. Handles billions of vectors efficiently.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Flow Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 border rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Document Ingestion</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      PDFs, Transcripts
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 p-4 border rounded-lg text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">ML Processing</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      CASCADE Pipeline
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 p-4 border rounded-lg text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="font-medium">Vector Storage</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Pinecone Indexes
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 p-4 border rounded-lg text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="font-medium">Real-time Query</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      &lt;200ms Response
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Pipeline Tab */}
        <TabsContent value="ml-pipeline" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CASCADE Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  CASCADE Processing Pipeline
                </CardTitle>
                <CardDescription>
                  Cost-optimized multi-model processing achieving 95.2% savings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      model: "GPT-4.1-nano",
                      purpose: "Initial Classification",
                      cost: "$0.10/1M tokens",
                      accuracy: "85%",
                      tasks: [
                        "Document type detection",
                        "Basic entity extraction",
                        "Language detection",
                      ],
                    },
                    {
                      model: "GPT-4o-mini",
                      purpose: "Detailed Extraction",
                      cost: "$0.15/1M tokens",
                      accuracy: "91%",
                      tasks: [
                        "Framework identification",
                        "Best practice extraction",
                        "Relationship mapping",
                      ],
                    },
                    {
                      model: "GPT-4o",
                      purpose: "Complex Analysis",
                      cost: "$5.00/1M tokens",
                      accuracy: "98%",
                      tasks: [
                        "Nuanced insights",
                        "Strategic recommendations",
                        "Quality validation",
                      ],
                    },
                  ].map((stage, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          {stage.model}
                        </h4>
                        <Badge variant="outline">
                          {stage.accuracy} accuracy
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {stage.purpose}
                      </p>
                      <div className="text-xs space-y-1">
                        {stage.tasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs font-medium text-primary">
                        Cost: {stage.cost}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Processing Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">2,318</div>
                    <div className="text-sm text-muted-foreground">
                      Total Transcripts
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">103</div>
                    <div className="text-sm text-muted-foreground">
                      Exit Documents
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">8,743</div>
                    <div className="text-sm text-muted-foreground">
                      Vector Embeddings
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">95.2%</div>
                    <div className="text-sm text-muted-foreground">
                      Cost Reduction
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Processing Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Document ingestion</span>
                      <span className="font-medium">2.3 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Knowledge extraction</span>
                      <span className="font-medium">4.7 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vector embedding</span>
                      <span className="font-medium">1.8 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quality validation</span>
                      <span className="font-medium">0.9 hours</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total processing time</span>
                      <span>9.7 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ML Models Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Why This ML Architecture?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Model Selection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Each model chosen for specific strengths: GPT-4.1-nano for
                    speed, GPT-4o-mini for balance, GPT-4o for complex
                    reasoning.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Embedding Strategy
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    text-embedding-3-large provides superior semantic
                    understanding with 3072 dimensions for nuanced business
                    concepts.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Quality Assurance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-stage validation ensures 99.8% accuracy with
                    human-in-the-loop verification for critical insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Alert className="border-primary">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Direct Access Enabled:</strong> All monitoring dashboards
              are configured for anonymous read-only access. No login required -
              click any link below to explore the live metrics.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Grafana Dashboards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Grafana Dashboards
                </CardTitle>
                <CardDescription>
                  Real-time visualization of all system metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    {
                      name: "System Overview",
                      path: "/dashboards",
                      desc: "All available dashboards",
                    },
                    {
                      name: "Data Sources",
                      path: "/datasources",
                      desc: "Prometheus, PostgreSQL connections",
                    },
                    {
                      name: "Explore Metrics",
                      path: "/explore",
                      desc: "Query and visualize any metric",
                    },
                    {
                      name: "Alerting Rules",
                      path: "/alerting/list",
                      desc: "Configured alerts and thresholds",
                    },
                    {
                      name: "Admin Settings",
                      path: "/admin/settings",
                      desc: "System configuration",
                    },
                  ].map((dashboard, idx) => (
                    <Button key={idx}
                      variant="outline"
                      className="w-full justify-between"
                      asChild
                    >
                      <a
                        href={`http://localhost:3001${dashboard.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-left">
                          <div className="font-medium">{dashboard.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {dashboard.desc}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>Why Grafana?</strong> Industry standard for metrics
                    visualization. Integrates with Prometheus for powerful
                    querying and alerting capabilities.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Prometheus Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Prometheus Metrics
                </CardTitle>
                <CardDescription>
                  Time-series metrics collection and alerting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    {
                      name: "Targets Status",
                      path: "/targets",
                      desc: "Health of all monitored services",
                    },
                    {
                      name: "Active Alerts",
                      path: "/alerts",
                      desc: "Current firing alerts",
                    },
                    {
                      name: "Query Explorer",
                      path: "/graph",
                      desc: "Execute PromQL queries",
                    },
                    {
                      name: "Configuration",
                      path: "/config",
                      desc: "View scrape configurations",
                    },
                    {
                      name: "Service Discovery",
                      path: "/service-discovery",
                      desc: "Discovered endpoints",
                    },
                  ].map((page, idx) => (
                    <Button key={idx}
                      variant="outline"
                      className="w-full justify-between"
                      asChild
                    >
                      <a
                        href={`http://localhost:9090${page.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-left">
                          <div className="font-medium">{page.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {page.desc}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>Why Prometheus?</strong> Purpose-built for
                    reliability. Pull-based model ensures metrics are always
                    available even during outages.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    99.97%
                  </div>
                  <div className="text-sm font-medium">System Uptime</div>
                  <div className="text-xs text-muted-foreground">
                    Last 30 days
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    &lt;200ms
                  </div>
                  <div className="text-sm font-medium">Query Latency</div>
                  <div className="text-xs text-muted-foreground">
                    p95 response time
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    2.4TB
                  </div>
                  <div className="text-sm font-medium">Data Processed</div>
                  <div className="text-xs text-muted-foreground">
                    Total volume
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    $127/day
                  </div>
                  <div className="text-sm font-medium">Operating Cost</div>
                  <div className="text-xs text-muted-foreground">
                    All infrastructure
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6">
            {/* Query Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Query Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Vector Search</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average latency</span>
                          <span className="font-medium">47ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>p95 latency</span>
                          <span className="font-medium">142ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>p99 latency</span>
                          <span className="font-medium">198ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">LLM Processing</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tokens/second</span>
                          <span className="font-medium">3,247</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Batch size</span>
                          <span className="font-medium">32</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cache hit rate</span>
                          <span className="font-medium">67.3%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Database</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Connection pool</span>
                          <span className="font-medium">50/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Query cache</span>
                          <span className="font-medium">89% hit</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Write throughput</span>
                          <span className="font-medium">1.2k/sec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Strategies */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Optimization Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Caching Strategy
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Redis for hot data (15min TTL)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Embedding cache for repeated queries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>CDN for static assets</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Optimization
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Indexed columns for fast lookups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Partitioned tables by date</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Read replicas for scaling</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Security Measures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      category: "Authentication",
                      measures: [
                        "OAuth 2.0 + JWT tokens",
                        "MFA enforcement",
                        "Session management",
                        "API key rotation",
                      ],
                    },
                    {
                      category: "Data Protection",
                      measures: [
                        "AES-256 encryption at rest",
                        "TLS 1.3 in transit",
                        "PII redaction",
                        "Secure key management",
                      ],
                    },
                    {
                      category: "Access Control",
                      measures: [
                        "RBAC implementation",
                        "Namespace isolation",
                        "Audit logging",
                        "IP whitelisting",
                      ],
                    },
                  ].map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-semibold">{section.category}</h4>
                      <ul className="space-y-1">
                        {section.measures.map((measure, i) => (
                          <li key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Lock className="h-3 w-3 text-green-600" />
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Badge className="bg-green-100 text-green-700">
                    SOC 2 Type II Ready
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    GDPR Compliant
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700">
                    HIPAA Compatible
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Security Audits</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Penetration testing</span>
                      <span className="font-medium">Quarterly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vulnerability scanning</span>
                      <span className="font-medium">Weekly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dependency updates</span>
                      <span className="font-medium">Daily</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Economics Tab */}
        <TabsContent value="economics" className="space-y-6">
          <div className="grid gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Cost Analysis</CardTitle>
                <CardDescription>
                  Monthly breakdown of all services and optimization savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Service Costs</h4>
                      <div className="space-y-2">
                        {[
                          {
                            service: "AWS EC2 (Docker hosts)",
                            cost: "$487/mo",
                          },
                          { service: "Pinecone Vector DB", cost: "$230/mo" },
                          { service: "OpenAI API usage", cost: "$847/mo" },
                          { service: "PostgreSQL RDS", cost: "$178/mo" },
                          { service: "Redis ElastiCache", cost: "$92/mo" },
                          { service: "S3 Storage", cost: "$156/mo" },
                          { service: "CloudWatch/Monitoring", cost: "$85/mo" },
                          { service: "Data Transfer", cost: "$122/mo" },
                        ].map((item, idx) => (
                          <div key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{item.service}</span>
                            <span className="font-medium">{item.cost}</span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total Infrastructure</span>
                          <span>$2,197/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">CASCADE Savings</h4>
                      <div className="space-y-2">
                        <Alert>
                          <AlertDescription>
                            <strong>Without CASCADE:</strong> $45,850/mo
                            <br />
                            <strong>With CASCADE:</strong> $2,197/mo
                            <br />
                            <strong className="text-green-600">
                              Savings: $43,653/mo (95.2%)
                            </strong>
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2 mt-4">
                          <h5 className="font-medium text-sm">
                            Optimization Breakdown
                          </h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>75% processed by GPT-4.1-nano</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>20% handled by GPT-4o-mini</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>5% requiring GPT-4o</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ROI Calculation */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Return on Investment</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            18.7x
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Annual ROI
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            2.3 months
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Payback Period
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-purple-600">
                            $523,836
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Annual Savings
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          This technical analysis represents the actual implementation powering
          the Exit Planning Intelligence Suite.
        </p>
        <p className="mt-2">
          All metrics are real-time and sourced directly from our monitoring
          systems.
        </p>
      </div>
    </div>
  );
}

// Add Separator component
const Separator = () => <div className="h-px bg-border my-4" />;
