"use client";

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NLPChatInterface } from "@/components/intelligence/NLPChatInterface";
import { DocumentViewer } from "@/components/DocumentViewer";
import { IntelligenceProofPanel } from "@/components/IntelligenceProofPanel";
import { ExitRoadmapBuilder } from "@/components/intelligence/ExitRoadmapBuilder";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Brain,
  Calculator,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Briefcase,
  Building2,
  PiggyBank,
  Shield,
  ArrowRight,
  Lightbulb,
  BarChart3,
  LineChart,
  Download,
  Send,
  Loader2,
  Sparkles,
  RefreshCw,
  Share,
  Eye,
  Calendar,
  MapPin,
  Award,
  Zap,
  Settings,
  User,
  Mail,
  Phone,
  Edit,
  ExternalLink,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Client, ClientIntelligence } from "@/types/client";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface ClientIntelligencePageProps {}

export default function ClientIntelligencePage({}: ClientIntelligencePageProps) {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [intelligence, setIntelligence] = useState<ClientIntelligence | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WOW-specific state
  const [activeScenario, setActiveScenario] = useState("base");
  const [timeframe, setTimeframe] = useState([12]);
  const [riskTolerance, setRiskTolerance] = useState([5]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  useEffect(() => {
    fetchClientData();
    fetchIntelligence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch client data");
      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError("Failed to load client data");
      console.error("Error fetching client:", err);
    }
  };

  const fetchIntelligence = async (refresh = false) => {
    try {
      setIsLoading(!refresh);
      if (refresh) setIsRefreshing(true);

      const url = `/api/clients/${clientId}/intelligence${refresh ? "?refresh=true" : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch intelligence data");

      const data = await response.json();
      setIntelligence(data);
    } catch (err) {
      setError("Failed to load intelligence data");
      console.error("Error fetching intelligence:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefreshIntelligence = async () => {
    await fetchIntelligence(true);
  };

  const handleExportReport = async () => {
    try {
      // Create export request
      const exportData = {
        clientId,
        format: exportFormat,
        sections: [
          "overview",
          "readiness",
          "valuation",
          "recommendations",
          "risks",
        ],
        includeCharts: true,
        includeAnalysis: true,
      };

      // In a real implementation, this would generate and download the report
      console.log("Exporting report:", exportData);
      setShowExportDialog(false);

      // Show success message
      alert("Report export initiated. You will receive an email when ready.");
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  const handleShareIntelligence = async () => {
    try {
      // In a real implementation, this would create a secure share link
      const shareLink = `${window.location.origin}/shared/intelligence/${clientId}/secure-token`;

      await navigator.clipboard.writeText(shareLink);
      alert("Secure share link copied to clipboard");
    } catch (err) {
      console.error("Share failed:", err);
      alert("Share failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading client intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (error || !client || !intelligence) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error || "Failed to load data"}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 80) return "High Readiness";
    if (score >= 60) return "Moderate Readiness";
    if (score >= 40) return "Low Readiness";
    return "Not Ready";
  };

  const getMarketOutlookColor = (outlook: string) => {
    switch (outlook) {
      case "POSITIVE":
        return "text-green-600";
      case "NEGATIVE":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Client Context */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/clients/${clientId}`)}
              className="px-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Client
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Intelligence Dashboard
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{client.companyName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                {client.firstName} {client.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{client.industry}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareIntelligence}
            className="gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshIntelligence}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Intelligence Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exit Readiness</p>
                <p
                  className={`text-2xl font-bold ${getReadinessColor(intelligence.exitReadinessScore)}`}
                >
                  {intelligence.exitReadinessScore}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {getReadinessLabel(intelligence.exitReadinessScore)}
                </p>
              </div>
              <Target
                className={`h-8 w-8 ${getReadinessColor(intelligence.exitReadinessScore)}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Valuation</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(intelligence.valuationRange.estimated)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(intelligence.valuationRange.low)} -{" "}
                  {formatCurrency(intelligence.valuationRange.high)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Outlook</p>
                <p
                  className={`text-lg font-semibold ${getMarketOutlookColor(intelligence.marketConditions.outlook)}`}
                >
                  {intelligence.marketConditions.outlook}
                </p>
                <p className="text-xs text-muted-foreground">
                  Score: {intelligence.marketConditions.score}/100
                </p>
              </div>
              <BarChart3
                className={`h-8 w-8 ${getMarketOutlookColor(intelligence.marketConditions.outlook)}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Factors</p>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-red-600">
                    {intelligence.riskFactors.high.length}
                  </span>
                  <span className="text-lg text-yellow-600">
                    {intelligence.riskFactors.medium.length}
                  </span>
                  <span className="text-sm text-green-600">
                    {intelligence.riskFactors.low.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  High / Med / Low
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Intelligence Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exit Readiness Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Exit Readiness Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Overall Score</span>
                    <span
                      className={`font-semibold ${getReadinessColor(intelligence.exitReadinessScore)}`}
                    >
                      {intelligence.exitReadinessScore}%
                    </span>
                  </div>
                  <Progress
                    value={intelligence.exitReadinessScore}
                    className="h-2"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Key Areas</h4>
                  {client.annualRevenue && (
                    <div className="flex justify-between">
                      <span className="text-sm">Financial Performance</span>
                      <Badge
                        variant={
                          client.annualRevenue > 5000000
                            ? "default"
                            : "secondary"
                        }
                      >
                        {client.annualRevenue > 5000000
                          ? "Strong"
                          : "Developing"}
                      </Badge>
                    </div>
                  )}
                  {client.yearsInBusiness && (
                    <div className="flex justify-between">
                      <span className="text-sm">Operating History</span>
                      <Badge
                        variant={
                          client.yearsInBusiness > 5 ? "default" : "secondary"
                        }
                      >
                        {client.yearsInBusiness > 5 ? "Established" : "Growing"}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm">Market Position</span>
                    <Badge variant="outline">{client.companySize}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Market Outlook</span>
                  <Badge
                    variant={
                      intelligence.marketConditions.outlook === "POSITIVE"
                        ? "default"
                        : intelligence.marketConditions.outlook === "NEGATIVE"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {intelligence.marketConditions.outlook}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Market Score</span>
                    <span className="font-medium">
                      {intelligence.marketConditions.score}/100
                    </span>
                  </div>
                  <Progress
                    value={intelligence.marketConditions.score}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Favorable Factors</h4>
                  {intelligence.marketConditions.factors.map(
                    (factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* High Risk */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                    <h4 className="font-medium text-red-700">High Priority</h4>
                  </div>
                  <div className="space-y-2">
                    {intelligence.riskFactors.high.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No high-priority risks identified
                      </p>
                    ) : (
                      intelligence.riskFactors.high.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Medium Risk */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-yellow-600 rounded-full"></div>
                    <h4 className="font-medium text-yellow-700">
                      Medium Priority
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {intelligence.riskFactors.medium.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No medium-priority risks identified
                      </p>
                    ) : (
                      intelligence.riskFactors.medium.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Low Risk */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                    <h4 className="font-medium text-green-700">Low Priority</h4>
                  </div>
                  <div className="space-y-2">
                    {intelligence.riskFactors.low.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No low-priority risks identified
                      </p>
                    ) : (
                      intelligence.riskFactors.low.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Valuation Tab */}
        <TabsContent value="valuation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Valuation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Estimated Enterprise Value
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {formatCurrency(intelligence.valuationRange.estimated)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Range: {formatCurrency(intelligence.valuationRange.low)} -{" "}
                    {formatCurrency(intelligence.valuationRange.high)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Valuation Factors</h4>
                  {client.annualRevenue && (
                    <div className="flex justify-between">
                      <span className="text-sm">Annual Revenue</span>
                      <span className="font-medium">
                        {formatCurrency(client.annualRevenue)}
                      </span>
                    </div>
                  )}
                  {client.profitMargin && (
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Margin</span>
                      <span className="font-medium">
                        {formatPercentage(client.profitMargin)}
                      </span>
                    </div>
                  )}
                  {client.revenueGrowthRate && (
                    <div className="flex justify-between">
                      <span className="text-sm">Growth Rate</span>
                      <span className="font-medium">
                        {formatPercentage(client.revenueGrowthRate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm">Industry</span>
                    <span className="font-medium">{client.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Company Size</span>
                    <span className="font-medium">{client.companySize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Analysis */}
            {intelligence.competitiveAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Competitive Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Market Positioning</h4>
                    <p className="text-sm text-muted-foreground">
                      {intelligence.competitiveAnalysis.positioning}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Competitive Advantages</h4>
                    <div className="space-y-1">
                      {intelligence.competitiveAnalysis.advantages.map(
                        (advantage, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{advantage}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Challenges</h4>
                    <div className="space-y-1">
                      {intelligence.competitiveAnalysis.challenges.map(
                        (challenge, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">{challenge}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Exit Readiness Tab */}
        <TabsContent value="readiness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detailed Readiness Assessment
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of your exit readiness across key areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${getReadinessColor(intelligence.exitReadinessScore)}`}
                      >
                        {intelligence.exitReadinessScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Exit Ready
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium">
                  {getReadinessLabel(intelligence.exitReadinessScore)}
                </p>
              </div>

              <Separator />

              {/* Readiness Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Financial Readiness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revenue Stability</span>
                      <span className="font-medium">
                        {client.annualRevenue && client.annualRevenue > 5000000
                          ? "Strong"
                          : "Moderate"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profitability</span>
                      <span className="font-medium">
                        {client.profitMargin && client.profitMargin > 10
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Growth Trend</span>
                      <span className="font-medium">
                        {client.revenueGrowthRate &&
                        client.revenueGrowthRate > 0
                          ? "Positive"
                          : "Flat/Declining"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Operational Readiness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Business History</span>
                      <span className="font-medium">
                        {client.yearsInBusiness && client.yearsInBusiness > 5
                          ? "Established"
                          : "Developing"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Market Position</span>
                      <span className="font-medium">{client.companySize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Documentation</span>
                      <span className="font-medium">
                        {client.documents && client.documents.length > 5
                          ? "Complete"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Immediate Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-600" />
                  Immediate Actions
                </CardTitle>
                <CardDescription>
                  Actions to take within 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.recommendations.immediate.map(
                    (action, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-red-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{action}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Short-term Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Short-term (3-6 months)
                </CardTitle>
                <CardDescription>Actions for the next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.recommendations.shortTerm.map(
                    (action, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-yellow-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{action}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Long-term Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Long-term (6+ months)
                </CardTitle>
                <CardDescription>Strategic initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.recommendations.longTerm.map(
                    (action, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-green-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{action}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab - WOW Integration */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Analysis Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Interactive Analysis
                </CardTitle>
                <CardDescription>
                  Customize analysis parameters for deeper insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Exit Timeframe (months)</Label>
                    <Slider
                      value={timeframe}
                      onValueChange={setTimeframe}
                      max={60}
                      min={3}
                      step={3}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>3 months</span>
                      <span className="font-medium">{timeframe[0]} months</span>
                      <span>60 months</span>
                    </div>
                  </div>

                  <div>
                    <Label>Risk Tolerance (1-10)</Label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Conservative</span>
                      <span className="font-medium">{riskTolerance[0]}/10</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  <div>
                    <Label>Analysis Scenario</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {["optimistic", "base", "conservative"].map(
                        (scenario) => (
                          <Button
                            key={scenario}
                            variant={
                              activeScenario === scenario
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveScenario(scenario)}
                            className="capitalize"
                          >
                            {scenario}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsAnalyzing(true)}
                    className="w-full"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Intelligence Chat
                </CardTitle>
                <CardDescription>
                  Ask questions about {client.companyName}&apos;s exit strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NLPChatInterface namespace="exit-planning-documents" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-6">
          <ExitRoadmapBuilder
            clientInfo={
              client
                ? {
                    name: client.companyName,
                    industry: client.industry,
                    size: client.companySize,
                    revenue: client.annualRevenue || 0,
                    exitStrategy: client.exitStrategy,
                    timeframe: client.exitTimeframe,
                  }
                : {}
            }
            valuationFactors={
              intelligence
                ? {
                    revenue: client?.annualRevenue || 0,
                    growth: client?.revenueGrowthRate || 0,
                    profitMargin: client?.profitMargin || 0,
                    marketConditions: intelligence.marketConditions,
                    riskFactors: intelligence.riskFactors,
                  }
                : {}
            }
            selectedFrameworks={[]}
            currentValuation={intelligence?.valuationRange?.low || 0}
            optimizedValuation={intelligence?.valuationRange?.estimated || 0}
          />
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Export Intelligence Report</CardTitle>
              <CardDescription>
                Generate a comprehensive report for {client.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Export Format</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["pdf", "xlsx"].map((format) => (
                    <Button
                      key={format}
                      variant={exportFormat === format ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportFormat(format)}
                      className="uppercase"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleExportReport}>Export Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
