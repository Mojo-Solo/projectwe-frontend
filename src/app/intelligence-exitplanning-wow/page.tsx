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
  MessageSquare,
  Plus,
  Trash2,
  X,
  Database,
  Activity,
  Calendar,
  MapPin,
  PlayCircle,
  Rocket,
  Info,
  HelpCircle,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FirstTimeUserGuide } from "@/components/intelligence/FirstTimeUserGuide";
import { WhyThisMatters } from "@/components/intelligence/WhyThisMatters";
import { MinimalProgressBar } from "@/components/intelligence/MinimalProgressBar";
import { FloatingHelpButton } from "@/components/intelligence/FloatingHelpButton";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface ClientInfo {
  companyName: string;
  ownerName: string;
  industry: string;
  yearsInBusiness: number;
  exitTimeframe: string;
  exitGoals: string;
}

interface ValuationFactors {
  revenue: number;
  ebitda: number;
  growthRate: number;
  customerConcentration: number;
  recurringRevenue: number;
  managementDepth: number;
}

interface Framework {
  id: string;
  name: string;
  description: string;
  relevanceScore: number;
  selected: boolean;
  category:
    | "valuation"
    | "succession"
    | "tax"
    | "operations"
    | "financial"
    | "legal";
}

interface BestPractice {
  id: string;
  practice: string;
  impact: string;
  selected: boolean;
  priority: "high" | "medium" | "low";
}

// Julie Keyes' 42 Frameworks (from processed documents)
const JULIE_KEYES_FRAMEWORKS: Framework[] = [
  // Valuation Frameworks
  {
    id: "f1",
    name: "7-Step Exit Success Framework",
    description:
      "Comprehensive exit planning methodology covering assessment to execution",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f2",
    name: "Value Acceleration Methodology",
    description: "Strategic framework to increase business value 25-40%",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f3",
    name: "EBITDA Normalization Process",
    description: "Adjust financials to show true earning capacity",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f4",
    name: "Multiple Enhancement Strategy",
    description: "Improve valuation multiples through strategic positioning",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f5",
    name: "Recurring Revenue Optimization",
    description: "Convert one-time sales to subscription model",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },

  // Succession Frameworks
  {
    id: "f6",
    name: "Family Business Succession Model",
    description: "Navigate family dynamics in ownership transition",
    relevanceScore: 0,
    selected: false,
    category: "succession",
  },
  {
    id: "f7",
    name: "Management Buyout Structure",
    description: "Enable key employees to purchase the business",
    relevanceScore: 0,
    selected: false,
    category: "succession",
  },
  {
    id: "f8",
    name: "ESOP Implementation Guide",
    description: "Tax-advantaged employee ownership transition",
    relevanceScore: 0,
    selected: false,
    category: "succession",
  },
  {
    id: "f9",
    name: "Leadership Development Pipeline",
    description: "Build successor capabilities over 24-36 months",
    relevanceScore: 0,
    selected: false,
    category: "succession",
  },
  {
    id: "f10",
    name: "Owner Dependency Reduction",
    description: "Systematically reduce reliance on owner involvement",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },

  // Tax Optimization Frameworks
  {
    id: "f11",
    name: "Tax-Efficient Deal Structure",
    description: "Minimize tax liability through strategic structuring",
    relevanceScore: 0,
    selected: false,
    category: "tax",
  },
  {
    id: "f12",
    name: "Installment Sale Strategy",
    description: "Defer taxes through payment over time",
    relevanceScore: 0,
    selected: false,
    category: "tax",
  },
  {
    id: "f13",
    name: "1031 Exchange Planning",
    description: "Defer capital gains through like-kind exchange",
    relevanceScore: 0,
    selected: false,
    category: "tax",
  },
  {
    id: "f14",
    name: "Charitable Remainder Trust",
    description: "Reduce taxes while supporting charity",
    relevanceScore: 0,
    selected: false,
    category: "tax",
  },
  {
    id: "f15",
    name: "QSBS Tax Exemption",
    description: "Qualify for up to 100% capital gains exclusion",
    relevanceScore: 0,
    selected: false,
    category: "tax",
  },

  // Operations Excellence
  {
    id: "f16",
    name: "Process Documentation System",
    description: "Create comprehensive operations manual",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },
  {
    id: "f17",
    name: "Customer Diversification Strategy",
    description: "Reduce concentration risk systematically",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },
  {
    id: "f18",
    name: "Scalability Assessment",
    description: "Identify and remove growth constraints",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },
  {
    id: "f19",
    name: "Technology Stack Optimization",
    description: "Modernize systems for buyer appeal",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },
  {
    id: "f20",
    name: "Quality Management System",
    description: "Implement ISO-level quality controls",
    relevanceScore: 0,
    selected: false,
    category: "operations",
  },

  // Financial Preparation
  {
    id: "f21",
    name: "Three-Year Financial Cleanup",
    description: "Prepare auditable financial statements",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f22",
    name: "Working Capital Analysis",
    description: "Optimize cash flow and working capital",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f23",
    name: "Quality of Earnings Preparation",
    description: "Prepare for buyer due diligence",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f24",
    name: "KPI Dashboard Development",
    description: "Track metrics that drive valuation",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f25",
    name: "Budget vs Actual Analysis",
    description: "Demonstrate financial control and predictability",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },

  // Market Positioning
  {
    id: "f26",
    name: "Strategic Buyer Identification",
    description: "Map potential acquirers and synergies",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f27",
    name: "Competitive Positioning Analysis",
    description: "Differentiate from market competitors",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f28",
    name: "Growth Story Development",
    description: "Craft compelling narrative for buyers",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f29",
    name: "Market Timing Strategy",
    description: "Optimize exit timing for market conditions",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f30",
    name: "Industry Roll-up Positioning",
    description: "Position as platform for consolidation",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },

  // Legal & Compliance
  {
    id: "f31",
    name: "IP Portfolio Optimization",
    description: "Protect and document intellectual property",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },
  {
    id: "f32",
    name: "Contract Standardization",
    description: "Clean up customer and vendor agreements",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },
  {
    id: "f33",
    name: "Compliance Audit Framework",
    description: "Ensure regulatory compliance across operations",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },
  {
    id: "f34",
    name: "Risk Mitigation Strategy",
    description: "Identify and address potential deal killers",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },
  {
    id: "f35",
    name: "Employment Agreement Review",
    description: "Ensure clean transfer of key employees",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },

  // Deal Execution
  {
    id: "f36",
    name: "LOI Negotiation Framework",
    description: "Maximize terms in letter of intent",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f37",
    name: "Due Diligence Preparation",
    description: "Organize data room and anticipate requests",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f38",
    name: "Earn-out Structure Design",
    description: "Bridge valuation gaps with performance payments",
    relevanceScore: 0,
    selected: false,
    category: "valuation",
  },
  {
    id: "f39",
    name: "Representation & Warranty Strategy",
    description: "Minimize post-closing liability",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },
  {
    id: "f40",
    name: "Closing Process Management",
    description: "Navigate from LOI to closing efficiently",
    relevanceScore: 0,
    selected: false,
    category: "legal",
  },

  // Post-Exit Planning
  {
    id: "f41",
    name: "Wealth Preservation Strategy",
    description: "Protect proceeds through proper planning",
    relevanceScore: 0,
    selected: false,
    category: "financial",
  },
  {
    id: "f42",
    name: "Life After Exit Framework",
    description: "Plan meaningful post-business activities",
    relevanceScore: 0,
    selected: false,
    category: "succession",
  },
];

// Best Practices from Julie Keyes
const BEST_PRACTICES: BestPractice[] = [
  {
    id: "bp1",
    practice: "Start exit planning 3-5 years before intended exit",
    impact: "Increases value by 35-50%",
    selected: false,
    priority: "high",
  },
  {
    id: "bp2",
    practice: "Document all business processes and procedures",
    impact: "Reduces buyer risk perception",
    selected: false,
    priority: "high",
  },
  {
    id: "bp3",
    practice: "Diversify customer base below 20% concentration",
    impact: "Improves multiple by 1-2x",
    selected: false,
    priority: "high",
  },
  {
    id: "bp4",
    practice: "Build strong second-tier management",
    impact: "Adds 15-20% premium",
    selected: false,
    priority: "high",
  },
  {
    id: "bp5",
    practice: "Convert to recurring revenue model",
    impact: "Increases multiple by 2-3x",
    selected: false,
    priority: "high",
  },
  {
    id: "bp6",
    practice: "Clean up financial statements for 3 years",
    impact: "Builds buyer confidence",
    selected: false,
    priority: "medium",
  },
  {
    id: "bp7",
    practice: "Implement professional financial controls",
    impact: "Reduces due diligence issues",
    selected: false,
    priority: "medium",
  },
  {
    id: "bp8",
    practice: "Protect intellectual property formally",
    impact: "Preserves intangible value",
    selected: false,
    priority: "medium",
  },
  {
    id: "bp9",
    practice: "Create detailed growth plan for buyers",
    impact: "Justifies higher multiples",
    selected: false,
    priority: "medium",
  },
  {
    id: "bp10",
    practice: "Address any litigation or compliance issues",
    impact: "Prevents deal failures",
    selected: false,
    priority: "high",
  },
];

// Demo scenarios for different industries
const DEMO_SCENARIOS = [
  {
    id: "manufacturing",
    name: "Manufacturing Excellence",
    clientInfo: {
      companyName: "Precision Manufacturing Inc",
      ownerName: "Robert Chen",
      industry: "Advanced Manufacturing",
      yearsInBusiness: 22,
      exitTimeframe: "3-5 years",
      exitGoals:
        "Maximize value through strategic buyer acquisition, ensure employee continuity, maintain quality legacy",
    },
    valuationFactors: {
      revenue: 12500000,
      ebitda: 2750000,
      growthRate: 18,
      customerConcentration: 35,
      recurringRevenue: 45,
      managementDepth: 65,
    },
  },
  {
    id: "saas",
    name: "SaaS High Growth",
    clientInfo: {
      companyName: "CloudTech Solutions",
      ownerName: "Sarah Martinez",
      industry: "Software as a Service",
      yearsInBusiness: 8,
      exitTimeframe: "1-2 years",
      exitGoals:
        "Achieve maximum valuation multiple, find strategic acquirer for product synergies, retain key technical team",
    },
    valuationFactors: {
      revenue: 8000000,
      ebitda: 1600000,
      growthRate: 45,
      customerConcentration: 15,
      recurringRevenue: 92,
      managementDepth: 75,
    },
  },
  {
    id: "professional",
    name: "Professional Services",
    clientInfo: {
      companyName: "Strategic Consulting Group",
      ownerName: "Michael Thompson",
      industry: "Management Consulting",
      yearsInBusiness: 15,
      exitTimeframe: "3-5 years",
      exitGoals:
        "Transition to employee ownership, preserve company culture, ensure client relationships continue",
    },
    valuationFactors: {
      revenue: 6200000,
      ebitda: 1550000,
      growthRate: 12,
      customerConcentration: 28,
      recurringRevenue: 35,
      managementDepth: 55,
    },
  },
  {
    id: "healthcare",
    name: "Healthcare Services",
    clientInfo: {
      companyName: "Regional Health Partners",
      ownerName: "Dr. Lisa Anderson",
      industry: "Healthcare Services",
      yearsInBusiness: 18,
      exitTimeframe: "<1 year",
      exitGoals:
        "Quick exit due to health reasons, maintain patient care standards, protect staff positions",
    },
    valuationFactors: {
      revenue: 15000000,
      ebitda: 3200000,
      growthRate: 22,
      customerConcentration: 20,
      recurringRevenue: 78,
      managementDepth: 82,
    },
  },
];

export default function ExitPlanningWowDashboard() {
  return (
    <TooltipProvider>
      <ExitPlanningDashboardContent />
    </TooltipProvider>
  );
}

function ExitPlanningDashboardContent() {
  const [showFirstTimeGuide, setShowFirstTimeGuide] = useState(false); // Set to true for first-time users
  const [currentTab, setCurrentTab] = useState("client");
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    companyName: "",
    ownerName: "",
    industry: "",
    yearsInBusiness: 0,
    exitTimeframe: "",
    exitGoals: "",
  });

  const [valuationFactors, setValuationFactors] = useState<ValuationFactors>({
    revenue: 5000000,
    ebitda: 1000000,
    growthRate: 15,
    customerConcentration: 25,
    recurringRevenue: 60,
    managementDepth: 70,
  });

  const [currentValuation, setCurrentValuation] = useState(0);
  const [optimizedValuation, setOptimizedValuation] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);
  const [frameworks, setFrameworks] = useState(JULIE_KEYES_FRAMEWORKS);
  const [bestPractices, setBestPractices] = useState(BEST_PRACTICES);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newCustomItem, setNewCustomItem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocuments, setGeneratedDocuments] = useState<any[]>([]);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>("");

  // Calculate valuation and relevance scores in real-time
  useEffect(() => {
    // Valuation calculation
    const baseMultiple = 4.5;
    const growthAdjustment = valuationFactors.growthRate > 20 ? 1.5 : 1;
    const recurringAdjustment =
      valuationFactors.recurringRevenue > 70 ? 1.3 : 1;
    const concentrationPenalty =
      valuationFactors.customerConcentration > 30 ? 0.8 : 1;
    const managementBonus = valuationFactors.managementDepth > 80 ? 1.2 : 1;

    const adjustedMultiple =
      baseMultiple *
      growthAdjustment *
      recurringAdjustment *
      concentrationPenalty *
      managementBonus;

    const valuation = valuationFactors.ebitda * adjustedMultiple;
    setCurrentValuation(valuation);

    const optimizedMultiple = baseMultiple * 1.5 * 1.3 * 1 * 1.2;
    setOptimizedValuation(valuationFactors.ebitda * optimizedMultiple);

    // Calculate readiness score
    const score =
      (valuationFactors.recurringRevenue / 100) * 25 +
      (valuationFactors.managementDepth / 100) * 25 +
      ((100 - valuationFactors.customerConcentration) / 100) * 25 +
      (valuationFactors.growthRate > 15
        ? 25
        : (valuationFactors.growthRate / 15) * 25);
    setReadinessScore(Math.round(score));

    // Update framework relevance scores based on client data
    const updatedFrameworks = JULIE_KEYES_FRAMEWORKS.map((framework) => {
      let relevance = 0.5; // Base relevance

      // Adjust based on client factors
      if (
        framework.category === "succession" &&
        clientInfo.exitTimeframe === "1-2 years"
      ) {
        relevance += 0.3;
      }
      if (framework.category === "tax" && currentValuation > 10000000) {
        relevance += 0.25;
      }
      if (
        framework.category === "valuation" &&
        valuationFactors.recurringRevenue < 50
      ) {
        relevance += 0.2;
      }
      if (
        framework.category === "operations" &&
        valuationFactors.managementDepth < 60
      ) {
        relevance += 0.25;
      }
      if (
        framework.category === "financial" &&
        clientInfo.yearsInBusiness > 10
      ) {
        relevance += 0.15;
      }

      // Auto-select high relevance frameworks
      const autoSelect = relevance > 0.7;

      return {
        ...framework,
        relevanceScore: Math.min(relevance, 1),
        selected: autoSelect,
      };
    });

    setFrameworks(updatedFrameworks);

    // Update best practices selection based on client situation
    const updatedPractices = BEST_PRACTICES.map((practice) => {
      let shouldSelect = false;

      if (practice.id === "bp1" && clientInfo.exitTimeframe === "3-5 years")
        shouldSelect = true;
      if (practice.id === "bp3" && valuationFactors.customerConcentration > 30)
        shouldSelect = true;
      if (practice.id === "bp4" && valuationFactors.managementDepth < 60)
        shouldSelect = true;
      if (practice.id === "bp5" && valuationFactors.recurringRevenue < 50)
        shouldSelect = true;

      return { ...practice, selected: shouldSelect };
    });

    setBestPractices(updatedPractices);
  }, [valuationFactors, clientInfo, currentValuation]);

  const generateDocuments = async () => {
    if (!clientInfo.companyName || !clientInfo.ownerName) {
      alert("Please enter company and owner information first");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/intelligence/generate-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientInfo,
          valuationFactors,
          currentValuation,
          optimizedValuation,
          readinessScore,
          frameworks: frameworks.filter((f) => f.selected),
          bestPractices: bestPractices.filter((bp) => bp.selected),
          customItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate documents");
      }

      const data = await response.json();

      if (data.success && data.documents) {
        setGeneratedDocuments(data.documents);
        setShowDocumentViewer(true);
      }
    } catch (error) {
      console.error("Error generating documents:", error);
      alert("Failed to generate documents. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addCustomItem = () => {
    if (newCustomItem.trim()) {
      setCustomItems([...customItems, newCustomItem]);
      setNewCustomItem("");
    }
  };

  const removeCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index));
  };

  // Load demo scenario
  const loadDemoScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      setClientInfo(scenario.clientInfo);
      setValuationFactors(scenario.valuationFactors);
      setSelectedDemo(scenarioId);
      setShowDemoSelector(false);

      // Show a success message
      const message = `Demo loaded: ${scenario.name} - ${scenario.clientInfo.companyName}`;
      console.log(message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* First Time User Guide */}
      {showFirstTimeGuide && (
        <FirstTimeUserGuide
          onComplete={() => {
            setShowFirstTimeGuide(false);
            setShowDemoSelector(true);
          }}
          onSkip={() => setShowFirstTimeGuide(false)}
        />
      )}
      {/* Header with Utility Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Exit Planning Intelligence Suite™
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered exit planning using Julie Keyes&apos; expertise
            </p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowDemoSelector(true)}
                  className="gap-2"
                  size="default"
                >
                  <PlayCircle className="h-4 w-4" />
                  One-Click Demo
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">Try Demo First!</p>
                <p className="text-xs">
                  See how our AI personalizes recommendations for different
                  business scenarios
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Subtle Technical Analysis Button */}
            <Link href="/intelligence-technical-analysis">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <Code className="h-3 w-3 mr-1" />
                Technical Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Proof Stats - More Subtle */}
        {selectedDemo && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Demo Mode:{" "}
              {DEMO_SCENARIOS.find((s) => s.id === selectedDemo)?.name}
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Quick Stats Bar - Hidden by default, shown on hover */}
      <motion.div
        className="mb-4 group"
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <Database className="h-3 w-3" />
                <span>103 Documents</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Julie Keyes&apos; complete knowledge base processed
              </p>
            </TooltipContent>
          </Tooltip>
          <span>•</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <Brain className="h-3 w-3" />
                <span>8,743 Vectors</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">AI embeddings for intelligent matching</p>
            </TooltipContent>
          </Tooltip>
          <span>•</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <Activity className="h-3 w-3" />
                <span>Live Intelligence</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Real-time personalized recommendations</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>

      {/* Minimal Progress Bar */}
      <MinimalProgressBar currentTab={currentTab} />

      <Tabs
        defaultValue="client"
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger
            value="client"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Client Info
          </TabsTrigger>
          <TabsTrigger
            value="valuation"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Valuation
          </TabsTrigger>
          <TabsTrigger
            value="roadmap"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Roadmap
          </TabsTrigger>
          <TabsTrigger
            value="frameworks"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Frameworks
          </TabsTrigger>
          <TabsTrigger
            value="practices"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Best Practices
          </TabsTrigger>
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            Generate
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm"
          >
            AI Assistant
          </TabsTrigger>
        </TabsList>

        {/* Intelligence Proof Tab - Hidden from main tabs, accessible via utility menu */}
        <TabsContent value="proof" className="space-y-4">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentTab("client")}
              className="flex items-center gap-1"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back to Exit Planning
            </Button>
          </div>
          <IntelligenceProofPanel />
        </TabsContent>

        {/* Client Information Tab */}
        <TabsContent value="client" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Enter business details for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={clientInfo.companyName}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        companyName: e.target.value,
                      })
                    }
                    placeholder="ABC Manufacturing Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="owner">Owner Name *</Label>
                  <Input
                    id="owner"
                    value={clientInfo.ownerName}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        ownerName: e.target.value,
                      })
                    }
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={clientInfo.industry}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, industry: e.target.value })
                    }
                    placeholder="Manufacturing"
                  />
                </div>
                <div>
                  <Label htmlFor="years">Years in Business</Label>
                  <Input
                    id="years"
                    type="number"
                    value={clientInfo.yearsInBusiness}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        yearsInBusiness: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="15"
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Exit Timeframe</Label>
                  <select
                    id="timeframe"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={clientInfo.exitTimeframe}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        exitTimeframe: e.target.value,
                      })
                    }
                  >
                    <option value="">Select timeframe</option>
                    <option value="<1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="goals">Exit Goals & Objectives</Label>
                  <Textarea
                    id="goals"
                    value={clientInfo.exitGoals}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        exitGoals: e.target.value,
                      })
                    }
                    placeholder="Maximize value, ensure employee continuity, maintain legacy..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Valuation Tab */}
        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Business Valuation Calculator
              </CardTitle>
              <CardDescription>
                Adjust factors to see real-time valuation impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Sliders - Left 2 columns */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label className="text-xs">
                        Revenue: $
                        {(valuationFactors.revenue / 1000000).toFixed(1)}M
                      </Label>
                      <Slider
                        value={[valuationFactors.revenue]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            revenue: v,
                          }))
                        }
                        min={1000000}
                        max={20000000}
                        step={100000}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        EBITDA: $
                        {(valuationFactors.ebitda / 1000000).toFixed(1)}M
                      </Label>
                      <Slider
                        value={[valuationFactors.ebitda]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            ebitda: v,
                          }))
                        }
                        min={100000}
                        max={5000000}
                        step={50000}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Growth Rate: {valuationFactors.growthRate}%
                      </Label>
                      <Slider
                        value={[valuationFactors.growthRate]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            growthRate: v,
                          }))
                        }
                        min={0}
                        max={50}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Customer Concentration:{" "}
                        {valuationFactors.customerConcentration}%
                      </Label>
                      <Slider
                        value={[valuationFactors.customerConcentration]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            customerConcentration: v,
                          }))
                        }
                        min={5}
                        max={80}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Recurring Revenue: {valuationFactors.recurringRevenue}%
                      </Label>
                      <Slider
                        value={[valuationFactors.recurringRevenue]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            recurringRevenue: v,
                          }))
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Management Depth: {valuationFactors.managementDepth}%
                      </Label>
                      <Slider
                        value={[valuationFactors.managementDepth]}
                        onValueChange={([v]) =>
                          setValuationFactors((prev) => ({
                            ...prev,
                            managementDepth: v,
                          }))
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Results - Right column */}
                <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current Value
                    </p>
                    <p className="text-2xl font-bold">
                      ${(currentValuation / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Optimized Value
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(optimizedValuation / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Potential Gain
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      +$
                      {(
                        (optimizedValuation - currentValuation) /
                        1000000
                      ).toFixed(1)}
                      M
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Exit Readiness</span>
                      <span className="text-xs font-bold">
                        {readinessScore}%
                      </span>
                    </div>
                    <Progress value={readinessScore} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-4">
          <ExitRoadmapBuilder
            clientInfo={clientInfo}
            valuationFactors={valuationFactors}
            selectedFrameworks={frameworks.filter((f) => f.selected)}
            currentValuation={currentValuation}
            optimizedValuation={optimizedValuation}
          />
        </TabsContent>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Planning Frameworks</CardTitle>
              <CardDescription>
                AI has pre-selected{" "}
                {frameworks.filter((f) => f.selected).length} of 42 frameworks
                based on your situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                {[
                  "valuation",
                  "succession",
                  "tax",
                  "operations",
                  "financial",
                  "legal",
                ].map((category) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      {category === "valuation" && (
                        <TrendingUp className="h-4 w-4" />
                      )}
                      {category === "succession" && (
                        <Users className="h-4 w-4" />
                      )}
                      {category === "tax" && <Shield className="h-4 w-4" />}
                      {category === "operations" && (
                        <Building2 className="h-4 w-4" />
                      )}
                      {category === "financial" && (
                        <DollarSign className="h-4 w-4" />
                      )}
                      {category === "legal" && (
                        <Briefcase className="h-4 w-4" />
                      )}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {
                          frameworks.filter(
                            (f) => f.category === category && f.selected,
                          ).length
                        }
                        /
                        {
                          frameworks.filter((f) => f.category === category)
                            .length
                        }
                      </Badge>
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {frameworks
                        .filter((f) => f.category === category)
                        .map((framework) => (
                          <div
                            key={framework.id}
                            className="flex items-start gap-2 p-2 rounded hover:bg-muted/50"
                          >
                            <Checkbox
                              checked={framework.selected}
                              onCheckedChange={(checked) => {
                                setFrameworks(
                                  frameworks.map((f) =>
                                    f.id === framework.id
                                      ? { ...f, selected: checked as boolean }
                                      : f,
                                  ),
                                );
                              }}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium leading-tight">
                                {framework.name}
                                {framework.relevanceScore > 0.7 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs ml-1 inline"
                                  >
                                    AI
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {framework.description}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Planning Best Practices</CardTitle>
              <CardDescription>
                Proven strategies that increase business value and ensure
                successful exits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestPractices.map((practice) => (
                  <div
                    key={practice.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      checked={practice.selected}
                      onCheckedChange={(checked) => {
                        setBestPractices(
                          bestPractices.map((bp) =>
                            bp.id === practice.id
                              ? { ...bp, selected: checked as boolean }
                              : bp,
                          ),
                        );
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{practice.practice}</p>
                        <Badge
                          variant={
                            practice.priority === "high"
                              ? "destructive"
                              : practice.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {practice.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Impact: {practice.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-3">Custom Action Items</h3>
                <div className="space-y-3">
                  {customItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <p className="flex-1">{item}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCustomItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newCustomItem}
                      onChange={(e) => setNewCustomItem(e.target.value)}
                      placeholder="Add custom action item..."
                      onKeyPress={(e) => e.key === "Enter" && addCustomItem()}
                    />
                    <Button onClick={addCustomItem}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Documents Tab */}
        <TabsContent value="generate" className="space-y-4">
          {/* Intelligence Processing Visual */}
          <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    ML/VDB Document Generation Engine
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Leveraging 8,743 vector embeddings from Julie Keyes&apos;
                    knowledge base
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    {frameworks.filter((f) => f.selected).length +
                      bestPractices.filter((bp) => bp.selected).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Elements Selected
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm">Pinecone Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm">Vector Search Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-sm">AI Generation Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Exit Planning Documents</CardTitle>
              <CardDescription>
                AI-powered document generation using extracted intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary of selections */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {frameworks.filter((f) => f.selected).length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Frameworks Selected
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {bestPractices.filter((bp) => bp.selected).length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Best Practices
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {customItems.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Custom Items
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Document preview */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Documents to be generated:
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Executive Exit Planning Summary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Detailed Valuation Analysis
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">
                        Personalized Exit Timeline
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">
                        Tax Optimization Strategies
                      </span>
                    </div>
                    {frameworks.some(
                      (f) => f.selected && f.category === "succession",
                    ) && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <span className="text-sm">
                          Succession Planning Roadmap
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={generateDocuments}
                  disabled={isGenerating || !clientInfo.companyName}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Documents...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Generate Exit Planning Package
                    </>
                  )}
                </Button>

                {generatedDocuments.length > 0 && !showDocumentViewer && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Success!</strong> Generated{" "}
                      {generatedDocuments.length} documents
                      <Button
                        className="mt-2"
                        onClick={() => setShowDocumentViewer(true)}
                      >
                        View Documents
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Exit Planning AI Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about exit planning strategies and get expert
                guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <NLPChatInterface
                namespace="exit-planning-documents"
                apiEndpoint="http://localhost:8000/api/v1/intelligence/query"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Viewer Modal */}
      {showDocumentViewer && generatedDocuments.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Generated Documents</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocumentViewer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <DocumentViewer
                documents={generatedDocuments}
                clientName={clientInfo.companyName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Demo Selector Modal */}
      {showDemoSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-lg max-w-4xl w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-primary" />
                  One-Click Demo Scenarios
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-5 w-5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-sm">
                      <p className="font-semibold mb-1">Demo Mode Guide</p>
                      <p className="text-xs mb-2">
                        Each scenario represents a different business situation:
                      </p>
                      <ul className="text-xs space-y-1">
                        <li>
                          • <strong>Manufacturing:</strong> Traditional business
                          with operational challenges
                        </li>
                        <li>
                          • <strong>SaaS:</strong> High-growth tech company
                          ready for strategic exit
                        </li>
                        <li>
                          • <strong>Professional:</strong> Service business
                          ideal for employee ownership
                        </li>
                        <li>
                          • <strong>Healthcare:</strong> Urgent exit with strong
                          fundamentals
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </h2>
                <p className="text-muted-foreground mt-1">
                  Select a pre-configured scenario to instantly populate all
                  fields
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDemoSelector(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Step by Step Guide */}
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  How This Demo Works - 3 Simple Steps:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Choose a Scenario Below</p>
                      <p className="text-muted-foreground">
                        Pick the one closest to your business type to see
                        relevant strategies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Watch the Magic Happen</p>
                      <p className="text-muted-foreground">
                        All fields populate instantly and AI selects relevant
                        frameworks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Explore All Features</p>
                      <p className="text-muted-foreground">
                        Click through tabs to see valuations, roadmaps, and AI
                        recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {DEMO_SCENARIOS.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer hover:border-primary transition-all group relative"
                    onClick={() => loadDemoScenario(scenario.id)}
                  >
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-semibold mb-1">
                            Click to Load Demo
                          </p>
                          <p className="text-xs">
                            This will populate all fields with realistic data
                            for this scenario. You can then explore how our AI
                            adapts its recommendations.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {scenario.name}
                        </CardTitle>
                        {scenario.valuationFactors.growthRate > 30 && (
                          <Badge variant="default">High Growth</Badge>
                        )}
                      </div>
                      <CardDescription>
                        {scenario.clientInfo.industry}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Company</span>
                          <span className="font-medium">
                            {scenario.clientInfo.companyName}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-medium">
                            $
                            {(
                              scenario.valuationFactors.revenue / 1000000
                            ).toFixed(1)}
                            M
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Exit Timeline
                          </span>
                          <span className="font-medium">
                            {scenario.clientInfo.exitTimeframe}
                          </span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help">
                                <p className="text-xs text-muted-foreground">
                                  Growth
                                </p>
                                <p className="font-semibold">
                                  {scenario.valuationFactors.growthRate}%
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Annual revenue growth rate - higher growth
                                typically commands premium valuations
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help">
                                <p className="text-xs text-muted-foreground">
                                  Recurring
                                </p>
                                <p className="font-semibold">
                                  {scenario.valuationFactors.recurringRevenue}%
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                % of revenue that&apos;s predictable/recurring -
                                key value driver for buyers
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help">
                                <p className="text-xs text-muted-foreground">
                                  EBITDA
                                </p>
                                <p className="font-semibold">
                                  {(
                                    (scenario.valuationFactors.ebitda /
                                      scenario.valuationFactors.revenue) *
                                    100
                                  ).toFixed(0)}
                                  %
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                EBITDA margin - shows profitability and
                                operational efficiency
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Alert className="mt-3">
                          <Lightbulb className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            {scenario.id === "manufacturing" &&
                              "Classic manufacturing exit with customer concentration challenges"}
                            {scenario.id === "saas" &&
                              "High-growth SaaS with excellent metrics ready for strategic buyer"}
                            {scenario.id === "professional" &&
                              "Service business ideal for ESOP or management buyout"}
                            {scenario.id === "healthcare" &&
                              "Accelerated exit scenario with strong fundamentals"}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-6 border-primary">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Mode:</strong> These scenarios use realistic data
                to demonstrate the full power of our ML/VDB intelligence system.
                All calculations, frameworks, and recommendations will be
                tailored to the selected company profile.
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Info className="h-3 w-3" />
                  <span>
                    After loading a demo, explore all tabs to see how AI
                    personalizes recommendations for each business.
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      )}

      {/* Floating Help Button */}
      <FloatingHelpButton
        currentTab={currentTab}
        hasCompletedDemo={selectedDemo !== ""}
        hasEnteredInfo={clientInfo.companyName !== ""}
        hasCalculatedValue={currentValuation > 0}
        onOpenGuide={() => setShowFirstTimeGuide(true)}
      />
    </div>
  );
}
