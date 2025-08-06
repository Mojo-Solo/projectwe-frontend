
interface MethodologyPageProps {
  className?: string;
  children?: React.ReactNode;
}

import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Section from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Brain,
  Target,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = 'force-dynamic';

const methodologySteps = [
  {
    step: "01",
    title: "Deep Discovery",
    description:
      "Leadership alignment workshop and comprehensive stakeholder interviews to understand your unique strategic position and transformation readiness.",
    icon: Brain,
    deliverables: [
      "Stakeholder alignment assessment",
      "Strategic position analysis",
      "Readiness evaluation",
    ],
  },
  {
    step: "02",
    title: "Opportunity Analysis",
    description:
      "Mapping of 2-3 high-impact processes to identify specific AI use cases with maximum ROI potential and strategic alignment.",
    icon: Target,
    deliverables: [
      "Process mapping",
      "AI use case identification",
      "ROI analysis",
      "Impact vs effort matrix",
    ],
  },
  {
    step: "03",
    title: "Strategic Blueprint",
    description:
      "Comprehensive strategic document with prioritized initiatives, quick-win recommendations, and transformation roadmap with clear milestones.",
    icon: Zap,
    deliverables: [
      "Strategic roadmap",
      "Quick-win projects",
      "Implementation timeline",
      "Success metrics",
    ],
  },
  {
    step: "04",
    title: "Execution & Partnership",
    description:
      "Continuous strategic partnership with Tiger Teams, governance structures, and iterative improvement to ensure sustained competitive advantage.",
    icon: Users,
    deliverables: [
      "Tiger Team formation",
      "Governance framework",
      "Continuous improvement",
      "Partnership support",
    ],
  },
];

export const metadata = {
  title: "Our Methodology | ProjectWE® Strategic Transformation",
  description:
    "Discover the proven 4-step methodology that transforms market uncertainty into strategic advantage. From deep discovery to sustained execution.",
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              The ProjectWE® Methodology
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A proven 4-step framework that transforms market uncertainty into
              strategic advantage. Every engagement follows this battle-tested
              methodology to ensure measurable results.
            </p>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Strategic Transformation Framework
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The methodology exists. The blueprint is battle-tested. Our
                  systematic approach has guided over 200 successful business
                  transformations, creating $2.5B+ in value.
                </p>
                <p className="text-lg text-muted-foreground">
                  Unlike generic consulting approaches, our methodology
                  specifically addresses the gap between knowing what to do and
                  actually doing it—where fortunes are made or lost.
                </p>
              </div>
              <div className="bg-primary/5 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  Methodology Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>
                      Proven framework with 200+ successful implementations
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>
                      Addresses both strategic and execution challenges
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Measurable ROI and continuous improvement focus</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Builds lasting organizational capabilities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section subtitle="The 4-Step Framework">
          <div className="space-y-12">
            {methodologySteps.map((step, index) => (
              <div key={index}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-2 text-center lg:text-left">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {step.step}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Key Deliverables
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="text-sm">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Apply Our Methodology?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every day you wait is a day your future competition gets further
              ahead. The methodology exists. The blueprint is battle-tested. The
              only question is whether you&apos;re ready to begin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  Schedule Strategic Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="px-8">
                  View Service Options
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
