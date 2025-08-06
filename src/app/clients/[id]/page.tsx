
interface ClientDetailPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Activity,
  MessageSquare,
  Settings,
  ArrowLeft,
  Edit,
  Eye,
  Plus,
  AlertCircle,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, ClientStatus, EngagementLevel } from "@/types/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IntelligenceWidget } from "@/components/clients/IntelligenceWidget";

export default function ClientDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Client not found");
        }
        throw new Error("Failed to load client data");
      }

      const clientData = await response.json();
      setClient(clientData);
    } catch (err) {
      console.error("Error loading client:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load client data",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ClientStatus) => {
    const colors = {
      PROSPECT: "bg-blue-100 text-blue-800",
      ACTIVE: "bg-green-100 text-green-800",
      ENGAGED: "bg-purple-100 text-purple-800",
      ON_HOLD: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      INACTIVE: "bg-red-100 text-red-800",
      CHURNED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getEngagementColor = (level: EngagementLevel) => {
    const colors = {
      LOW: "text-red-600",
      MEDIUM: "text-yellow-600",
      HIGH: "text-blue-600",
      VERY_HIGH: "text-green-600",
    };
    return colors[level] || "text-gray-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getExitReadinessScore = () => {
    const intelligence = client?.aiInsights as any;
    return intelligence?.exitReadinessScore || 0;
  };

  const getValuationEstimate = () => {
    const intelligence = client?.aiInsights as any;
    return intelligence?.valuationRange?.estimated || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={loadClientData}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  const intelligence = client.aiInsights as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {client.companyName}
              </h1>
              <Badge className={getStatusColor(client.status)}>
                {client.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {client.firstName} {client.lastName} • {client.industry}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exit Readiness
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getExitReadinessScore()}%</div>
            <p className="text-xs text-muted-foreground">
              Current readiness score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Est. Valuation
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getValuationEstimate() > 0
                ? formatCurrency(getValuationEstimate())
                : "TBD"}
            </div>
            <p className="text-xs text-muted-foreground">AI-powered estimate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                getEngagementColor(client.engagementLevel),
              )}
            >
              {client.engagementLevel.replace("_", " ")}
            </div>
            <p className="text-xs text-muted-foreground">Current level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number((client as any).documentsCount ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Uploaded files</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Details and Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{client.email}</p>
                  <p className="text-xs text-muted-foreground">Primary email</p>
                </div>
              </div>

              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{client.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      Phone number
                    </p>
                  </div>
                </div>
              )}

              {client.jobTitle && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{client.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Industry
                </p>
                <p className="font-medium">{client.industry}</p>
                {client.subIndustry && (
                  <p className="text-sm text-muted-foreground">
                    {client.subIndustry}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Company Size
                </p>
                <p className="font-medium">
                  {client.companySize.replace("_", " ")}
                </p>
              </div>

              {client.annualRevenue && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Annual Revenue
                  </p>
                  <p className="font-medium">
                    {formatCurrency(client.annualRevenue)}
                  </p>
                </div>
              )}

              {client.yearsInBusiness && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Years in Business
                  </p>
                  <p className="font-medium">{client.yearsInBusiness} years</p>
                </div>
              )}
            </CardContent>
          </Card>

          {client.exitStrategy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Exit Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Exit Strategy
                  </p>
                  <p className="font-medium">
                    {client.exitStrategy.replace("_", " ")}
                  </p>
                </div>

                {client.exitTimeframe && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Timeframe
                    </p>
                    <p className="font-medium">
                      {client.exitTimeframe.replace("_", " ")}
                    </p>
                  </div>
                )}

                {client.targetValuation && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Target Valuation
                    </p>
                    <p className="font-medium">
                      {formatCurrency(client.targetValuation)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* AI Intelligence Widget */}
              <IntelligenceWidget
                clientId={clientId}
                clientName={client?.companyName || "Client"}
                embedded={false}
              />

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {client.activities && client.activities.length > 0 ? (
                    <div className="space-y-3">
                      {client.activities.slice(0, 5).map((activity: any) => (
                        <div key={index}
                          key={activity.id}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.createdAt)} •{" "}
                              {activity.user?.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No recent activities
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="intelligence">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Powered Intelligence
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis and insights for{" "}
                    {client?.companyName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Full Intelligence Dashboard
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Access comprehensive AI-powered insights, valuation
                      analysis, risk assessment, and personalized
                      recommendations in the dedicated intelligence dashboard.
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/clients/${clientId}/intelligence`)
                      }
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Open Intelligence Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments">
              <Card>
                <CardHeader>
                  <CardTitle>Assessments</CardTitle>
                  <CardDescription>
                    Completed assessments and evaluations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {client.assessments && client.assessments.length > 0 ? (
                    <div className="space-y-3">
                      {client.assessments.map((assessment: any) => (
                        <div key={index}
                          key={assessment.id}
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{assessment.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {assessment.assessmentType} •{" "}
                                {formatDate(assessment.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">
                                {assessment.overallScore}%
                              </p>
                              <Badge variant="outline">
                                {assessment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No assessments completed yet
                      </p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Uploaded files and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {client.documents && client.documents.length > 0 ? (
                    <div className="space-y-3">
                      {client.documents.map((document: any) => (
                        <div key={index}
                          key={document.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{document.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {document.category} •{" "}
                                {formatDate(document.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{document.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No documents uploaded yet
                      </p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>All Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {client.activities && client.activities.length > 0 ? (
                    <div className="space-y-3">
                      {client.activities.map((activity: any) => (
                        <div key={index}
                          key={activity.id}
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="font-medium">{activity.title}</p>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activity.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDate(activity.createdAt)} •{" "}
                                  {activity.user?.name}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No activities recorded
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>
                    Private notes and observations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {client.notes && client.notes.length > 0 ? (
                    <div className="space-y-3">
                      {client.notes.map((note: any) => (
                        <div key={note.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {note.title && (
                                <p className="font-medium">{note.title}</p>
                              )}
                              <p className="text-sm mt-1">{note.content}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(note.createdAt)} •{" "}
                                {note.author?.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{note.category}</Badge>
                              {note.isPinned && (
                                <Badge variant="secondary">Pinned</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No notes added yet
                      </p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
