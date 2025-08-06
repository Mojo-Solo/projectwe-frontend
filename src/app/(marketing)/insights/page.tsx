
interface InsightsPageProps {
  className?: string;
  children?: React.ReactNode;
}

import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Section from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight, Brain, Target, Zap, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

const insights = [
  {
    title: "Beyond the Obvious: Why AI Implementation Fails",
    excerpt:
      "Everyone talks about AI tools. Fewer understand AI thinking. The difference between those who dabble and those that dominate lies not in the sophistication of their software, but in the architecture of their approach.",
    category: "Strategic Thinking",
    readTime: "8 min read",
    date: "July 2025",
    icon: Brain,
    featured: true,
  },
  {
    title: "The Implementation Paradox: Closing the Strategy-Execution Gap",
    excerpt:
      "The most transformative business applications aren't born from technical expertise alone. They are built by leaders who master the art of strategic execution—who understand the gap between knowing and doing.",
    category: "Execution Excellence",
    readTime: "12 min read",
    date: "July 2025",
    icon: Target,
    featured: true,
  },
  {
    title: "The Architecture of Inevitability: Building Market Leadership",
    excerpt:
      "Market leaders have discovered breakthrough results don't come from better software—they come from better sequences. There's a methodology to transformation that turns industry outsiders into category killers.",
    category: "Market Leadership",
    readTime: "15 min read",
    date: "June 2025",
    icon: Zap,
    featured: false,
  },
  {
    title: "Tiger Teams: The Secret to Sustainable Transformation",
    excerpt:
      "Cross-functional Tiger Teams aren't just project groups—they're the DNA of learning organizations. Discover how to form, manage, and scale these high-performance units for lasting competitive advantage.",
    category: "Organizational Development",
    readTime: "10 min read",
    date: "June 2025",
    icon: Users,
    featured: false,
  },
  {
    title: "From Analysis Paralysis to Strategic Action",
    excerpt:
      "Why do 70% of digital transformation initiatives fail? It's not technology—it's the inability to move from planning to doing. Learn the frameworks that break through implementation paralysis.",
    category: "Strategic Thinking",
    readTime: "7 min read",
    date: "May 2025",
    icon: Brain,
    featured: false,
  },
  {
    title: "The Cohort Advantage: Learning in Community",
    excerpt:
      "Peer learning accelerates transformation in ways individual consulting cannot. Explore the psychology and methodology behind cohort-based strategic development.",
    category: "Learning & Development",
    readTime: "6 min read",
    date: "May 2025",
    icon: Users,
    featured: false,
  },
];

const categories = [
  "All",
  "Strategic Thinking",
  "Execution Excellence",
  "Market Leadership",
  "Organizational Development",
  "Learning & Development",
];

export const metadata = {
  title: "Strategic Insights | ProjectWE® Thought Leadership",
  description:
    "Deep strategic insights on transformation, execution, and market leadership. Learn from 15+ years of guiding successful business evolution.",
};

export default function InsightsPage() {
  const featuredInsights = insights.filter((insight) => insight.featured);
  const regularInsights = insights.filter((insight) => !insight.featured);

  return (
    <>
      <Header />
      <main>
        <Section className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Strategic Insights
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Deep thinking on transformation, execution, and market leadership.
              Insights born from 15+ years of guiding successful business
              evolution.
            </p>
          </div>
        </Section>

        {/* Featured Insights */}
        <Section className="bg-muted/30" subtitle="Featured Insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredInsights.map((insight, index) => (
              <Card key={index}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-1 bg-gradient-to-r from-primary/20 to-primary/5">
                  <div className="bg-background p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <insight.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {insight.category}
                      </div>
                    </div>

                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {insight.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {insight.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {insight.date}
                          </span>
                          <span>{insight.readTime}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-primary/10"
                        >
                          Read More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* All Insights */}
        <Section subtitle="All Strategic Insights">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularInsights.map((insight, index) => (
              <Card key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <insight.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {insight.category}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {insight.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {insight.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {insight.date}
                    </span>
                    <span>{insight.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Apply These Insights?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Strategic thinking without execution is just philosophy.
              Let&apos;s transform these insights into measurable results for
              your organization.
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
