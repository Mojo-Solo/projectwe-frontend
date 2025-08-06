
interface CaseStudiesPageProps {
  className?: string;
  children?: React.ReactNode;
}

import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Section from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export const dynamic = 'force-dynamic';

const caseStudies = [
  {
    title: "Regional Manufacturing Company",
    industry: "Manufacturing",
    challenge:
      "Struggling with implementation paralysis - knew they needed AI transformation but couldn't bridge the gap between strategy and execution.",
    solution:
      "6-week AI Opportunity Blueprint followed by 12-month Transformation Accelerator program with cross-functional Tiger Teams.",
    results: [
      "40% reduction in operational inefficiencies",
      "3x faster decision-making processes",
      "$2.1M annual cost savings",
      "85% employee adoption of new AI tools",
    ],
    timeline: "18 months",
    investment: "$95,000",
    icon: TrendingUp,
  },
  {
    title: "Mid-Market Professional Services Firm",
    industry: "Professional Services",
    challenge:
      "Revenue plateau and increasing competition. Leadership team lacked alignment on digital transformation strategy.",
    solution:
      "AI Catalyst Cohort program with peer learning, followed by targeted Quick-Win implementations.",
    results: [
      "28% increase in billable hours efficiency",
      "50% faster client onboarding process",
      "$1.8M revenue growth in first year",
      "Complete leadership alignment on strategy",
    ],
    timeline: "8 months",
    investment: "$25,000",
    icon: Users,
  },
  {
    title: "Technology Scale-Up",
    industry: "Technology",
    challenge:
      "Rapid growth creating operational chaos. Needed systematic approach to scale processes while maintaining quality.",
    solution:
      "Comprehensive Transformation Accelerator with focus on process optimization and cultural development.",
    results: [
      "60% improvement in operational scalability",
      "90% reduction in process bottlenecks",
      "$5.2M valuation increase",
      "Industry leadership position established",
    ],
    timeline: "15 months",
    investment: "$140,000",
    icon: Clock,
  },
];

export const metadata = {
  title: "Case Studies | ProjectWE® Strategic Transformation Results",
  description:
    "Discover how organizations achieved breakthrough results with ProjectWE® methodology. Real transformations, measurable outcomes, strategic success stories.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Transformation Success Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real organizations. Real challenges. Real results. See how the
              ProjectWE® methodology transforms market uncertainty into
              strategic advantage.
            </p>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">
                Successful Transformations
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2.5B+</div>
              <div className="text-muted-foreground">In Value Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years of Expertise</div>
            </div>
          </div>
        </Section>

        <Section subtitle="Featured Case Studies">
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-8 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <study.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {study.industry}
                      </div>
                    </div>

                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl">{study.title}</CardTitle>
                    </CardHeader>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                          Challenge
                        </h4>
                        <p className="text-muted-foreground">
                          {study.challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                          Solution
                        </h4>
                        <p className="text-muted-foreground">
                          {study.solution}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-muted/30 p-8">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
                      Results Achieved
                    </h4>
                    <ul className="space-y-3 mb-8">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{result}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {study.timeline}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Timeline
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {study.investment}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Investment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              These organizations chose to lead their transformation rather than
              be led by it. The methodology that delivered these results is
              available to you today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  Schedule Strategic Consultation
                </Button>
              </Link>
              <Link href="/methodology">
                <Button variant="outline" size="lg" className="px-8">
                  Explore Our Methodology
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
