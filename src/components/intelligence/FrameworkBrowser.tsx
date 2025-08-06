"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Star,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExitFramework {
  id: string;
  title: string;
  description: string;
  category: "strategic" | "financial" | "operational" | "legal" | "tax";
  complexity: "beginner" | "intermediate" | "advanced";
  timeframe: string;
  applicability: string[];
  steps: FrameworkStep[];
  prerequisites: string[];
  outcomes: string[];
  resources: FrameworkResource[];
  case_studies: CaseStudy[];
  popularity_score: number;
  success_rate: number;
  last_updated: string;
  author: {
    name: string;
    credentials: string;
    avatar?: string;
  };
}

interface FrameworkStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  dependencies: string[];
  deliverables: string[];
  tools_required: string[];
  success_criteria: string[];
}

interface FrameworkResource {
  title: string;
  type: "template" | "checklist" | "calculator" | "guide" | "video";
  url: string;
  description: string;
}

interface CaseStudy {
  company: string;
  industry: string;
  size: string;
  outcome: string;
  timeline: string;
  key_learnings: string[];
}

const SAMPLE_FRAMEWORKS: ExitFramework[] = [
  {
    id: "value-bridge-method",
    title: "Value Bridge Methodology",
    description:
      "Systematic approach to identifying and closing valuation gaps before exit",
    category: "strategic",
    complexity: "intermediate",
    timeframe: "12-18 months",
    applicability: ["Private Equity", "Strategic Sale", "Management Buyout"],
    steps: [
      {
        id: "current-assessment",
        title: "Current State Assessment",
        description:
          "Comprehensive evaluation of current business value drivers",
        duration: "2-4 weeks",
        dependencies: [],
        deliverables: [
          "Value Assessment Report",
          "Gap Analysis",
          "Baseline Metrics",
        ],
        tools_required: [
          "Financial Model",
          "Market Analysis",
          "Operational Audit",
        ],
        success_criteria: [
          "Accurate baseline valuation",
          "Identified improvement areas",
          "Stakeholder alignment",
        ],
      },
      {
        id: "gap-identification",
        title: "Value Gap Identification",
        description: "Identify specific areas where value can be enhanced",
        duration: "1-2 weeks",
        dependencies: ["current-assessment"],
        deliverables: [
          "Gap Analysis Report",
          "Prioritized Action Items",
          "Investment Requirements",
        ],
        tools_required: [
          "Benchmarking Data",
          "Industry Comparables",
          "SWOT Analysis",
        ],
        success_criteria: [
          "Clear gap identification",
          "Quantified opportunities",
          "Feasibility assessment",
        ],
      },
    ],
    prerequisites: [
      "Financial statements (3 years)",
      "Management team commitment",
      "Board approval",
    ],
    outcomes: [
      "15-30% valuation increase",
      "Improved market position",
      "Enhanced exit readiness",
    ],
    resources: [
      {
        title: "Value Assessment Template",
        type: "template",
        url: "/templates/value-assessment.xlsx",
        description:
          "Excel template for conducting comprehensive value assessments",
      },
      {
        title: "Gap Analysis Checklist",
        type: "checklist",
        url: "/checklists/gap-analysis.pdf",
        description: "Step-by-step checklist for identifying value gaps",
      },
    ],
    case_studies: [
      {
        company: "TechCorp Solutions",
        industry: "SaaS",
        size: "$50M ARR",
        outcome: "25% valuation increase",
        timeline: "14 months",
        key_learnings: [
          "Focus on recurring revenue metrics",
          "Operational efficiency critical",
          "Market positioning matters",
        ],
      },
    ],
    popularity_score: 85,
    success_rate: 78,
    last_updated: "2024-12-15",
    author: {
      name: "Dr. Sarah Mitchell",
      credentials: "CFA, MBA",
      avatar: "/avatars/sarah-mitchell.jpg",
    },
  },
  {
    id: "strategic-buyer-positioning",
    title: "Strategic Buyer Positioning Framework",
    description:
      "Optimize company positioning to attract premium strategic buyers",
    category: "strategic",
    complexity: "advanced",
    timeframe: "18-24 months",
    applicability: ["Strategic Sale", "Industry Consolidation"],
    steps: [
      {
        id: "buyer-mapping",
        title: "Strategic Buyer Mapping",
        description: "Identify and profile potential strategic acquirers",
        duration: "3-4 weeks",
        dependencies: [],
        deliverables: [
          "Buyer Universe Map",
          "Acquisition Criteria Analysis",
          "Contact Strategy",
        ],
        tools_required: [
          "Industry Database",
          "M&A Analytics",
          "Market Research",
        ],
        success_criteria: [
          "Comprehensive buyer list",
          "Clear value propositions",
          "Engagement roadmap",
        ],
      },
    ],
    prerequisites: [
      "Market-leading position",
      "Strong IP portfolio",
      "Scalable operations",
    ],
    outcomes: [
      "Premium acquisition multiple",
      "Competitive bidding process",
      "Strategic synergy realization",
    ],
    resources: [
      {
        title: "Buyer Mapping Template",
        type: "template",
        url: "/templates/buyer-mapping.xlsx",
        description: "Template for mapping strategic buyers and their criteria",
      },
    ],
    case_studies: [
      {
        company: "DataInsights Inc",
        industry: "Analytics",
        size: "$25M Revenue",
        outcome: "35% premium to market",
        timeline: "20 months",
        key_learnings: [
          "Strategic fit crucial",
          "Timing is everything",
          "Multiple options create value",
        ],
      },
    ],
    popularity_score: 72,
    success_rate: 85,
    last_updated: "2024-11-28",
    author: {
      name: "Marcus Chen",
      credentials: "Investment Banker, 15+ years",
      avatar: "/avatars/marcus-chen.jpg",
    },
  },
  {
    id: "financial-optimization",
    title: "Financial Optimization Protocol",
    description:
      "Systematic approach to optimizing financial metrics for maximum exit value",
    category: "financial",
    complexity: "intermediate",
    timeframe: "6-12 months",
    applicability: ["All Exit Types"],
    steps: [
      {
        id: "metrics-analysis",
        title: "Key Metrics Analysis",
        description: "Deep dive into financial metrics that drive valuation",
        duration: "1-2 weeks",
        dependencies: [],
        deliverables: [
          "Metrics Dashboard",
          "Benchmark Analysis",
          "Improvement Plan",
        ],
        tools_required: [
          "Financial Analytics",
          "Industry Benchmarks",
          "Forecasting Models",
        ],
        success_criteria: [
          "Clear metric baselines",
          "Improvement targets set",
          "Action plan approved",
        ],
      },
    ],
    prerequisites: [
      "Clean financial statements",
      "Management reporting systems",
      "Cash flow visibility",
    ],
    outcomes: [
      "Improved EBITDA margins",
      "Enhanced cash conversion",
      "Reduced financial risk",
    ],
    resources: [
      {
        title: "Financial Metrics Calculator",
        type: "calculator",
        url: "/calculators/financial-metrics",
        description: "Interactive calculator for key financial metrics",
      },
    ],
    case_studies: [
      {
        company: "ManufacturingPro",
        industry: "Manufacturing",
        size: "$100M Revenue",
        outcome: "20% EBITDA improvement",
        timeline: "8 months",
        key_learnings: [
          "Working capital optimization key",
          "Cost structure analysis critical",
          "Regular monitoring essential",
        ],
      },
    ],
    popularity_score: 91,
    success_rate: 82,
    last_updated: "2024-12-01",
    author: {
      name: "Jennifer Walsh",
      credentials: "CFO, CPA",
      avatar: "/avatars/jennifer-walsh.jpg",
    },
  },
];

interface FrameworkBrowserProps {
  onFrameworkSelect?: (framework: ExitFramework) => void;
  defaultCategory?: string;
  className?: string;
}

export function FrameworkBrowser({
  onFrameworkSelect,
  defaultCategory = "all",
  className = "",
}: FrameworkBrowserProps) {
  const [frameworks, setFrameworks] =
    useState<ExitFramework[]>(SAMPLE_FRAMEWORKS);
  const [filteredFrameworks, setFilteredFrameworks] =
    useState<ExitFramework[]>(SAMPLE_FRAMEWORKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedComplexity, setSelectedComplexity] = useState("all");
  const [sortBy, setSortBy] = useState<
    "popularity" | "success_rate" | "updated"
  >("popularity");
  const [selectedFramework, setSelectedFramework] =
    useState<ExitFramework | null>(null);

  // Filter and sort frameworks
  useEffect(() => {
    let filtered = frameworks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (framework) =>
          framework.title.toLowerCase().includes(query) ||
          framework.description.toLowerCase().includes(query) ||
          framework.applicability.some((app) =>
            app.toLowerCase().includes(query),
          ),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (framework) => framework.category === selectedCategory,
      );
    }

    // Apply complexity filter
    if (selectedComplexity !== "all") {
      filtered = filtered.filter(
        (framework) => framework.complexity === selectedComplexity,
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity_score - a.popularity_score;
        case "success_rate":
          return b.success_rate - a.success_rate;
        case "updated":
          return (
            new Date(b.last_updated).getTime() -
            new Date(a.last_updated).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredFrameworks(filtered);
  }, [frameworks, searchQuery, selectedCategory, selectedComplexity, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strategic":
        return <TrendingUp className="h-4 w-4" />;
      case "financial":
        return <BookOpen className="h-4 w-4" />;
      case "operational":
        return <Users className="h-4 w-4" />;
      case "legal":
        return <BookOpen className="h-4 w-4" />;
      case "tax":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-50 text-green-700";
      case "intermediate":
        return "bg-yellow-50 text-yellow-700";
      case "advanced":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Exit Planning Frameworks</h2>
            <p className="text-muted-foreground">
              Explore proven methodologies for successful business exits
            </p>
          </div>
        </div>

        <Badge variant="secondary">
          {filteredFrameworks.length} frameworks
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="strategic">Strategic</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="tax">Tax</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedComplexity}
          onValueChange={setSelectedComplexity}
        >
          <SelectTrigger>
            <SelectValue placeholder="Complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="success_rate">Success Rate</SelectItem>
            <SelectItem value="updated">Recently Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrameworks.map((framework) => (
          <Card key={index}
            key={framework.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(framework.category)}
                  <Badge variant="outline" className="capitalize">
                    {framework.category}
                  </Badge>
                </div>
                <Badge className={getComplexityColor(framework.complexity)}>
                  {framework.complexity}
                </Badge>
              </div>

              <CardTitle className="text-lg line-clamp-2">
                {framework.title}
              </CardTitle>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {framework.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">
                      {framework.popularity_score}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Popularity
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">
                      {framework.success_rate}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Success Rate
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{framework.timeframe}</span>
                </div>
                <span className="text-muted-foreground">
                  Updated {formatDate(framework.last_updated)}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={framework.author.avatar} />
                  <AvatarFallback>
                    {framework.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div key={index}>
                  <div className="text-sm font-medium">
                    {framework.author.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {framework.author.credentials}
                  </div>
                </div>
              </div>

              {/* Applicability */}
              <div className="flex flex-wrap gap-1">
                {framework.applicability.slice(0, 2).map((app, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {app}
                  </Badge>
                ))}
                {framework.applicability.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{framework.applicability.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedFramework(framework)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onFrameworkSelect?.(framework)}
                >
                  Use Framework
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredFrameworks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No frameworks found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedComplexity("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Framework Detail Modal */}
      {selectedFramework && (
        <Dialog
          open={!!selectedFramework}
          onOpenChange={() => setSelectedFramework(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getCategoryIcon(selectedFramework.category)}
                <span>{selectedFramework.title}</span>
                <Badge
                  className={getComplexityColor(selectedFramework.complexity)}
                >
                  {selectedFramework.complexity}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Overview */}
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-muted-foreground">
                    {selectedFramework.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedFramework.popularity_score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Popularity Score
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedFramework.success_rate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedFramework.timeframe}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Timeline
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="steps" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="prerequisites">
                      Prerequisites
                    </TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="cases">Case Studies</TabsTrigger>
                    <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="steps" className="space-y-4">
                    {selectedFramework.steps.map((step, index) => (
                      <Card key={step.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span>{step.title}</span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Deliverables</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.deliverables.map((deliverable, idx) => (
                                  <li key={idx} key={idx}>• {deliverable}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">
                                Success Criteria
                              </h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.success_criteria.map((criteria, idx) => (
                                  <li key={idx} key={idx}>• {criteria}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="secondary">
                              Duration: {step.duration}
                            </Badge>
                            <span className="text-muted-foreground">
                              Tools: {step.tools_required.join(", ")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="prerequisites">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-2">
                          {selectedFramework.prerequisites.map(
                            (prereq, index) => (
                              <li key={index}
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Badge
                                  variant="outline"
                                  className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                                >
                                  {index + 1}
                                </Badge>
                                <span>{prereq}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="space-y-3">
                      {selectedFramework.resources.map((resource, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="secondary"
                                  className="capitalize"
                                >
                                  {resource.type}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  Access
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="cases">
                    <div className="space-y-4">
                      {selectedFramework.case_studies.map(
                        (caseStudy, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">
                                    {caseStudy.company}
                                  </h4>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <div>Industry: {caseStudy.industry}</div>
                                    <div>Size: {caseStudy.size}</div>
                                    <div>Timeline: {caseStudy.timeline}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-lg font-semibold text-green-600 mb-2">
                                    {caseStudy.outcome}
                                  </div>
                                  <div className="text-sm">
                                    <strong>Key Learnings:</strong>
                                    <ul className="mt-1 space-y-1">
                                      {caseStudy.key_learnings.map(
                                        (learning, idx) => (
                                          <li key={idx}
                                            key={idx}
                                            className="text-muted-foreground"
                                          >
                                            • {learning}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ),
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="outcomes">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Expected Outcomes</h4>
                          <ul className="space-y-2">
                            {selectedFramework.outcomes.map(
                              (outcome, index) => (
                                <li key={index}
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <span>{outcome}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onFrameworkSelect?.(selectedFramework);
                      setSelectedFramework(null);
                    }}
                  >
                    Use This Framework
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save to Library
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
