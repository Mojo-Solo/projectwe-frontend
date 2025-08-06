
interface AICoachProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import Section from "@/components/section";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Users,
  Lightbulb,
  TimerIcon,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function AICoach() {
  return (
    <>
      <Header />
      <main>
        <Section
          title="Strategic AI Coach"
          subtitle="Expert-Guided Exit Planning Assistance"
          description="Our AI coach combines human expertise with advanced technology to deliver personalized exit planning guidance for every client scenario."
        >
          <Tabs defaultValue="advisors" className="w-full mx-auto mt-12">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="advisors">For Advisors</TabsTrigger>
              <TabsTrigger value="owners" disabled>
                For Business Owners (Coming Soon)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advisors" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Your Strategic Exit Planning Partner
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    The Strategic AI Coach acts as your expert planning partner,
                    guiding you through complex exit planning scenarios and
                    helping you deliver superior value to your clients.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Client-Specific Guidance
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Input your client&apos;s details and receive tailored
                          exit planning recommendations based on their unique
                          situation, industry, and goals.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <TimerIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Timeline Development</h3>
                        <p className="text-sm text-muted-foreground">
                          Create strategic timelines for exit planning
                          activities, ensuring you address critical milestones
                          at the right moments.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Team Building Assistance
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Receive recommendations on which professional
                          specialists to include on your client&apos;s exit
                          planning team based on their specific needs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Lightbulb className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Strategic Education</h3>
                        <p className="text-sm text-muted-foreground">
                          Access just-in-time educational content relevant to
                          your client&apos;s specific situation, enhancing your
                          expertise in specialized areas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border shadow-sm">
                  <div className="relative h-[400px]">
                    <Image
                      src="/dashboard.png"
                      alt="Strategic AI Coach Interface"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-xl p-8 mt-16">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  How the Strategic AI Coach Works
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary">
                          1
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">
                        Input Client Information
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Enter key details about your client&apos;s business,
                        personal goals, timeline, and current situation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary">
                          2
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">
                        Receive Strategic Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI analyzes the information and generates a
                        comprehensive exit planning strategy tailored to your
                        client.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary">
                          3
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">
                        Implement with Confidence
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Review recommendations, access relevant resources, and
                        confidently guide your client through their exit
                        planning journey.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Human Expertise + AI Assistance
                </h2>
                <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
                  Our AI coach is built on the collective wisdom of exit
                  planning experts who understand that successful transitions
                  aren&apos;t just about transactions—they&apos;re about people.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-background border rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Expert-Driven Insights</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Every recommendation is based on proven methodologies
                      developed by seasoned exit planning professionals with
                      decades of real-world experience.
                    </p>
                  </div>

                  <div className="bg-background border rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Continuous Learning</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Our AI coach continuously improves based on feedback from
                      advisors and industry best practices, ensuring you always
                      have access to cutting-edge strategies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link href="/signup">Experience the Strategic AI Coach</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Section>
      </main>
      <Footer />
    </>
  );
}
