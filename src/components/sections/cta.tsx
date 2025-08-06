
interface CtaSectionProps {
  className?: string;
  children?: React.ReactNode;
}

import { Icons } from "@/components/icons";
import Section from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <Section
      id="cta"
      title="Your Moment of Truth Awaits"
      subtitle="Contact Us to Discover Your Strategic Blueprint"
      className="bg-primary/10 rounded-xl py-16"
    >
      <div className="max-w-3xl mx-auto text-center mb-8">
        <p className="text-muted-foreground text-lg">
          The future doesn&apos;t wait. Neither should you. Every day you wait
          is a day your future competition gets further ahead. The methodology
          exists. The blueprint is battle-tested.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Strategic Clarity</strong> in an age of infinite
              possibility
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Intelligent Execution</strong> that amplifies human
              potential
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Market Leadership</strong> through strategic
              transformation
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl max-w-2xl mx-auto shadow-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-2xl font-bold text-center mb-6">
          Build Your Blueprint
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-2 font-medium">Strategic Framework:</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>AI Opportunity Blueprint assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Transformation Accelerator methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Strategic implementation roadmap</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-medium">Expert Guidance:</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Confidential strategic consultation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Proven implementation methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Continuous strategic partnership</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full sm:w-auto text-background flex gap-2 items-center justify-center",
            )}
          >
            <span>REQUEST CONSULTATION</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/schedule-demo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto flex gap-2 items-center justify-center",
            )}
          >
            <span>LEARN MORE</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Strategic partnership • Proven methodology • Measurable results
        </p>
      </div>
    </Section>
  );
}
