"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Info,
  Target,
  Sparkles,
  Brain,
  FileText,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface ContextualHelpProps {
  currentTab: string;
  hasCompletedDemo: boolean;
  hasEnteredInfo: boolean;
  hasCalculatedValue: boolean;
}

export function ContextualHelp({
  currentTab,
  hasCompletedDemo,
  hasEnteredInfo,
  hasCalculatedValue,
}: ContextualHelpProps) {
  const getHelpContent = () => {
    switch (currentTab) {
      case "proof":
        return {
          title: "Start Here: Understanding Our ML/VDB System",
          steps: [
            "Watch the animated counters to see our processing scale",
            "Notice the 95.2% cost savings from CASCADE processing",
            'Click "One-Click Demo" to see personalized recommendations',
          ],
          tip: "This proof shows we've invested $750k to build real AI intelligence, not just ChatGPT wrappers.",
          nextAction:
            'Click the "One-Click Demo" button above to see the system in action',
          whyImportant:
            "You need confidence that our system has real intelligence before trusting it with your exit planning.",
        };

      case "client":
        return {
          title: hasCompletedDemo
            ? "Customize for Your Business"
            : "Enter Your Information",
          steps: [
            "Fill in your company details (or keep demo data)",
            "Be specific about your exit timeframe",
            "Describe your goals - the AI uses this for personalization",
          ],
          tip: hasCompletedDemo
            ? "The demo data is already loaded. You can modify it to match your actual business or proceed with demo values."
            : "Every field impacts AI recommendations. The more accurate your data, the better your results.",
          nextAction: "After entering info, go to the Valuation tab",
          whyImportant:
            "Generic advice fails. Your specific situation determines which of the 42 frameworks apply to you.",
        };

      case "valuation":
        return {
          title: "See Your Value Potential",
          steps: [
            "Adjust sliders to match your business metrics",
            "Watch the valuation change in real-time",
            "Note the gap between current and optimized value",
          ],
          tip: `Focus on the factors showing red - these are your biggest opportunities. ${hasCalculatedValue ? "Your potential increase could be substantial!" : ""}`,
          nextAction: "Review the Roadmap tab to see your path forward",
          whyImportant:
            "Most owners leave $3-5M on the table because they don't know what drives value.",
        };

      case "roadmap":
        return {
          title: "Your Personalized Exit Timeline",
          steps: [
            "Review the phases customized to your timeline",
            "Click each phase to see detailed tasks",
            "Note the value impact of each phase",
          ],
          tip: "The roadmap adapts to your exit timeframe. Accelerated exits focus on high-impact items only.",
          nextAction:
            "Check the Frameworks tab to see your AI-selected strategies",
          whyImportant:
            "A clear roadmap prevents costly mistakes and ensures you don't miss critical steps.",
        };

      case "frameworks":
        return {
          title: "AI-Selected Strategies for Your Business",
          steps: [
            "Review pre-selected frameworks (>70% relevance)",
            "Read why each framework was chosen",
            "Add or remove based on your knowledge",
          ],
          tip: `The AI selected ${hasEnteredInfo ? "these specific frameworks" : "frameworks"} from 42 options based on your unique situation.`,
          nextAction: "Review Best Practices tab for additional strategies",
          whyImportant:
            "Using the right frameworks can mean the difference between a good exit and a great one.",
        };

      case "practices":
        return {
          title: "Proven Best Practices",
          steps: [
            "Review auto-selected practices",
            "Note the impact of each practice",
            "Add any custom items specific to your business",
          ],
          tip: "These practices come from 100+ successful exits. Each one has proven ROI.",
          nextAction: "Go to Generate tab to create your documents",
          whyImportant:
            "Small improvements compound. Following these practices typically adds 25-40% to exit value.",
        };

      case "generate":
        return {
          title: "Create Your Exit Planning Package",
          steps: [
            "Review selected frameworks and practices",
            'Click "Generate Exit Planning Package"',
            "Download your personalized documents",
          ],
          tip: "Documents are generated using AI trained on Julie Keyes' 30+ years of expertise.",
          nextAction:
            "Generate your documents, then use the AI Assistant for questions",
          whyImportant:
            "Professional documentation that would cost $50k+ from consultants, generated in seconds.",
        };

      case "chat":
        return {
          title: "Your AI Exit Planning Assistant",
          steps: [
            "Ask specific questions about your situation",
            "Get expert guidance based on your data",
            "Dive deeper into any recommendations",
          ],
          tip: "The AI has context about your business and can provide specific, actionable advice.",
          nextAction: "Start implementing your highest-impact improvements",
          whyImportant:
            "Having 24/7 access to expert guidance ensures you never get stuck.",
        };

      default:
        return null;
    }
  };

  const helpContent = getHelpContent();
  if (!helpContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentTab}
      className="mb-4"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{helpContent.title}</h3>
                <Badge variant="outline" className="ml-2">
                  <Clock className="h-3 w-3 mr-1" />2 min
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">What to do here:</p>
                <ol className="space-y-1 text-sm text-muted-foreground">
                  {helpContent.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Alert className="border-green-500/50 bg-green-50">
                <Sparkles className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Pro Tip:</strong> {helpContent.tip}
                </AlertDescription>
              </Alert>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Why this matters:</strong> {helpContent.whyImportant}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-primary">
                  Next: {helpContent.nextAction}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
