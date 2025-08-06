"use client";

import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Target,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ClientIntelligence } from "@/types/client";
import { formatCurrency } from "@/lib/utils";

interface IntelligenceWidgetProps {
  clientId: string;
  clientName: string;
  embedded?: boolean;
}

export function IntelligenceWidget({ 
  clientId, 
  clientName, 
  embedded = false 
}: IntelligenceWidgetProps) {
  const router = useRouter();
  const [intelligence, setIntelligence] = useState<ClientIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchIntelligence();
  }, [clientId]);

  const fetchIntelligence = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/clients/${clientId}/intelligence`);
      if (!response.ok) throw new Error('Failed to fetch intelligence');
      
      const data = await response.json();
      setIntelligence(data);
      setLastUpdated(new Date(data.lastUpdated));
      setError(null);
    } catch (err) {
      setError('Failed to load intelligence data');
      console.error('Error fetching intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Moderate";
    if (score >= 40) return "Low";
    return "Critical";
  };

  const getMarketOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'POSITIVE': return "text-green-600";
      case 'NEGATIVE': return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <CardTitle>AI Intelligence</CardTitle>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <CardDescription>
            AI-powered insights for {clientName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !intelligence) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <CardTitle>AI Intelligence</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchIntelligence}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {error || 'Failed to load intelligence data'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRisks = intelligence.riskFactors.high.length + 
                   intelligence.riskFactors.medium.length + 
                   intelligence.riskFactors.low.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Intelligence</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Live
            </Badge>
          </div>
          {!embedded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/clients/${clientId}/intelligence`)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Full Dashboard
            </Button>
          )}
        </div>
        <CardDescription>
          AI-powered insights for {clientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exit Readiness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exit Readiness</span>
              <span className={`text-sm font-semibold ${getReadinessColor(intelligence.exitReadinessScore)}`}>
                {intelligence.exitReadinessScore}%
              </span>
            </div>
            <Progress value={intelligence.exitReadinessScore} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Not Ready</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getReadinessColor(intelligence.exitReadinessScore)}`}
              >
                {getReadinessLabel(intelligence.exitReadinessScore)} Readiness
              </Badge>
              <span>Ready</span>
            </div>
          </div>

          {/* Valuation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Est. Valuation</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(intelligence.valuationRange.estimated)}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Range: {formatCurrency(intelligence.valuationRange.low)} - {formatCurrency(intelligence.valuationRange.high)}
            </div>
          </div>
        </div>

        {/* Market & Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Market Conditions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${getMarketOutlookColor(intelligence.marketConditions.outlook)}`} />
              <span className="text-sm">Market Outlook</span>
            </div>
            <Badge 
              variant={intelligence.marketConditions.outlook === 'POSITIVE' ? 'default' : 
                      intelligence.marketConditions.outlook === 'NEGATIVE' ? 'destructive' : 'secondary'}
              className="capitalize"
            >
              {intelligence.marketConditions.outlook.toLowerCase()}
            </Badge>
          </div>

          {/* Risk Factors */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Risk Factors</span>
            </div>
            <div className="flex items-center gap-1">
              {intelligence.riskFactors.high.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {intelligence.riskFactors.high.length} High
                </Badge>
              )}
              {intelligence.riskFactors.medium.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {intelligence.riskFactors.medium.length} Med
                </Badge>
              )}
              {totalRisks === 0 && (
                <Badge variant="outline" className="text-xs text-green-600">
                  Low Risk
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Immediate Actions Needed</h4>
          <div className="space-y-2">
            {intelligence.recommendations.immediate.slice(0, embedded ? 2 : 3).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
            {intelligence.recommendations.immediate.length > (embedded ? 2 : 3) && (
              <div className="text-xs text-muted-foreground">
                +{intelligence.recommendations.immediate.length - (embedded ? 2 : 3)} more recommendations
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => router.push(`/clients/${clientId}/intelligence`)}
            className="flex-1 gap-2"
          >
            <Brain className="h-4 w-4" />
            Open Intelligence Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          {!embedded && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchIntelligence}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated?.toLocaleString() || 'Unknown'}
        </div>
      </CardContent>
    </Card>
  );
}