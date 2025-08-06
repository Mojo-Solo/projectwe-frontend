"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  GraduationCap,
  Zap,
  Users,
  TrendingUp,
  FileText,
  BarChart,
  Target,
  Shield,
  Calendar,
  DollarSign,
  Building,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Cog,
  MessageSquare,
} from "lucide-react";

interface PillarFeature {
  id: string;
  title: string;
  description: string;
  pillar: "coach" | "learn" | "execute" | "collaborate";
  category: string;
  status: "available" | "coming-soon" | "beta";
  icon: React.ElementType;
  benefits: string[];
  integration?: string;
}

export function PillarFeatures() {
  const features: PillarFeature[] = [
    // Coach Pillar - AI-Powered Strategic Intelligence
    {
      id: "valuation-insights",
      title: "AI Valuation Insights",
      description:
        "Get intelligent valuation recommendations based on market trends and company metrics",
      pillar: "coach",
      category: "Valuation",
      status: "available",
      icon: TrendingUp,
      benefits: [
        "Real-time market comparables",
        "Multiple valuation methodologies",
        "Value enhancement recommendations",
        "Industry-specific insights",
      ],
      integration: "Valuation Calculator",
    },
    {
      id: "readiness-recommendations",
      title: "Readiness Optimization",
      description:
        "AI-driven recommendations to improve your exit readiness score",
      pillar: "coach",
      category: "Assessment",
      status: "available",
      icon: Target,
      benefits: [
        "Personalized improvement plans",
        "Priority-based action items",
        "Risk identification & mitigation",
        "Progress tracking",
      ],
      integration: "Readiness Assessment",
    },
    {
      id: "buyer-matching",
      title: "Intelligent Buyer Matching",
      description:
        "AI-powered identification of strategic and financial buyers",
      pillar: "coach",
      category: "Market",
      status: "beta",
      icon: Building,
      benefits: [
        "Buyer profile analysis",
        "Compatibility scoring",
        "Market timing insights",
        "Negotiation strategy",
      ],
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis & Mitigation",
      description: "Proactive identification and mitigation of exit risks",
      pillar: "coach",
      category: "Risk",
      status: "available",
      icon: Shield,
      benefits: [
        "Comprehensive risk assessment",
        "Mitigation strategies",
        "Deal structure optimization",
        "Contingency planning",
      ],
    },

    // Learn Pillar - Knowledge Amplification System
    {
      id: "exit-academy",
      title: "Exit Planning Academy",
      description:
        "Comprehensive learning paths for business owners and advisors",
      pillar: "learn",
      category: "Education",
      status: "available",
      icon: GraduationCap,
      benefits: [
        "Structured learning paths",
        "Expert-led content",
        "Interactive workshops",
        "Certification programs",
      ],
    },
    {
      id: "case-studies",
      title: "Success Case Studies",
      description: "Real-world exit success stories and lessons learned",
      pillar: "learn",
      category: "Resources",
      status: "available",
      icon: BookOpen,
      benefits: [
        "Industry-specific examples",
        "Deal structure analysis",
        "Negotiation insights",
        "Best practices",
      ],
    },
    {
      id: "advisor-training",
      title: "Advisor Certification",
      description: "Professional development for exit planning advisors",
      pillar: "learn",
      category: "Training",
      status: "coming-soon",
      icon: Sparkles,
      benefits: [
        "RFN/Keyes methodology",
        "Activ8 best practices",
        "Continuous education",
        "Client engagement tools",
      ],
    },

    // Execute Pillar - Workflow Automation Engine
    {
      id: "milestone-automation",
      title: "Automated Milestone Tracking",
      description: "Smart workflow automation for exit planning milestones",
      pillar: "execute",
      category: "Automation",
      status: "available",
      icon: Zap,
      benefits: [
        "Automated task creation",
        "Dependency management",
        "Progress notifications",
        "Team coordination",
      ],
      integration: "Milestone Tracker",
    },
    {
      id: "document-generation",
      title: "Document Automation",
      description: "Automated generation of exit planning documents",
      pillar: "execute",
      category: "Documents",
      status: "available",
      icon: FileText,
      benefits: [
        "CIM generation",
        "Financial summaries",
        "Legal checklists",
        "Data room preparation",
      ],
    },
    {
      id: "timeline-optimization",
      title: "Timeline Optimization",
      description:
        "AI-optimized exit planning timeline and resource allocation",
      pillar: "execute",
      category: "Planning",
      status: "beta",
      icon: Calendar,
      benefits: [
        "Critical path analysis",
        "Resource optimization",
        "Deadline management",
        "Scenario planning",
      ],
      integration: "Exit Timeline",
    },
    {
      id: "financial-modeling",
      title: "Automated Financial Models",
      description: "Dynamic financial modeling and scenario analysis",
      pillar: "execute",
      category: "Finance",
      status: "available",
      icon: DollarSign,
      benefits: [
        "DCF modeling",
        "EBITDA adjustments",
        "Scenario comparison",
        "Sensitivity analysis",
      ],
    },

    // Collaborate Pillar - Multi-Stakeholder Coordination
    {
      id: "stakeholder-portal",
      title: "Stakeholder Portal",
      description:
        "Secure collaboration space for all exit planning participants",
      pillar: "collaborate",
      category: "Communication",
      status: "available",
      icon: Users,
      benefits: [
        "Secure data sharing",
        "Role-based access",
        "Real-time updates",
        "Activity tracking",
      ],
    },
    {
      id: "advisor-network",
      title: "Advisor Network",
      description: "Connect with vetted exit planning professionals",
      pillar: "collaborate",
      category: "Network",
      status: "beta",
      icon: MessageSquare,
      benefits: [
        "Vetted professionals",
        "Expertise matching",
        "Secure messaging",
        "Performance ratings",
      ],
    },
    {
      id: "deal-room",
      title: "Virtual Deal Room",
      description: "Secure virtual data room for due diligence",
      pillar: "collaborate",
      category: "Transactions",
      status: "coming-soon",
      icon: Cog,
      benefits: [
        "Bank-level security",
        "Granular permissions",
        "Activity analytics",
        "Q&A management",
      ],
    },
  ];

  const pillars = [
    {
      id: "coach",
      name: "Coach",
      description: "AI-powered strategic intelligence",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "learn",
      name: "Learn",
      description: "Knowledge amplification system",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "execute",
      name: "Execute",
      description: "Workflow automation engine",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "collaborate",
      name: "Collaborate",
      description: "Multi-stakeholder coordination",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="default" className="bg-green-600">
            Available
          </Badge>
        );
      case "beta":
        return (
          <Badge variant="secondary" className="bg-blue-600 text-white">
            Beta
          </Badge>
        );
      case "coming-soon":
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pillars Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => {
          const featureCount = features.filter(
            (f) => f.pillar === pillar.id,
          ).length;
          const availableCount = features.filter(
            (f) => f.pillar === pillar.id && f.status === "available",
          ).length;

          return (
            <Card key={pillar.id} className="relative overflow-hidden">
              <CardHeader>
                <div
                  className={`absolute top-0 right-0 w-24 h-24 ${pillar.bgColor} rounded-bl-full opacity-20`}
                />
                <pillar.icon
                  className={`h-8 w-8 ${pillar.color} relative z-10`}
                />
                <CardTitle className="relative z-10">{pillar.name}</CardTitle>
                <CardDescription className="relative z-10">
                  {pillar.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{featureCount}</span>
                  <span className="text-sm text-muted-foreground">
                    {availableCount} active
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features by Pillar */}
      <Tabs defaultValue="coach" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {pillars.map((pillar) => (
            <TabsTrigger key={pillar.id} value={pillar.id} className="gap-2">
              <pillar.icon className="h-4 w-4" />
              {pillar.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {pillars.map((pillar) => (
          <TabsContent key={pillar.id} value={pillar.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {features
                .filter((feature) => feature.pillar === pillar.id)
                .map((feature) => (
                  <Card key={feature.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${pillar.bgColor.replace(
                              "50",
                              "100",
                            )}`}
                          >
                            <feature.icon
                              className={`h-5 w-5 ${pillar.color}`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(feature.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {feature.integration && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">
                            Integrates with:{" "}
                            <span className="font-medium">
                              {feature.integration}
                            </span>
                          </p>
                        </div>
                      )}

                      {feature.status === "available" && (
                        <Button className="w-full" variant="outline" size="sm">
                          Explore Feature
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Integrated Exit Planning Platform</CardTitle>
          <CardDescription>
            Our four pillars work together to deliver a comprehensive exit
            planning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-medium">Strategic Insights</h4>
              <p className="text-sm text-muted-foreground">
                AI analyzes your business and market conditions
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-medium">Expert Knowledge</h4>
              <p className="text-sm text-muted-foreground">
                Learn from proven methodologies and case studies
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-medium">Automated Workflows</h4>
              <p className="text-sm text-muted-foreground">
                Execute your exit plan with intelligent automation
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-medium">Team Coordination</h4>
              <p className="text-sm text-muted-foreground">
                Collaborate seamlessly with all stakeholders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
