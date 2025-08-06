
interface ServicesPageProps {
  className?: string;
  children?: React.ReactNode;
}

import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Section from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Users, Target, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';

const services = [
  {
    slug: "ai-opportunity-blueprint",
    title: "The AI Opportunity Blueprint",
    description:
      "6-12 week strategic diagnostic to transform AI uncertainty into clear, actionable roadmap with prioritized initiatives and ROI projections.",
    icon: Brain,
    price: "$45,000 - $60,000",
    duration: "6-12 weeks",
  },
  {
    slug: "transformation-accelerator",
    title: "The Transformation Accelerator",
    description:
      "Long-term partnership embedding systems, skills, and culture for sustained competitive advantage with cross-functional Tiger Teams.",
    icon: Zap,
    price: "$50,000 - $150,000",
    duration: "12-18 months",
  },
  {
    slug: "ai-catalyst-cohort",
    title: "The AI Catalyst Cohort",
    description:
      "2-day intensive + 60-day execution sprint building foundational AI & People Roadmap alongside curated peer leaders.",
    icon: Users,
    price: "$25,000 per team",
    duration: "2 days + 60 days",
  },
  {
    slug: "strategic-framework",
    title: "Strategic Implementation Framework",
    description:
      "Expert analysis for confident build, buy, or partner decisions aligned with long-term strategy, capabilities, and budget.",
    icon: Target,
    price: "$15,000 - $25,000",
    duration: "2-4 weeks",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Section
          title="Strategic Services"
          subtitle="ProjectWE® Go-to-Market Offer Suite"
          description="Comprehensive methodology to transform market uncertainty into strategic advantage. Choose the approach that matches your organization's readiness and ambition."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {services.map((service) => (
              <Card key={service.slug}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.duration} • {service.price}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  <Link href={`/services/${service.slug}`}>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Not Sure Which Service Is Right?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every organization&apos;s transformation journey is unique.
              Contact us for a confidential consultation to discuss your
              specific needs and objectives.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Schedule Strategic Consultation
              </Button>
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
