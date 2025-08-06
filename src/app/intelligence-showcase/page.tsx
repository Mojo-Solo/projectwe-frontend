"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  TrendingUp,
  Calculator,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Activity,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

export default function IntelligenceShowcasePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 bg-clip-text text-transparent mb-4">
            ML/VDB Intelligence System Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of our $750k investment in AI-driven business
            intelligence. Two groundbreaking experiences that will transform how
            you work.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Badge variant="outline" className="px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              1,691 Transcripts Processed
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              103 Exit Planning Documents
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <DollarSign className="h-4 w-4 mr-2" />
              95.2% Cost Savings
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* MojoSolo WOW Experience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-600">For Creative Agencies</Badge>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">
                  MojoSolo Intelligence Command Center
                </CardTitle>
                <CardDescription className="text-base">
                  Real-time client health monitoring and predictive AI for
                  creative agencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Live Client Health Monitor
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Track 205 at-risk clients worth $25.6M in real-time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Predictive Intelligence Engine
                        </p>
                        <p className="text-sm text-muted-foreground">
                          30-day forecasts with 87% accuracy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Automated Action Engine</p>
                        <p className="text-sm text-muted-foreground">
                          AI triggers alerts and generates reports automatically
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      &quot;This system saved us 5,073 revision hours and
                      identified $450k in expansion opportunities we would have
                      missed.&quot;
                    </p>
                    <Link href="/intelligence-mojosolo-wow">
                      <Button className="w-full gap-2" size="lg">
                        Experience MojoSolo Intelligence
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exit Planning WOW Experience */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-2 border-green-500/20 hover:border-green-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-green-600">For Exit Planning Pros</Badge>
                  <Calculator className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">
                  Exit Planning Intelligence Suite
                </CardTitle>
                <CardDescription className="text-base">
                  Interactive valuation tools and AI-powered exit strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calculator className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Real-Time Valuation Calculator
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Instantly see how changes impact business value
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Tax Optimization Scenarios
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Compare 4 structures to save millions in taxes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">AI Succession Roadmap</p>
                        <p className="text-sm text-muted-foreground">
                          36-month personalized succession plan
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      &quot;It calculated our valuation, showed us how to add
                      $3.5M in value, and created our entire exit timeline in
                      minutes!&quot;
                    </p>
                    <Link href="/intelligence-exitplanning-wow">
                      <Button
                        className="w-full gap-2"
                        size="lg"
                        variant="default"
                      >
                        Experience Exit Planning Suite
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Original Demo Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Want to see the technical demo?</p>
                  <p className="text-sm text-muted-foreground">
                    Experience the dual chat interface and see the ML/VDB system
                    in action
                  </p>
                </div>
                <Link href="/intelligence-demo">
                  <Button variant="outline">
                    View Technical Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Powered by CASCADE Processing • Text-Embedding-3-Large • Pinecone
            Vector DB • PostgreSQL • Redis • Neo4j • $123M Annual Value
            Delivered
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
