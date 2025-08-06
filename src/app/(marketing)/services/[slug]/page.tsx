import { readFile } from "fs/promises";
import { join } from "path";
import { notFound } from "next/navigation";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressiveDisclosure, ContentSummary } from "@/components/ui/progressive-disclosure";
import Link from "next/link";
import { CheckCircle, Target, Users, Zap, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

interface ServiceData {
  slug: string;
  pageTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
    cta: {
      text: string;
      href: string;
    };
  };
  introduction: {
    title: string;
    paragraphs: string[];
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: {
    title: string;
    list: string[];
  };
  ctaSection: {
    title: string;
    description: string;
    button: {
      text: string;
      href: string;
    };
  };
}

async function getServiceData(slug: string): Promise<ServiceData> {
  try {
    const filePath = join(
      process.cwd(),
      "src/content/services",
      `${slug}.json`,
    );
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading service data for ${slug}:`, error);
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const serviceData = await getServiceData(params.slug);
    return {
      title: serviceData.pageTitle,
      description: serviceData.metaDescription,
    };
  } catch (error) {
    return {
      title: "Strategic Service | ProjectWE®",
      description: "Strategic transformation through intelligent execution.",
    };
  }
}

export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  let serviceData: any;

  try {
    serviceData = await getServiceData(params.slug);
  } catch (error) {
    notFound();
  }

  // Handle new AI Transformation Accelerator structure
  const isTransformationAccelerator = params.slug === 'ai-transformation-accelerator';

  if (isTransformationAccelerator) {
    return (
      <>
        <Header />
        <main>
          {/* Hero Section */}
          <Section className="py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                {serviceData.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {serviceData.subtitle}
              </p>
              
              {/* Summary Points */}
              <div className="mb-8">
                <ContentSummary
                  title="Key Benefits"
                  points={serviceData.hero.summary_points}
                  expandLabel="See Full Details"
                >
                  <div className="text-left space-y-4">
                    <p className="text-gray-700">{serviceData.overview.description}</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-800 font-medium">Challenge Addressed:</p>
                      <p className="text-amber-700">{serviceData.overview.key_challenge}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">Expected Outcome:</p>
                      <p className="text-green-700">{serviceData.overview.outcome}</p>
                    </div>
                  </div>
                </ContentSummary>
              </div>

              <Link href="/contact">
                <Button size="lg" className="px-8">
                  {serviceData.hero.cta_primary}
                </Button>
              </Link>
            </div>
          </Section>

          {/* Approach Section */}
          <Section title={serviceData.approach.title} className="bg-muted/30">
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-lg text-center text-muted-foreground">
                {serviceData.approach.summary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProgressiveDisclosure
                  title={serviceData.approach.tracks.human_development.title}
                  summary="Leadership coaching and workforce upskilling"
                  variant="card"
                >
                  <div className="space-y-4">
                    <p>{serviceData.approach.tracks.human_development.focus}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Leadership coaching sessions
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Tiger Team facilitation
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Strategic workforce upskilling
                      </li>
                    </ul>
                  </div>
                </ProgressiveDisclosure>

                <ProgressiveDisclosure
                  title={serviceData.approach.tracks.ai_enablement.title}
                  summary="Custom AI workflows and platform implementation"
                  variant="card"
                >
                  <div className="space-y-4">
                    <p>{serviceData.approach.tracks.ai_enablement.focus}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Platform implementation
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Custom HumanFlow™ workflows
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Business process integration
                      </li>
                    </ul>
                  </div>
                </ProgressiveDisclosure>
              </div>
            </div>
          </Section>

          {/* Deliverables Section */}
          <Section title={serviceData.deliverables.title}>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-center text-muted-foreground mb-12">
                {serviceData.deliverables.summary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {serviceData.deliverables.primary_outcomes.map((outcome: any, index: number) => (
                  <Card key={index} className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        {outcome.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{outcome.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ProgressiveDisclosure
                title="Supporting Elements"
                summary="Additional support and optimization systems"
                variant="minimal"
                className="max-w-2xl mx-auto"
              >
                <ul className="space-y-3">
                  {serviceData.deliverables.supporting_elements.map((element: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </ProgressiveDisclosure>
            </div>
          </Section>

          {/* Pricing Section */}
          <Section title="Investment & Timeline" className="bg-muted/30">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Range:</strong> {serviceData.pricing.investment_range}</p>
                    <p><strong>Duration:</strong> {serviceData.pricing.duration}</p>
                    <p><strong>Payment:</strong> {serviceData.pricing.payment_structure}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ideal For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {serviceData.ideal_for.map((criteria: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          {/* CTA Section */}
          <Section title="Ready to Transform Your Organization?" className="bg-primary/5">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground mb-8">
                Stop treating AI as a project. Start building sustainable competitive advantage through comprehensive transformation.
              </p>
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  Start Your AI Transformation
                </Button>
              </Link>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  // Original service page layout for other services
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <Section className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              {serviceData.hero?.title || serviceData.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {serviceData.hero?.subtitle || serviceData.subtitle}
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </Section>

        {/* Features Section for legacy services */}
        {serviceData.features && (
          <Section subtitle="What's Included">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceData.features.map((feature: any, index: number) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}
