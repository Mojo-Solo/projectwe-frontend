
interface EducationProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import Section from "@/components/section";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  AlertTriangle,
  BarChart3,
  Users,
  Briefcase,
  HandshakeIcon,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default function Education() {
  return (
    <>
      <Header />
      <main>
        <Section
          title="Exit Planning Education"
          subtitle="Knowledge That Drives Successful Transitions"
          description="Comprehensive education for both advisors and business owners, focusing on the human elements of exit planning alongside strategic and financial considerations."
        >
          {/* Educational Topics for Advisors */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">For Advisors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Exit Options Breakdown
                  </h3>
                  <p className="text-muted-foreground">
                    Master the essential 4 internal and 4 external exit
                    strategies. Learn when each option is most appropriate and
                    how to guide clients through the decision-making process.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                    <li>Family succession planning</li>
                    <li>Management buyouts</li>
                    <li>Employee ownership transitions</li>
                    <li>Strategic acquisitions</li>
                    <li>Financial buyer transactions</li>
                    <li>Organized liquidation options</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">The 5 Ds of Risk</h3>
                  <p className="text-muted-foreground">
                    Prepare clients for unexpected events that could derail
                    their exit plans. Our framework helps identify and mitigate
                    risks across these critical areas:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                    <li>
                      <span className="font-medium">Death:</span> Succession
                      planning and estate considerations
                    </li>
                    <li>
                      <span className="font-medium">Disability:</span>{" "}
                      Contingency planning for leadership incapacity
                    </li>
                    <li>
                      <span className="font-medium">Divorce:</span> Protecting
                      business assets during personal transitions
                    </li>
                    <li>
                      <span className="font-medium">Disagreement:</span>{" "}
                      Managing partner conflicts and resolution strategies
                    </li>
                    <li>
                      <span className="font-medium">Distress:</span> Navigating
                      financial or operational challenges
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Asset vs. Stock Sales
                  </h3>
                  <p className="text-muted-foreground">
                    Navigate transaction structures with confidence. Our
                    comparative analysis helps advisors guide clients through
                    these complex decisions with clear pros, cons, and
                    context-specific recommendations.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Includes guidance on appropriate structures based on company
                    size, industry, and buyer type, with special attention to
                    tax implications and liability considerations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Who&apos;s on the Team & Why
                  </h3>
                  <p className="text-muted-foreground">
                    Build the ideal exit planning team for each client scenario.
                    Learn when and why to involve specialized professionals:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                    <li>Estate Planning Attorney</li>
                    <li>Business Attorney</li>
                    <li>CPA/Tax Advisor</li>
                    <li>Financial Planner</li>
                    <li>Business Consultant</li>
                    <li>Family Business Advisor</li>
                    <li>M&A Specialist</li>
                    <li>Valuation Expert</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Business Continuity Planning
                  </h3>
                  <p className="text-muted-foreground">
                    Help clients develop robust continuity plans that protect
                    business value and ensure smooth operations during
                    transition periods or unexpected events.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aligned with the 5 Ds risk framework, this module provides
                    practical tools for creating, implementing, and testing
                    continuity plans.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Writing a Holistic Exit Plan
                  </h3>
                  <p className="text-muted-foreground">
                    Master the art of creating comprehensive exit plans that
                    address business, personal, and financial aspects. Our
                    framework ensures no critical element is overlooked.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Includes templates, checklists, and real-world examples that
                    demonstrate how to create actionable, client-specific plans
                    that drive results.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Topics for Business Owners */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">For Business Owners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Transition vs. Exit</h3>
                  <p className="text-muted-foreground">
                    Understand the important distinction between business
                    transitions and exits. Learn how exit planning fits into the
                    broader context of business transition planning.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    An exit is one type of transition, but not all transitions
                    involve completely exiting the business. This section
                    explores various transition pathways and their implications.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Value Drivers</h3>
                  <p className="text-muted-foreground">
                    Discover the key factors that enhance business value before
                    a transition or exit. Learn practical steps to strengthen
                    these drivers in your organization.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Focused on actionable improvements that increase both
                    operational performance and attractiveness to potential
                    buyers or successors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              The Human Element in Exit Planning
            </h2>
            <p className="text-lg mb-8">
              Exit planning isn&apos;t just about financial
              transactions&mdash;it&apos;s about helping business owners
              navigate one of the most significant personal and professional
              transitions of their lives.
            </p>

            <ul className="space-y-4 list-disc pl-6">
              <li className="text-lg">
                Support clients through emotional challenges of letting go
              </li>
              <li className="text-lg">
                Facilitate productive family discussions about succession
              </li>
              <li className="text-lg">
                Develop post-exit life plans that address purpose and identity
              </li>
              <li className="text-lg">
                Balance financial goals with legacy and relationship priorities
              </li>
            </ul>

            <div className="mt-12 text-center">
              <p className="text-lg font-medium">
                Our platform combines technical expertise with human
                understanding to deliver truly holistic exit planning guidance.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-primary/10 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Exit Planning Continuing Education
            </h3>
            <p className="text-center mb-8">
              Enhance your exit planning expertise with our ongoing educational
              programs and resources, designed to keep you at the forefront of
              the industry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-lg border text-center">
                <h4 className="font-semibold mb-2">Video Tutorials</h4>
                <p>Step-by-step guidance on complex exit planning concepts</p>
              </div>

              <div className="bg-background p-6 rounded-lg border text-center">
                <h4 className="font-semibold mb-2">Case Studies</h4>
                <p>Real-world examples of successful exit strategies</p>
              </div>

              <div className="bg-background p-6 rounded-lg border text-center">
                <h4 className="font-semibold mb-2">Resource Library</h4>
                <p>
                  Templates, checklists, and tools for immediate implementation
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button>
                <Link href="/signup">Access Full Educational Library</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
