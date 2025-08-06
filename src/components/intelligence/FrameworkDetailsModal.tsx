"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  Users,
  Shield,
  Building2,
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle2,
  Star,
} from "lucide-react";

interface Framework {
  name: string;
  description: string;
  keyComponents: string[];
  useCase: string;
  popularity: "high" | "medium" | "low";
}

interface FrameworkCategory {
  category: string;
  count: number;
  icon: any;
  frameworks: Framework[];
}

const frameworkData: Record<string, Framework[]> = {
  Valuation: [
    {
      name: "7-Step Exit Success Framework",
      description:
        "Comprehensive valuation methodology covering all aspects of business value",
      keyComponents: [
        "Financial Analysis",
        "Market Positioning",
        "Growth Potential",
        "Risk Assessment",
      ],
      useCase: "Best for established businesses with 3+ years of financials",
      popularity: "high",
    },
    {
      name: "Value Acceleration Methodology",
      description:
        "Focuses on identifying and maximizing value drivers before exit",
      keyComponents: [
        "Value Drivers",
        "Gap Analysis",
        "Action Planning",
        "Timeline",
      ],
      useCase: "Ideal for businesses 18-24 months from exit",
      popularity: "high",
    },
    {
      name: "EBITDA Normalization Process",
      description: "Standardizes earnings to show true business performance",
      keyComponents: [
        "Add-backs",
        "One-time Expenses",
        "Owner Benefits",
        "Market Adjustments",
      ],
      useCase: "Critical for all valuations to show normalized earnings",
      popularity: "high",
    },
    {
      name: "Multiple Selection Matrix",
      description:
        "Determines appropriate valuation multiples based on industry and size",
      keyComponents: [
        "Industry Benchmarks",
        "Size Premiums",
        "Growth Factors",
        "Risk Discounts",
      ],
      useCase: "Essential for market-based valuations",
      popularity: "medium",
    },
    {
      name: "DCF Valuation Model",
      description: "Projects future cash flows and discounts to present value",
      keyComponents: [
        "Cash Flow Projections",
        "Terminal Value",
        "Discount Rate",
        "Sensitivity Analysis",
      ],
      useCase: "Best for high-growth or unique businesses",
      popularity: "medium",
    },
    {
      name: "Asset-Based Valuation",
      description: "Values business based on tangible and intangible assets",
      keyComponents: [
        "Tangible Assets",
        "Intangible Assets",
        "Goodwill",
        "Liabilities",
      ],
      useCase: "Suitable for asset-heavy or distressed businesses",
      popularity: "low",
    },
    {
      name: "Market Comps Analysis",
      description: "Compares business to similar recent transactions",
      keyComponents: [
        "Comparable Transactions",
        "Size Adjustments",
        "Market Conditions",
        "Premium Analysis",
      ],
      useCase: "Provides market validation for valuation",
      popularity: "high",
    },
    {
      name: "Strategic Value Assessment",
      description: "Identifies additional value for strategic buyers",
      keyComponents: [
        "Synergies",
        "Market Access",
        "Technology Value",
        "Customer Base",
      ],
      useCase: "Important when targeting strategic acquirers",
      popularity: "medium",
    },
    {
      name: "Risk-Adjusted Valuation",
      description: "Adjusts value based on specific business risks",
      keyComponents: [
        "Customer Concentration",
        "Key Person Risk",
        "Market Risk",
        "Operational Risk",
      ],
      useCase: "Critical for businesses with identifiable risks",
      popularity: "medium",
    },
    {
      name: "Quality of Earnings Analysis",
      description: "Deep dive into earnings quality and sustainability",
      keyComponents: [
        "Revenue Quality",
        "Expense Analysis",
        "Working Capital",
        "Sustainability",
      ],
      useCase: "Required for serious buyers and higher valuations",
      popularity: "high",
    },
  ],
  Succession: [
    {
      name: "Family Business Transition Model",
      description: "Structured approach for passing business to family members",
      keyComponents: [
        "Successor Assessment",
        "Training Plan",
        "Governance Structure",
        "Tax Planning",
      ],
      useCase: "Essential for family business continuity",
      popularity: "high",
    },
    {
      name: "Management Buyout (MBO) Structure",
      description: "Framework for selling to existing management team",
      keyComponents: [
        "Management Assessment",
        "Financing Structure",
        "Earnout Terms",
        "Transition Plan",
      ],
      useCase: "Best when management knows the business well",
      popularity: "high",
    },
    {
      name: "ESOP Implementation Guide",
      description: "Employee Stock Ownership Plan setup and execution",
      keyComponents: [
        "Feasibility Study",
        "Valuation",
        "Plan Design",
        "Communication Strategy",
      ],
      useCase: "Great for companies with strong employee culture",
      popularity: "medium",
    },
    {
      name: "Key Employee Retention Plan",
      description: "Strategies to retain critical employees through transition",
      keyComponents: [
        "Golden Handcuffs",
        "Phantom Stock",
        "Stay Bonuses",
        "Non-competes",
      ],
      useCase: "Critical for maintaining business value during sale",
      popularity: "high",
    },
    {
      name: "Leadership Development Program",
      description: "Systematic approach to developing next generation leaders",
      keyComponents: [
        "Skills Assessment",
        "Training Roadmap",
        "Mentoring",
        "Performance Metrics",
      ],
      useCase: "Important for long-term succession planning",
      popularity: "medium",
    },
    {
      name: "Buy-Sell Agreement Framework",
      description: "Legal structure for partner buyouts",
      keyComponents: [
        "Trigger Events",
        "Valuation Method",
        "Payment Terms",
        "Funding Mechanism",
      ],
      useCase: "Essential for multi-owner businesses",
      popularity: "high",
    },
    {
      name: "Succession Timeline Planner",
      description: "Detailed timeline for orderly transition",
      keyComponents: [
        "Milestone Planning",
        "Dependency Mapping",
        "Risk Mitigation",
        "Communication Plan",
      ],
      useCase: "Ensures smooth transition over 12-36 months",
      popularity: "medium",
    },
    {
      name: "Emergency Succession Plan",
      description: "Contingency planning for unexpected events",
      keyComponents: [
        "Interim Leadership",
        "Authority Matrix",
        "Communication Protocol",
        "Business Continuity",
      ],
      useCase: "Critical risk management for all businesses",
      popularity: "medium",
    },
  ],
  "Tax Strategy": [
    {
      name: "Deal Structure Optimization",
      description:
        "Maximizes after-tax proceeds through optimal deal structure",
      keyComponents: [
        "Asset vs Stock",
        "Allocation Strategy",
        "Earnout Treatment",
        "Escrow Planning",
      ],
      useCase: "Essential for every transaction",
      popularity: "high",
    },
    {
      name: "Installment Sale Planning",
      description: "Defers taxes through structured payment terms",
      keyComponents: [
        "Payment Schedule",
        "Interest Rate",
        "Security Provisions",
        "Tax Deferral",
      ],
      useCase: "Beneficial when buyer needs seller financing",
      popularity: "medium",
    },
    {
      name: "QSBS Exemption Strategy",
      description: "Qualified Small Business Stock exemption planning",
      keyComponents: [
        "Qualification Testing",
        "Holding Period",
        "Exclusion Calculation",
        "State Conformity",
      ],
      useCase: "Can exclude up to $10M in capital gains",
      popularity: "high",
    },
    {
      name: "1031 Exchange Planning",
      description: "Tax-deferred exchange for real estate components",
      keyComponents: [
        "Property Identification",
        "Timeline Management",
        "Qualified Intermediary",
        "Reinvestment Strategy",
      ],
      useCase: "Applicable when business includes real estate",
      popularity: "medium",
    },
    {
      name: "Estate Tax Planning",
      description: "Minimizes estate taxes on business transfer",
      keyComponents: [
        "Gifting Strategies",
        "Trust Structures",
        "Valuation Discounts",
        "Charitable Planning",
      ],
      useCase: "Critical for high-net-worth business owners",
      popularity: "high",
    },
    {
      name: "State Tax Optimization",
      description: "Manages multi-state tax exposure",
      keyComponents: [
        "Nexus Analysis",
        "Apportionment",
        "Credits/Incentives",
        "Residency Planning",
      ],
      useCase: "Important for multi-state operations",
      popularity: "medium",
    },
    {
      name: "Charitable Remainder Trust",
      description: "Combines tax benefits with charitable giving",
      keyComponents: [
        "Trust Design",
        "Income Stream",
        "Charitable Deduction",
        "Estate Planning",
      ],
      useCase: "Suitable for charitably inclined owners",
      popularity: "low",
    },
  ],
  Operations: [
    {
      name: "Process Documentation System",
      description: "Comprehensive documentation of all business processes",
      keyComponents: [
        "SOPs",
        "Workflow Diagrams",
        "Role Definitions",
        "Training Materials",
      ],
      useCase: "Essential for demonstrating scalability",
      popularity: "high",
    },
    {
      name: "Customer Diversification Analysis",
      description: "Reduces customer concentration risk",
      keyComponents: [
        "Concentration Metrics",
        "Growth Strategy",
        "Contract Analysis",
        "Retention Plan",
      ],
      useCase: "Critical when top customers exceed 15% of revenue",
      popularity: "high",
    },
    {
      name: "Scalability Assessment Tool",
      description: "Evaluates business readiness for growth",
      keyComponents: [
        "Systems Review",
        "Capacity Analysis",
        "Bottleneck Identification",
        "Investment Plan",
      ],
      useCase: "Important for growth-oriented buyers",
      popularity: "medium",
    },
    {
      name: "Technology Stack Audit",
      description: "Reviews and optimizes technology infrastructure",
      keyComponents: [
        "System Inventory",
        "Integration Map",
        "Security Review",
        "Modernization Plan",
      ],
      useCase: "Critical for tech-dependent businesses",
      popularity: "medium",
    },
    {
      name: "Supply Chain Optimization",
      description: "Strengthens vendor relationships and terms",
      keyComponents: [
        "Vendor Analysis",
        "Contract Review",
        "Risk Assessment",
        "Alternative Sourcing",
      ],
      useCase: "Important for manufacturing and distribution",
      popularity: "medium",
    },
    {
      name: "Quality Management System",
      description: "Demonstrates consistent product/service quality",
      keyComponents: [
        "Quality Metrics",
        "Control Procedures",
        "Certification Status",
        "Improvement Process",
      ],
      useCase: "Valuable for regulated industries",
      popularity: "medium",
    },
  ],
  Financial: [
    {
      name: "3-Year Financial Cleanup",
      description: "Prepares financials for buyer scrutiny",
      keyComponents: [
        "GAAP Compliance",
        "Audit Preparation",
        "Reconciliations",
        "Documentation",
      ],
      useCase: "Required for all serious transactions",
      popularity: "high",
    },
    {
      name: "Working Capital Analysis",
      description: "Determines normalized working capital needs",
      keyComponents: [
        "Historical Analysis",
        "Seasonality",
        "Target Calculation",
        "Adjustment Mechanism",
      ],
      useCase: "Critical for purchase price adjustments",
      popularity: "high",
    },
    {
      name: "Quality of Earnings Review",
      description: "Independent analysis of earnings quality",
      keyComponents: [
        "Revenue Recognition",
        "Expense Classification",
        "One-time Items",
        "Pro Forma Adjustments",
      ],
      useCase: "Often required by buyers and lenders",
      popularity: "high",
    },
    {
      name: "Cash Flow Optimization",
      description: "Improves cash generation and management",
      keyComponents: [
        "Collections Process",
        "Payment Terms",
        "Inventory Management",
        "Capital Planning",
      ],
      useCase: "Enhances business attractiveness",
      popularity: "medium",
    },
    {
      name: "Financial Reporting Package",
      description: "Professional financial presentation for buyers",
      keyComponents: [
        "Management Reports",
        "KPI Dashboard",
        "Trend Analysis",
        "Projections",
      ],
      useCase: "Essential for marketing the business",
      popularity: "high",
    },
    {
      name: "Due Diligence Preparation",
      description: "Organizes all financial documentation",
      keyComponents: [
        "Data Room Setup",
        "Document Index",
        "Q&A Process",
        "Issue Resolution",
      ],
      useCase: "Streamlines the due diligence process",
      popularity: "high",
    },
  ],
  "Legal/Risk": [
    {
      name: "IP Portfolio Assessment",
      description: "Reviews and protects intellectual property",
      keyComponents: [
        "Patent Review",
        "Trademark Audit",
        "Trade Secrets",
        "License Agreements",
      ],
      useCase: "Critical for technology and brand-dependent businesses",
      popularity: "high",
    },
    {
      name: "Contract Review Protocol",
      description: "Comprehensive review of all material contracts",
      keyComponents: [
        "Customer Contracts",
        "Vendor Agreements",
        "Lease Terms",
        "Employment Agreements",
      ],
      useCase: "Essential for identifying deal risks",
      popularity: "high",
    },
    {
      name: "Compliance Audit Framework",
      description: "Ensures regulatory compliance across operations",
      keyComponents: [
        "Regulatory Map",
        "Compliance Testing",
        "Remediation Plan",
        "Ongoing Monitoring",
      ],
      useCase: "Required for regulated industries",
      popularity: "medium",
    },
    {
      name: "Litigation Risk Assessment",
      description: "Evaluates potential legal exposures",
      keyComponents: [
        "Pending Litigation",
        "Threat Analysis",
        "Insurance Review",
        "Resolution Strategy",
      ],
      useCase: "Important for risk disclosure",
      popularity: "medium",
    },
    {
      name: "Data Security Review",
      description: "Assesses cybersecurity and data protection",
      keyComponents: [
        "Security Audit",
        "Policy Review",
        "Incident History",
        "Improvement Plan",
      ],
      useCase: "Critical in digital age for all businesses",
      popularity: "high",
    },
  ],
};

interface FrameworkDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  icon: any;
  count: number;
}

export function FrameworkDetailsModal({
  isOpen,
  onClose,
  category,
  icon: Icon,
  count,
}: FrameworkDetailsModalProps) {
  const frameworks = frameworkData[category] || [];

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 text-primary" />
            {category} Frameworks ({count} Total)
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-4">
            {frameworks.map((framework, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {framework.name}
                        {framework.popularity === "high" && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {framework.description}
                      </p>
                    </div>
                    <Badge className={getPopularityColor(framework.popularity)}>
                      {framework.popularity} usage
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Key Components
                      </h4>
                      <ul className="space-y-1">
                        {framework.keyComponents.map((component, i) => (
                          <li key={i}
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-1"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{component}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Best Use Case
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {framework.useCase}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
