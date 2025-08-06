
interface PricingPageProps {
  className?: string;
  children?: React.ReactNode;
}

import { Metadata } from "next";
import { Section } from "@/components/sections/section";
import { PricingCards } from "@/components/billing/pricing-cards";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Pricing | WE-Exit.ai",
  description: "Choose the perfect plan for your exit planning needs",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="relative overflow-hidden pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Choose the plan that fits your business exit planning needs. All
              plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PricingCards />
        </div>
      </Section>

      {/* Feature Comparison */}
      <Section className="bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Compare Plans
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              All the features you need to maximize your exit value
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Features</th>
                  <th className="text-center py-4 px-4">Starter</th>
                  <th className="text-center py-4 px-4">Professional</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {features.map((feature) => (
                  <tr key={feature.name}>
                    <td className="py-4 px-4 text-sm">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {feature.starter && (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.professional && (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.enterprise && (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <dl className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-lg font-semibold leading-7">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 text-center">
            <p className="text-base text-muted-foreground">
              Still have questions?{" "}
              <Button variant="link" className="p-0 h-auto font-semibold">
                Contact our sales team
              </Button>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

const features = [
  {
    name: "AI-Powered Exit Assessment",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Document Management",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Exit Timeline Planning",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Basic Valuation Tools",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Email Support",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Advanced Valuation Models",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Buyer Matching Insights",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Priority Support",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom Integrations",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Dedicated Success Manager",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "M&A Advisor Network",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "White-glove Onboarding",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Advanced Analytics",
    starter: false,
    professional: false,
    enterprise: true,
  },
  { name: "API Access", starter: false, professional: false, enterprise: true },
  {
    name: "Custom AI Training",
    starter: false,
    professional: false,
    enterprise: true,
  },
];

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer:
      "When you sign up for any paid plan, you get 14 days to explore all features without any charge. Your card won&apos;t be charged until the trial period ends. You can cancel anytime during the trial.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you&apos;ll be charged a prorated amount for the remainder of your billing cycle. When you downgrade, the change takes effect at the next billing cycle.",
  },
  {
    question: "What happens if I exceed my usage limits?",
    answer:
      "We&apos;ll notify you when you&apos;re approaching your limits. For AI tokens and storage, you can purchase additional capacity. For users and workspaces, you&apos;ll need to upgrade to a higher plan.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! All our plans offer a 20% discount when you choose annual billing. This means you get 12 months for the price of 9.6 months.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and ACH bank transfers for annual plans. All payments are processed securely through Stripe.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 30-day money-back guarantee for all new customers. If you&apos;re not satisfied within your first 30 days, contact support for a full refund.",
  },
];
