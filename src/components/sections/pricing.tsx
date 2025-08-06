
"use client";

interface PricingSectionProps {
  className?: string;
  children?: React.ReactNode;
}

import Section from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useWindowSize from "@/lib/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const pricingPlans = [
  {
    name: "AI Opportunity Blueprint",
    price: "$45K",
    yearlyPrice: "$60K",
    period: "6-12 week engagement",
    description:
      "Strategic diagnostic to transform AI uncertainty into clear, actionable roadmap with prioritized initiatives and ROI projections.",
    buttonText: "Request Assessment",
    href: "/contact",
    isPopular: false,
    features: [
      "Deep discovery and stakeholder interviews",
      "Opportunity analysis and process mapping",
      "Strategic blueprint with Impact vs. Effort matrix",
      "High-ROI Quick Win project identification",
      "12-month transformation roadmap",
    ],
  },
  {
    name: "Transformation Accelerator",
    price: "$50K",
    yearlyPrice: "$150K",
    period: "12-18 month partnership",
    description:
      "Long-term partnership to embed systems, skills, and culture for sustained competitive advantage with Tiger Teams.",
    buttonText: "Explore Partnership",
    href: "/contact",
    isPopular: true,
    features: [
      "Everything in AI Opportunity Blueprint",
      "Cross-functional Tiger Team formation",
      "Integrated Human Development & AI Enablement",
      "Quarterly Business Reviews and governance",
      "Continuous strategic partnership",
    ],
  },
  {
    name: "AI Catalyst Cohort",
    price: "$25K",
    yearlyPrice: "$25K",
    period: "per team (3-5 people)",
    description:
      "2-day intensive + 60-day execution sprint building foundational AI & People Roadmap with peer accountability.",
    buttonText: "Join Cohort",
    href: "/contact",
    isPopular: false,
    features: [
      "2-day hands-on intensive workshop",
      "60-day execution sprint with bi-weekly coaching",
      "Foundational AI & People Roadmap delivery",
      "Peer learning network and accountability",
      "Monthly cohort calls for 3 months",
    ],
  },
];

export default function PricingSection() {
  const [isMonthly, setIsMonthly] = useState(true);
  const { isDesktop } = useWindowSize();

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };

  return (
    <Section title="Investment" subtitle="Strategic Partnership Options">
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
        Choose the transformation approach that matches your organization&apos;s
        readiness and ambition. Every investment includes strategic partnership,
        proven methodology, and measurable results.
      </p>
      <div className="flex justify-center mb-10">
        <span className="mr-2 font-semibold">Standard</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch checked={!isMonthly} onCheckedChange={handleToggle} />
          </Label>
        </label>
        <span className="ml-2 font-semibold">Enterprise</span>
        {!isMonthly && (
          <span className="ml-2 text-sm text-primary">Extended scope</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: 0,
                    opacity: 1,
                    x:
                      index === pricingPlans.length - 1
                        ? -30
                        : index === 0
                          ? 30
                          : 0,
                    scale:
                      index === 0 || index === pricingPlans.length - 1
                        ? 0.94
                        : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular ? "border-primary border-[2px]" : "border-border",
              index === 0 || index === pricingPlans.length - 1
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === pricingPlans.length - 1 && "origin-left",
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <FaStar className="text-white" />
                <span className="text-white ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-muted-foreground">
                {plan.name}
              </p>
              <p className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  {isMonthly ? plan.price : plan.yearlyPrice}
                </span>
                {plan.period !== "Contact us for pricing" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                    / {plan.period}
                  </span>
                )}
              </p>

              <p className="text-xs leading-5 text-muted-foreground">
                {plan.price !== "Custom" && plan.period}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4" />

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-white",
                  plan.isPopular
                    ? "bg-primary text-white"
                    : "bg-white text-black",
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All partnerships include strategic guidance, proven methodology, and
          measurable results.
        </p>
        <p className="text-muted-foreground mt-2">
          Need a custom approach?{" "}
          <Link href="/contact" className="text-primary underline">
            Schedule a strategic consultation
          </Link>
        </p>
      </div>
    </Section>
  );
}
