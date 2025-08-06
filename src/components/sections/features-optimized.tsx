
"use client";

interface FeaturesOptimizedProps {
  className?: string;
  children?: React.ReactNode;
}

import React, { useState } from "react";
import FeaturesHorizontal from "@/components/features-horizontal";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChartColumn,
  BookOpen,
  Briefcase,
  FileText,
  ChartPie,
  Users,
  Shield,
} from "lucide-react";

const primaryFeatures = [
  {
    id: 1,
    title: "The AI Opportunity Blueprint",
    content:
      "A 6-12 week strategic diagnostic to transform AI uncertainty into clear, actionable roadmap.",
    image: "/dashboard.png",
    icon: <Brain className="h-6 w-6 text-primary" />,
    category: "strategic",
  },
  {
    id: 2,
    title: "Transformation Accelerator",
    content:
      "Long-term partnership embedding systems, skills, and culture for competitive advantage.",
    image: "/dashboard.png",
    icon: <ChartColumn className="h-6 w-6 text-primary" />,
    category: "strategic",
  },
  {
    id: 3,
    title: "AI Catalyst Cohort",
    content:
      "2-day intensive + 60-day execution sprint for foundational AI & People Roadmap.",
    image: "/dashboard.png",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    category: "learning",
  },
];

const secondaryFeatures = [
  {
    id: 4,
    title: "AI Workflow Quick-Start",
    content:
      "Automate a single, painful business process in 90 days for measurable ROI.",
    image: "/dashboard.png",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    category: "implementation",
  },
  {
    id: 5,
    title: "Leadership Engine",
    content:
      "3-6 month intensive equipping leadership teams with disruption-ready mindset.",
    image: "/dashboard.png",
    icon: <FileText className="h-6 w-6 text-primary" />,
    category: "leadership",
  },
  {
    id: 6,
    title: "Build vs. Buy Advisory",
    content:
      "Expert, unbiased analysis for confident build, buy, or partner decisions.",
    image: "/dashboard.png",
    icon: <ChartPie className="h-6 w-6 text-primary" />,
    category: "advisory",
  },
  {
    id: 7,
    title: "Internal AI Enablement",
    content:
      "Strategic co-pilot coaching internal teams with proven methodologies.",
    image: "/dashboard.png",
    icon: <Users className="h-6 w-6 text-primary" />,
    category: "enablement",
  },
  {
    id: 8,
    title: "AI-Ready Workforce Training",
    content:
      "Company-wide competitive advantage through AI literacy and practical application.",
    image: "/dashboard.png",
    icon: <Shield className="h-6 w-6 text-primary" />,
    category: "training",
  },
];

export default function FeaturesOptimized() {
  const [showAll, setShowAll] = useState(false);

  return (
    <Section
      title="Strategic Excellence"
      subtitle="Core Services That Drive Transformation"
      description="Start with our most popular strategic services, then explore additional options tailored to your needs."
    >
      {/* Primary Features - Always Visible */}
      <FeaturesHorizontal
        collapseDelay={5000}
        linePosition="bottom"
        data={primaryFeatures}
      />

      {/* Show More/Less Button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View All Services <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Secondary Features - Progressive Disclosure */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-center mb-6">
                Additional Specialized Services
              </h3>
              <FeaturesHorizontal
                collapseDelay={5000}
                linePosition="bottom"
                data={secondaryFeatures}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action CTA */}
      <div className="text-center mt-8">
        <p className="text-muted-foreground mb-4">
          Not sure which service fits your needs?
        </p>
        <Button size="lg" className="px-8">
          Get Personalized Recommendations
        </Button>
      </div>
    </Section>
  );
}