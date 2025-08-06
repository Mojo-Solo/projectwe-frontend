
interface AboutPageProps {
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
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = 'force-dynamic';

const teamMembers = [
  {
    name: "Strategic Leadership Team",
    role: "Transformation Architects",
    description:
      "15+ years of experience guiding businesses through strategic transformation. Proven methodology refined through 200+ successful implementations.",
    expertise: [
      "Strategic Planning",
      "AI Implementation",
      "Organizational Development",
      "Market Leadership",
    ],
  },
  {
    name: "Execution Specialists",
    role: "Tiger Team Facilitators",
    description:
      "Expert practitioners who bridge the gap between strategy and execution. Masters of the art of turning plans into results.",
    expertise: [
      "Project Management",
      "Change Leadership",
      "Process Optimization",
      "Performance Management",
    ],
  },
  {
    name: "Industry Advisors",
    role: "Domain Experts",
    description:
      "Deep industry knowledge across manufacturing, professional services, technology, and financial services sectors.",
    expertise: [
      "Industry Analysis",
      "Competitive Intelligence",
      "Market Dynamics",
      "Regulatory Compliance",
    ],
  },
];

const principles = [
  {
    title: "Human-Centric Design",
    description:
      "All technology serves human needs and priorities. We believe in amplifying human potential, not replacing it.",
    icon: Users,
  },
  {
    title: "Strategic Clarity First",
    description:
      "In an age of infinite possibility, clarity becomes competitive advantage. We help you see what others can't.",
    icon: Target,
  },
  {
    title: "Execution Excellence",
    description:
      "The gap between knowing what to do and actually doing it is where fortunes are made or lost. We bridge that gap.",
    icon: Brain,
  },
  {
    title: "Measurable Results",
    description:
      "Every engagement delivers quantifiable outcomes. We're accountable for your success, not just our recommendations.",
    icon: Award,
  },
];

export const metadata = {
  title: "About ProjectWE® | Strategic Transformation Experts",
  description:
    "Meet the team behind 200+ successful transformations and $2.5B+ in value creation. Learn about our methodology, principles, and commitment to your strategic success.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              About ProjectWE®
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We are strategic transformation architects who help business
              leaders navigate the gap between where they are and where the
              market is heading.
            </p>
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                The Next Right Step in Business Evolution
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Every business stands at a threshold. The question isn&apos;t
                whether transformation will come—it&apos;s whether you&apos;ll
                lead it or be led by it.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                While competitors scramble to understand what artificial
                intelligence might do, new market leaders are already rewriting
                the rules, deploying systems that don&apos;t simply replace
                human work—they amplify human potential.
              </p>
              <p className="text-lg text-muted-foreground">
                The companies that thrive tomorrow understand the next right
                step isn&apos;t about technology—it&apos;s about strategic
                clarity in an age of infinite possibility.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <div className="text-muted-foreground">
                  Successful Transformations
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  $2.5B+
                </div>
                <div className="text-muted-foreground">Value Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">94%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </Section>

        <Section subtitle="Our Guiding Principles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <principle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="bg-muted/30" subtitle="Our Team">
          <div className="space-y-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-2 p-8">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl">{member.name}</CardTitle>
                      <div className="text-primary font-medium">
                        {member.role}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground text-lg">
                        {member.description}
                      </p>
                    </CardContent>
                  </div>
                  <div className="bg-primary/5 p-8">
                    <h4 className="font-semibold mb-4">Core Expertise</h4>
                    <ul className="space-y-2">
                      {member.expertise.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Beyond the Obvious</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Everyone talks about AI tools. Fewer understand AI thinking. The
              difference between those who dabble and those that dominate lies
              not in the sophistication of their software, but in the
              architecture of their approach.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              While businesses argue about which platform to choose, market
              leaders are orchestrating something far more sophisticated: the
              architecture of inevitability. They&apos;ve discovered
              breakthrough results don&apos;t come from better software—they
              come from better sequences.
            </p>
            <blockquote className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-6 mb-8">
              &quot;There&apos;s a methodology to transformation, a blueprint to
              turn industry outsiders into category killers almost
              overnight.&quot;
            </blockquote>
          </div>
        </Section>

        <Section className="bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Begin Your Transformation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              The methodology exists. The blueprint is battle-tested. The only
              question is whether you&apos;re ready to bridge the gap between
              where you are and where the market is heading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  Schedule Strategic Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
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
