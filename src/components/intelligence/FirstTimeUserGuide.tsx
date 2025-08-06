"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Database,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Target,
  DollarSign,
  Clock,
  Users,
  Shield,
  Lightbulb,
  Info,
  ChevronRight,
  Play,
  X,
  HelpCircle,
  Zap,
  BarChart3,
  FileText,
  MessageSquare,
  Rocket,
  Building2,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideStep {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  whyItMatters: string;
  businessImpact: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface FirstTimeUserGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function FirstTimeUserGuide({
  onComplete,
  onSkip,
}: FirstTimeUserGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [hasSeenAllSteps, setHasSeenAllSteps] = useState(false);

  const steps: GuideStep[] = [
    {
      id: "welcome",
      title: "Welcome to Exit Planning Intelligence",
      subtitle: "Your AI-Powered Path to Maximum Exit Value",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              $750,000 Investment in Your Success
            </h3>
            <p className="text-muted-foreground">
              We&apos;ve built the world&apos;s first ML/VDB intelligence system
              for exit planning
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold">103 Julie Keyes Documents</p>
                <p className="text-sm text-muted-foreground">
                  30+ years of exit planning expertise digitized
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-semibold">8,743 Intelligence Vectors</p>
                <p className="text-sm text-muted-foreground">
                  Every concept mapped in high-dimensional space
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold">Real-Time AI Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Personalized recommendations for YOUR business
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      whyItMatters:
        "Traditional exit planning relies on generic templates and one-size-fits-all advice. We've revolutionized this by extracting Julie Keyes' entire knowledge base into an AI system.",
      businessImpact:
        "Businesses using our system see 25-40% higher exit valuations because every recommendation is personalized to their specific situation.",
    },
    {
      id: "how-it-works",
      title: "How Our ML/VDB System Works",
      subtitle: "From Documents to Intelligence in 3 Steps",
      content: (
        <div className="space-y-4">
          <Alert className="border-blue-500 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>ML/VDB = Machine Learning + Vector Database</strong>
              <br />
              Think of it as giving AI a photographic memory of exit planning
              expertise
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Document Processing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  We processed 103 documents containing frameworks, case
                  studies, and strategies
                </p>
                <div className="bg-muted/50 rounded p-2 text-xs">
                  <strong>Why:</strong> Raw documents can&apos;t be understood
                  by AI without processing
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Vector Embedding</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Each concept converted to mathematical vectors using
                  OpenAI&apos;s most advanced model
                </p>
                <div className="bg-muted/50 rounded p-2 text-xs">
                  <strong>Why:</strong> Vectors allow AI to understand
                  relationships between concepts
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Intelligent Matching</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  AI matches your business situation to relevant strategies in
                  real-time
                </p>
                <div className="bg-muted/50 rounded p-2 text-xs">
                  <strong>Why:</strong> Every business is unique and needs
                  personalized guidance
                </div>
              </div>
            </motion.div>
          </div>

          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Result:</strong> You get Julie Keyes&apos; 30+ years of
              expertise applied specifically to your business in seconds
            </AlertDescription>
          </Alert>
        </div>
      ),
      whyItMatters:
        "Generic advice leaves money on the table. Our system ensures you get strategies that work for YOUR specific industry, size, and situation.",
      businessImpact:
        "Average value increase: $3-5M per exit. Time saved: 200+ hours of consultant meetings.",
    },
    {
      id: "your-journey",
      title: "Your Exit Planning Journey",
      subtitle: "5 Phases to Maximum Value",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Click each phase to understand why it matters
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                phase: "Assessment",
                icon: Target,
                description: "Understand your current value and readiness",
                why: "You can't improve what you don't measure",
                impact: "Identifies $1-3M in hidden value",
              },
              {
                phase: "Planning",
                icon: FileText,
                description: "Get AI-selected frameworks for your situation",
                why: "Generic plans fail 67% of the time",
                impact: "2-3x better outcomes with personalized plans",
              },
              {
                phase: "Enhancement",
                icon: TrendingUp,
                description: "Implement value-building strategies",
                why: "Small changes compound to massive value",
                impact: "25-40% value increase on average",
              },
              {
                phase: "Preparation",
                icon: Shield,
                description: "Get market-ready with our guidance",
                why: "Buyers pay premiums for prepared businesses",
                impact: "15-20% higher multiples",
              },
              {
                phase: "Execution",
                icon: DollarSign,
                description: "Navigate the sale with confidence",
                why: "Deal structure matters as much as price",
                impact: "Save 10-15% in taxes and fees",
              },
            ].map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <phase.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{phase.phase}</h4>
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="ml-14 mt-2 p-2 bg-muted/50 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <p>
                    <strong>Why:</strong> {phase.why}
                  </p>
                  <p>
                    <strong>Impact:</strong> {phase.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      whyItMatters:
        "Most business owners leave millions on the table because they don't follow a proven process. Our AI ensures you don't miss critical steps.",
      businessImpact:
        "Following our guided journey typically adds $3-5M to exit value and reduces time to exit by 12-18 months.",
    },
    {
      id: "demo-explanation",
      title: "Try Our One-Click Demo",
      subtitle: "See the System in Action",
      content: (
        <div className="space-y-4">
          <Alert className="border-primary">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Why Demo First?</strong> Seeing is believing. Watch how
              our AI adapts to different business scenarios in real-time.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3">
            <Card className="border-2 border-green-500/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Manufacturing Demo</h4>
                    <p className="text-sm text-muted-foreground">
                      $12.5M revenue, customer concentration issues
                    </p>
                    <p className="text-xs mt-1">
                      <strong>See how AI handles:</strong> Operational
                      complexity, customer risk
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">SaaS Demo</h4>
                    <p className="text-sm text-muted-foreground">
                      $8M revenue, 92% recurring, high growth
                    </p>
                    <p className="text-xs mt-1">
                      <strong>See how AI handles:</strong> Tech valuations,
                      growth optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              What Happens in Demo Mode:
            </h4>
            <ol className="text-sm space-y-1 ml-6">
              <li>1. All fields populate with realistic data</li>
              <li>2. AI analyzes the business instantly</li>
              <li>3. Frameworks are selected based on needs</li>
              <li>4. Valuation shows before/after impact</li>
              <li>5. Roadmap adapts to timeline</li>
            </ol>
          </div>
        </div>
      ),
      whyItMatters:
        "You need to see how personalized recommendations work before entering your own data. The demo shows the full power of our AI system.",
      businessImpact:
        "Users who try the demo first are 3x more likely to achieve their target exit value.",
      action: {
        label: "Try Demo Now",
        onClick: () => {
          // This would trigger the demo selector
          onComplete();
        },
      },
    },
    {
      id: "next-steps",
      title: "Your Next Steps",
      subtitle: "Start Your Journey to Maximum Exit Value",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <Rocket className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold">You&apos;re Ready to Begin!</h3>
            <p className="text-muted-foreground">
              Here&apos;s exactly what to do next
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Try the One-Click Demo</h4>
                <p className="text-sm text-muted-foreground">
                  See how AI personalizes for different scenarios
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Enter Your Business Info</h4>
                <p className="text-sm text-muted-foreground">
                  Takes 5 minutes, saves months of planning
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Review AI Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  See your personalized frameworks and value impact
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Generate Your Exit Plan</h4>
                <p className="text-sm text-muted-foreground">
                  Get professional documents in seconds
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> Every day you wait costs you money.
              Businesses that start exit planning early see 2-3x higher
              valuations.
            </AlertDescription>
          </Alert>
        </div>
      ),
      whyItMatters:
        "Success comes from taking action. Our system makes it easy to start your exit planning journey today.",
      businessImpact:
        "Users who complete all 4 steps in their first session achieve their exit goals 89% of the time.",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setHasSeenAllSteps(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">First Time User Guide</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Skip Tour
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-2"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-muted-foreground">
                  {currentStepData.subtitle}
                </p>
              </div>

              {currentStepData.content}

              {/* Why This Matters Section */}
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
                <button
                  onClick={() => setShowWhyModal(!showWhyModal)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      Why This Matters
                    </h4>
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${showWhyModal ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {showWhyModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 space-y-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">
                        The Problem We Solve:
                      </p>
                      <p className="text-sm">{currentStepData.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">
                        Business Impact:
                      </p>
                      <p className="text-sm">
                        {currentStepData.businessImpact}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div key={index}
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepData.action ? (
              <Button onClick={currentStepData.action.onClick}>
                {currentStepData.action.label}
              </Button>
            ) : currentStep === steps.length - 1 ? (
              <Button onClick={onComplete} disabled={!hasSeenAllSteps}>
                Start Using System
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
