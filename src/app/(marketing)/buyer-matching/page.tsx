"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  MapPin,
  DollarSign,
  Building,
  Star,
  MessageCircle,
  Calendar,
  Filter,
  Search,
  Heart,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface BusinessProfile {
  businessName: string;
  industry: string;
  location: string;
  annualRevenue: number;
  employeeCount: number;
  profitMargin: number;
  businessModel: string;
  reasonForSale: string;
  timeline: string;
  askingPrice: number;
  keyAssets: string[];
  description: string;
}

interface BuyerProfile {
  buyerType: "individual" | "strategic" | "financial" | "competitor";
  preferredIndustries: string[];
  locationPreference: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  dealSize: string;
  experience: string;
  timeline: string;
  acquisitionGoals: string[];
}

interface MatchedBuyer {
  id: string;
  name: string;
  type: "individual" | "strategic" | "financial" | "competitor";
  industry: string;
  location: string;
  verified: boolean;
  matchScore: number;
  compatibility: {
    industry: number;
    size: number;
    location: number;
    timeline: number;
    culture: number;
  };
  interests: string[];
  dealHistory: {
    totalDeals: number;
    avgDealSize: number;
    successRate: number;
  };
  profile: {
    avatar?: string;
    description: string;
    focusAreas: string[];
    investmentThesis: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  lastActive: string;
  response: {
    rate: number;
    avgTime: string;
  };
}

interface MatchingResults {
  matches: MatchedBuyer[];
  totalMatches: number;
  averageMatchScore: number;
  recommendedActions: Array<{
    type: "profile_optimization" | "pricing_adjustment" | "marketing_focus";
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }>;
  marketInsights: {
    averageMultiple: number;
    marketActivity: "high" | "medium" | "low";
    trendingBuyerTypes: string[];
    competitivePositioning: string;
  };
}

export default function BuyerMatchingPage() {
  const [currentStep, setCurrentStep] = useState<
    "profile" | "preferences" | "results"
  >("profile");
  const [businessProfile, setBusinessProfile] = useState<
    Partial<BusinessProfile>
  >({});
  const [buyerPreferences, setBuyerPreferences] = useState<
    Partial<BuyerProfile>
  >({});
  const [matchingResults, setMatchingResults] =
    useState<MatchingResults | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<MatchedBuyer | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("matchScore");

  const handleBusinessProfileSubmit = () => {
    setCurrentStep("preferences");
  };

  const handlePreferencesSubmit = () => {
    findMatches();
  };

  const findMatches = async () => {
    setIsMatching(true);
    setCurrentStep("results");

    try {
      const response = await fetch("/api/buyer-matching/find-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessProfile,
          buyerPreferences,
        }),
      });

      if (response.ok) {
        const results = await response.json();
        setMatchingResults(results);
      } else {
        // Use demo data as fallback
        const demoResults = generateDemoMatches();
        setMatchingResults(demoResults);
      }
    } catch (error) {
      console.error("Matching failed:", error);
      const demoResults = generateDemoMatches();
      setMatchingResults(demoResults);
    } finally {
      setIsMatching(false);
    }
  };

  const generateDemoMatches = (): MatchingResults => {
    const demoMatches: MatchedBuyer[] = [
      {
        id: "buyer_1",
        name: "TechGrowth Partners",
        type: "strategic",
        industry: "Technology",
        location: "San Francisco, CA",
        verified: true,
        matchScore: 94,
        compatibility: {
          industry: 98,
          size: 92,
          location: 85,
          timeline: 95,
          culture: 90,
        },
        interests: ["SaaS", "B2B Software", "AI/ML"],
        dealHistory: {
          totalDeals: 23,
          avgDealSize: 12500000,
          successRate: 87,
        },
        profile: {
          description:
            "Strategic acquirer focused on high-growth SaaS companies with strong product-market fit.",
          focusAreas: ["Enterprise Software", "AI/ML", "Marketplace"],
          investmentThesis:
            "We partner with exceptional founders to accelerate growth through strategic resources and market access.",
        },
        contactInfo: {
          email: "deals@techgrowth.com",
          linkedin: "linkedin.com/company/techgrowth",
        },
        lastActive: "2 hours ago",
        response: {
          rate: 92,
          avgTime: "4 hours",
        },
      },
      {
        id: "buyer_2",
        name: "Sarah Johnson",
        type: "individual",
        industry: "Healthcare",
        location: "Austin, TX",
        verified: true,
        matchScore: 87,
        compatibility: {
          industry: 85,
          size: 90,
          location: 88,
          timeline: 92,
          culture: 85,
        },
        interests: ["Healthcare IT", "Medical Devices", "Telemedicine"],
        dealHistory: {
          totalDeals: 5,
          avgDealSize: 3200000,
          successRate: 100,
        },
        profile: {
          description:
            "Former healthcare executive looking to acquire and grow healthcare technology companies.",
          focusAreas: ["HealthTech", "Medical Software", "Digital Health"],
          investmentThesis:
            "Focused on businesses that improve patient outcomes and healthcare efficiency.",
        },
        contactInfo: {
          email: "sarah@healthtechinvest.com",
          linkedin: "linkedin.com/in/sarahjohnson",
        },
        lastActive: "1 day ago",
        response: {
          rate: 88,
          avgTime: "6 hours",
        },
      },
      {
        id: "buyer_3",
        name: "IndustryMax Capital",
        type: "financial",
        industry: "Manufacturing",
        location: "Chicago, IL",
        verified: true,
        matchScore: 82,
        compatibility: {
          industry: 80,
          size: 88,
          location: 75,
          timeline: 85,
          culture: 82,
        },
        interests: ["Manufacturing", "Industrial Services", "Supply Chain"],
        dealHistory: {
          totalDeals: 47,
          avgDealSize: 8900000,
          successRate: 79,
        },
        profile: {
          description:
            "Private equity firm specializing in manufacturing and industrial services acquisitions.",
          focusAreas: [
            "Manufacturing",
            "Industrial Services",
            "B2B Distribution",
          ],
          investmentThesis:
            "We invest in profitable businesses with strong market positions and growth potential.",
        },
        contactInfo: {
          email: "deals@industrymax.com",
        },
        lastActive: "3 days ago",
        response: {
          rate: 75,
          avgTime: "12 hours",
        },
      },
    ];

    return {
      matches: demoMatches,
      totalMatches: demoMatches.length,
      averageMatchScore: 88,
      recommendedActions: [
        {
          type: "profile_optimization",
          title: "Enhance Financial Transparency",
          description:
            "Adding detailed financial metrics could increase match scores by 15-20%",
          impact: "high",
        },
        {
          type: "pricing_adjustment",
          title: "Consider Market-Based Pricing",
          description:
            "Current asking price is 12% above market average for similar businesses",
          impact: "medium",
        },
      ],
      marketInsights: {
        averageMultiple: 4.2,
        marketActivity: "high",
        trendingBuyerTypes: ["Strategic Acquirers", "Individual Buyers"],
        competitivePositioning: "Strong position in growing market segment",
      },
    };
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  const getBuyerTypeIcon = (type: string) => {
    switch (type) {
      case "strategic":
        return <Building className="h-4 w-4" />;
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "individual":
        return <Users className="h-4 w-4" />;
      case "competitor":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getBuyerTypeBadge = (type: string) => {
    const colors = {
      strategic: "bg-blue-100 text-blue-800",
      financial: "bg-green-100 text-green-800",
      individual: "bg-purple-100 text-purple-800",
      competitor: "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredMatches =
    matchingResults?.matches
      .filter((buyer) => filterType === "all" || buyer.type === filterType)
      .sort((a, b) => {
        switch (sortBy) {
          case "matchScore":
            return b.matchScore - a.matchScore;
          case "dealHistory":
            return b.dealHistory.totalDeals - a.dealHistory.totalDeals;
          case "responseRate":
            return b.response.rate - a.response.rate;
          default:
            return b.matchScore - a.matchScore;
        }
      }) || [];

  if (currentStep === "profile") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Ideal Buyer
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered matching with qualified buyers and investors
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <p className="text-gray-600">
                Tell us about your business to find the best matches
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessProfile.businessName || ""}
                    onChange={(e) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    placeholder="Your Company LLC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    onValueChange={(value) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        industry: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">
                        Professional Services
                      </SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Annual Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={businessProfile.annualRevenue || ""}
                    onChange={(e) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        annualRevenue: parseInt(e.target.value),
                      }))
                    }
                    placeholder="2000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">Employees</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={businessProfile.employeeCount || ""}
                    onChange={(e) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        employeeCount: parseInt(e.target.value),
                      }))
                    }
                    placeholder="25"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="askingPrice">Asking Price ($)</Label>
                  <Input
                    id="askingPrice"
                    type="number"
                    value={businessProfile.askingPrice || ""}
                    onChange={(e) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        askingPrice: parseInt(e.target.value),
                      }))
                    }
                    placeholder="5000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={businessProfile.location || ""}
                  onChange={(e) =>
                    setBusinessProfile((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={businessProfile.description || ""}
                  onChange={(e) =>
                    setBusinessProfile((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your business, its unique value proposition, and key strengths..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reason for Sale</Label>
                  <Select
                    onValueChange={(value) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        reasonForSale: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="new-venture">
                        New Business Venture
                      </SelectItem>
                      <SelectItem value="strategic">
                        Strategic Reasons
                      </SelectItem>
                      <SelectItem value="financial">
                        Financial Opportunity
                      </SelectItem>
                      <SelectItem value="partnership">
                        Partnership/Merger
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select
                    onValueChange={(value) =>
                      setBusinessProfile((prev) => ({
                        ...prev,
                        timeline: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Within 3 months</SelectItem>
                      <SelectItem value="short">3-6 months</SelectItem>
                      <SelectItem value="medium">6-12 months</SelectItem>
                      <SelectItem value="flexible">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleBusinessProfileSubmit} size="lg">
                  Continue to Buyer Preferences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "preferences") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Buyer Preferences
            </h1>
            <p className="text-xl text-gray-600">
              What type of buyer are you looking for?
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ideal Buyer Profile</CardTitle>
              <p className="text-gray-600">
                Help us find buyers that match your preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Preferred Buyer Types (select multiple)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "strategic",
                      label: "Strategic Acquirer",
                      description: "Companies in your industry",
                    },
                    {
                      value: "financial",
                      label: "Financial Buyer",
                      description: "Private equity, investment firms",
                    },
                    {
                      value: "individual",
                      label: "Individual Buyer",
                      description: "Entrepreneurs, executives",
                    },
                    {
                      value: "competitor",
                      label: "Competitor",
                      description: "Direct competitors",
                    },
                  ].map((type) => (
                    <div key={type.value}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={type.value}
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            const currentTypes = (
                              Array.isArray(buyerPreferences.buyerType)
                                ? buyerPreferences.buyerType
                                : []
                            ) as string[];
                            if (e.target.checked) {
                              setBuyerPreferences((prev: any) => ({
                                ...prev,
                                buyerType: [...currentTypes, type.value],
                              }));
                            } else {
                              setBuyerPreferences((prev: any) => ({
                                ...prev,
                                buyerType: currentTypes.filter(
                                  (t) => t !== type.value,
                                ),
                              }));
                            }
                          }}
                        />
                        <div>
                          <label
                            htmlFor={type.value}
                            className="font-medium cursor-pointer"
                          >
                            {type.label}
                          </label>
                          <p className="text-xs text-gray-500">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Budget ($)</Label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    onChange={(e) =>
                      setBuyerPreferences((prev: any) => ({
                        ...prev,
                        budgetRange: {
                          ...prev.budgetRange,
                          min: parseInt(e.target.value),
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Budget ($)</Label>
                  <Input
                    type="number"
                    placeholder="10000000"
                    onChange={(e) =>
                      setBuyerPreferences((prev: any) => ({
                        ...prev,
                        budgetRange: {
                          ...prev.budgetRange,
                          max: parseInt(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Geographic Preferences</Label>
                <Select
                  onValueChange={(value) =>
                    setBuyerPreferences((prev: any) => ({
                      ...prev,
                      locationPreference: [value],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="local">Local/Regional Only</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">
                      International OK
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Acquisition Goals (what you want from the buyer)</Label>
                <div className="space-y-2">
                  {[
                    "Maximum sale price",
                    "Employee retention",
                    "Brand preservation",
                    "Growth acceleration",
                    "Quick close",
                    "Flexible terms",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={goal}
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          const currentGoals =
                            buyerPreferences.acquisitionGoals || [];
                          if (e.target.checked) {
                            setBuyerPreferences((prev: any) => ({
                              ...prev,
                              acquisitionGoals: [...currentGoals, goal],
                            }));
                          } else {
                            setBuyerPreferences((prev: any) => ({
                              ...prev,
                              acquisitionGoals: currentGoals.filter(
                                (g) => g !== goal,
                              ),
                            }));
                          }
                        }}
                      />
                      <label htmlFor={goal} className="cursor-pointer">
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("profile")}
                >
                  Back
                </Button>
                <Button onClick={handlePreferencesSubmit} size="lg">
                  Find Matching Buyers
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Buyer Matches
          </h1>
          <p className="text-xl text-gray-600">
            {isMatching
              ? "Finding qualified buyers..."
              : `Found ${matchingResults?.totalMatches} potential buyers`}
          </p>
        </div>

        {isMatching ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Analyzing Your Business
              </h3>
              <p className="text-gray-600">
                Our AI is matching you with qualified buyers...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">
                    {matchingResults?.totalMatches}
                  </div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold">
                    {matchingResults?.averageMatchScore}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Match Score</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">
                    {matchingResults?.marketInsights.averageMultiple}x
                  </div>
                  <div className="text-sm text-gray-600">Market Multiple</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">
                    {matchingResults?.matches.filter((m) => m.verified).length}
                  </div>
                  <div className="text-sm text-gray-600">Verified Buyers</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Buyer Type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="strategic">Strategic</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="competitor">Competitor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matchScore">
                            Match Score
                          </SelectItem>
                          <SelectItem value="dealHistory">
                            Deal History
                          </SelectItem>
                          <SelectItem value="responseRate">
                            Response Rate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Insights */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Market Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Market Activity</span>
                        <Badge
                          className={
                            matchingResults?.marketInsights.marketActivity ===
                            "high"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {matchingResults?.marketInsights.marketActivity}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">
                        Trending Buyer Types:
                      </span>
                      <div className="mt-1 space-y-1">
                        {matchingResults?.marketInsights.trendingBuyerTypes.map(
                          (type, index) => (
                            <div key={index}
                              className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded"
                            >
                              {type}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Buyer List */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  {filteredMatches.map((buyer) => (
                    <Card key={buyer.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              {getBuyerTypeIcon(buyer.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">
                                  {buyer.name}
                                </h3>
                                {buyer.verified && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                <Badge
                                  className={getBuyerTypeBadge(buyer.type)}
                                >
                                  {buyer.type}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 space-x-4">
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {buyer.industry}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {buyer.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${getMatchScoreColor(buyer.matchScore)}`}
                            >
                              {buyer.matchScore}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Match Score
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          {buyer.profile.description}
                        </p>

                        {/* Compatibility Scores */}
                        <div className="grid grid-cols-5 gap-4 mb-4">
                          {Object.entries(buyer.compatibility).map(
                            ([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-sm font-medium capitalize">
                                  {key}
                                </div>
                                <Progress value={value} className="h-2 mt-1" />
                                <div className="text-xs text-gray-500 mt-1">
                                  {value}%
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Deal History */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="font-semibold">
                              {buyer.dealHistory.totalDeals}
                            </div>
                            <div className="text-xs text-gray-600">
                              Total Deals
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              $
                              {(
                                buyer.dealHistory.avgDealSize / 1000000
                              ).toFixed(1)}
                              M
                            </div>
                            <div className="text-xs text-gray-600">
                              Avg Deal Size
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              {buyer.dealHistory.successRate}%
                            </div>
                            <div className="text-xs text-gray-600">
                              Success Rate
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>Active {buyer.lastActive}</span>
                            <span>•</span>
                            <span>Responds in {buyer.response.avgTime}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    Load More Matches
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
