
"use client";

interface CollaborationProps {
  className?: string;
  children?: React.ReactNode;
}

import Section from "@/components/section";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Scale,
  Calculator,
  Briefcase,
  HandshakeIcon,
  Building,
  Brain,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function Collaboration() {
  return (
    <>
      <Header />
      <main>
        <Section
          title="Exit Planning Team Collaboration"
          subtitle="Building & Managing the Perfect Exit Planning Team"
          description="Successful exit planning requires a coordinated team of professionals. Our platform helps you build, manage, and collaborate with the right experts at the right time."
        >
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Who&apos;s on the Team & Why
              </h2>
              <p className="text-muted-foreground mb-6">
                Exit planning demands diverse expertise to address complex
                business, legal, tax, and personal considerations. Our platform
                helps you assemble and coordinate the ideal team for each
                client&apos;s unique situation.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      Estate Planning Attorney
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Specializes in personal estate planning, wealth transfer,
                      and tax minimization strategies to protect the business
                      owner&apos;s assets and legacy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Attorney</h3>
                    <p className="text-sm text-muted-foreground">
                      Focuses on transaction structures, contracts, due
                      diligence, and legal aspects specific to the business exit
                      strategy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">CPA/Tax Advisor</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides critical guidance on tax implications of
                      different exit structures and develops strategies to
                      optimize after-tax proceeds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Consultant</h3>
                    <p className="text-sm text-muted-foreground">
                      Assists with operational improvements, value enhancement,
                      and preparation activities to maximize business
                      attractiveness to potential buyers or successors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      Family Business Advisor
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Specializes in navigating complex family dynamics,
                      facilitating difficult conversations, and developing
                      governance structures for family succession planning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Financial Planner</h3>
                    <p className="text-sm text-muted-foreground">
                      Helps business owners develop post-exit financial plans,
                      ensuring their personal financial security and lifestyle
                      goals are achieved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-lg overflow-hidden border">
                <Image
                  src="/dashboard.png"
                  alt="Exit Planning Team Collaboration"
                  width={640}
                  height={400}
                  className="object-cover w-full"
                />
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">
                    When to Involve Each Team Member
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our platform guides you on the optimal timing for bringing
                    in each specialist, ensuring efficient use of resources
                    while maintaining comprehensive coverage of all exit
                    planning aspects.
                  </p>

                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">
                        Early Stage:
                      </span>
                      <span className="text-muted-foreground">
                        Financial Planner, CPA, Business Consultant
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">
                        Mid Process:
                      </span>
                      <span className="text-muted-foreground">
                        Estate Planning Attorney, Business Attorney, Family
                        Business Advisor
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">
                        Transaction Phase:
                      </span>
                      <span className="text-muted-foreground">
                        M&A Specialist, Business Attorney, CPA
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">
                        Post-Exit:
                      </span>
                      <span className="text-muted-foreground">
                        Financial Planner, Estate Planning Attorney
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Collaboration Techniques
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Team Onboarding & Communication
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Easily invite team members, set permissions, and establish
                    secure communication channels for sensitive client
                    information.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Secure document sharing</li>
                    <li>Role-based permissions</li>
                    <li>Activity notifications</li>
                    <li>Integrated messaging</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <HandshakeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Coordinated Planning Sessions
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Schedule and manage virtual or in-person team planning
                    sessions, with agenda templates and automatic documentation.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Meeting scheduling tools</li>
                    <li>Agenda templates</li>
                    <li>Decision tracking</li>
                    <li>Action item assignment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-background border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Progress Tracking & Accountability
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Set deadlines, track team member progress, and ensure all
                    aspects of the exit plan stay on schedule.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Task management</li>
                    <li>Deadline notifications</li>
                    <li>Progress visualization</li>
                    <li>Bottleneck identification</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-20 bg-primary/10 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              The Human Element in Collaboration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-lg mb-4">
                  Beyond Task Management
                </h4>
                <p className="text-muted-foreground">
                  Our platform recognizes that successful exit planning involves
                  more than just tasks and timelines—it requires navigating
                  complex human emotions, relationships, and aspirations.
                </p>
                <p className="text-muted-foreground mt-4">
                  We provide tools to help advisors facilitate meaningful
                  conversations, address potential conflicts constructively, and
                  ensure all stakeholders feel heard and respected throughout
                  the process.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-lg mb-4">
                  Family Business Focus
                </h4>
                <p className="text-muted-foreground">
                  Family business transitions involve unique challenges where
                  business and family dynamics intersect. Our collaboration
                  tools include specialized resources for:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-4">
                  <li>Facilitating family meetings</li>
                  <li>Developing family governance structures</li>
                  <li>Addressing generational differences</li>
                  <li>Preserving family harmony through transitions</li>
                  <li>Balancing family and non-family stakeholder interests</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Building Your Exit Planning Team</Link>
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
