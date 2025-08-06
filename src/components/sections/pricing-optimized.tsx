
"use client";

interface PricingOptimizedProps {
  className?: string;
  children?: React.ReactNode;
}

import React, { useState } from "react";
import Section from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Zap, Star, Building } from "lucide-react";
import Link from "next/link";

const pricingPlans = {
  simple: [
    {
      name: "Strategic Assessment",
      price: "$25K",
      period: "One-time engagement",
      description: "Perfect for organizations ready to explore AI transformation",
      buttonText: "Start Assessment",
      href: "/contact",
      icon: <Zap className="h-5 w-5" />,
      features: [
        "6-12 week strategic diagnostic",
        "Leadership alignment workshop",
        "AI opportunity roadmap",
        "ROI projections & quick wins",
      ],
    },
    {
      name: "Transformation Partnership",
      price: "$150K",
      period: "12-18 months",
      description: "Comprehensive transformation with ongoing strategic partnership",
      buttonText: "Explore Partnership",
      href: "/contact",
      isPopular: true,
      icon: <Star className="h-5 w-5" />,
      features: [
        "Everything in Strategic Assessment",
        "Tiger Team implementation",
        "Quarterly business reviews",
        "Continuous strategic guidance",
      ],
    },
  ],
  detailed: [
    {
      name: "AI Opportunity Blueprint",
      price: "$45K",
      yearlyPrice: "$60K",
      period: "6-12 week engagement",
      description: "Strategic diagnostic to transform AI uncertainty into clear, actionable roadmap.",
      buttonText: "Request Assessment",
      href: "/contact",
      icon: <Zap className="h-5 w-5" />,
      features: [
        "Deep discovery and stakeholder interviews",
        "Opportunity analysis and process mapping",
        "Strategic blueprint with Impact vs. Effort matrix",
        "High-ROI Quick Win project identification",
        "12-month transformation roadmap",
      ],
    },
    {
      name: "Transformation Accelerator",
      price: "$50K",
      yearlyPrice: "$150K",
      period: "12-18 month partnership",
      description: "Long-term partnership to embed systems, skills, and culture for sustained competitive advantage.",
      buttonText: "Explore Partnership",
      href: "/contact",
      isPopular: true,
      icon: <Star className="h-5 w-5" />,
      features: [
        "Everything in AI Opportunity Blueprint",
        "Cross-functional Tiger Team formation",
        "Integrated Human Development & AI Enablement",
        "Quarterly Business Reviews and governance",
        "Continuous strategic partnership",
      ],
    },
    {
      name: "AI Catalyst Cohort",
      price: "$25K",
      yearlyPrice: "$25K",
      period: "per team (3-5 people)",
      description: "2-day intensive + 60-day execution sprint building foundational AI & People Roadmap.",
      buttonText: "Join Cohort",
      href: "/contact",
      icon: <Building className="h-5 w-5" />,
      features: [
        "2-day hands-on intensive workshop",
        "60-day execution sprint with bi-weekly coaching",
        "Foundational AI & People Roadmap delivery",
        "Peer learning network and accountability",
        "Monthly cohort calls for 3 months",
      ],
    },
  ],
};

export default function PricingOptimized() {
  const [viewMode, setViewMode] = useState<"simple" | "detailed">("simple");

  return (
    <Section title="Investment" subtitle="Choose Your Transformation Path">
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
        Start with what fits your current needs. Every investment includes strategic partnership,
        proven methodology, and measurable results.
      </p>

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "simple" | "detailed")}>
          <TabsList>
            <TabsTrigger value="simple">Quick Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Options</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "simple" ? (
          <motion.div
            key="simple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.simple.map((plan, index) => (
                <Card key={index} className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                  plan.isPopular && "ring-2 ring-primary"
                )}>
                  {plan.isPopular && (
                    <Badge className="absolute top-4 right-4">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={cn(
                        "w-full",
                        plan.isPopular ? "bg-primary hover:bg-primary/90" : ""
                      )}
                    >
                      <Link href={plan.href}>{plan.buttonText}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.detailed.map((plan, index) => (
                <Card key={index} className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  plan.isPopular ? "ring-2 ring-primary scale-105" : "hover:scale-102"
                )}>
                  {plan.isPopular && (
                    <Badge className="absolute top-4 right-4">
                      Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <p className="text-xs text-muted-foreground mt-1">{plan.period}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      size="sm"
                      className="w-full"
                      variant={plan.isPopular ? "default" : "outline"}
                    >
                      <Link href={plan.href}>{plan.buttonText}</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      {plan.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Not sure which option is right for you?
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href="/contact">Get Personalized Recommendation</Link>
        </Button>
      </div>
    </Section>
  );
}