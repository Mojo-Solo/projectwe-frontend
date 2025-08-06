"use client";

import React, { useState } from "react";
import Section from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqCategories = {
  popular: {
    label: "Most Asked",
    icon: <Star className="h-4 w-4" />,
    faqs: [
      {
        id: "client-management",
        question: "How does WeExit.ai help me manage multiple client engagements?",
        answer:
          "WeExit.ai is built exclusively for exit planning professionals who juggle numerous client relationships. It organizes every case into a simple, streamlined workflow—letting you reduce administrative tasks by up to 60%.",
        popularity: 95,
      },
      {
        id: "pricing",
        question: "What does WeExit.ai cost?",
        answer:
          "WeExit.ai offers flexible pricing: Essentials ($199/month) for solo practitioners, Professional ($349/month) for small teams, and Enterprise ($649/month) for larger firms. All plans include a 14-day free trial.",
        popularity: 90,
      },
      {
        id: "implementation",
        question: "How long does it take to implement WeExit.ai?",
        answer:
          "Most advisors are up and running within 1-2 days. Our guided onboarding process helps you set up your account in under an hour, with optional 30-minute orientation call.",
        popularity: 85,
      },
    ],
  },
  features: {
    label: "Features & Platform",
    icon: <Search className="h-4 w-4" />,
    faqs: [
      {
        id: "four-pillars",
        question: "What are the 'Four Pillars' of the WeExit.ai platform?",
        answer:
          "Our platform is organized around four key pillars: (1) Client Management, (2) Education, (3) Strategic AI Coach, and (4) Plan Execution. This structure ensures you have everything you need at each stage.",
        popularity: 75,
      },
      {
        id: "upcoming-features",
        question: "What new features are coming to WeExit.ai?",
        answer:
          "Coming soon: separate interfaces for advisors and business owners, advanced educational modules, enhanced plan execution with team roles, and deeper integration with existing advisor tools.",
        popularity: 60,
      },
      {
        id: "specialties",
        question: "Does WeExit.ai work for specific exit planning specialties?",
        answer:
          "Yes, WeExit.ai supports various exit planning specialties including family business transitions, strategic sales, ESOPs, management buyouts, with specialized templates and guidance for each scenario.",
        popularity: 70,
      },
    ],
  },
  technical: {
    label: "Security & Integration",
    icon: <Search className="h-4 w-4" />,
    faqs: [
      {
        id: "security",
        question: "Is my clients' sensitive data secure with WeExit.ai?",
        answer:
          "Security is non-negotiable. WeExit.ai uses enterprise-grade security protocols, end-to-end encryption, and role-based access. Your data is stored in SOC 2 Type II compliant facilities.",
        popularity: 80,
      },
      {
        id: "integration",
        question: "Can WeExit.ai integrate with my existing tools?",
        answer:
          "Absolutely. Our open architecture syncs seamlessly with Salesforce, HubSpot, Slack, Microsoft Teams, and more. No more redundant data entry—just a single source of truth.",
        popularity: 65,
      },
      {
        id: "onboarding",
        question: "How quickly can I onboard my existing client list?",
        answer:
          "You can migrate your entire client roster in under a day. WeExit.ai's onboarding utilities and import tools for common CRMs make it practically effortless.",
        popularity: 55,
      },
    ],
  },
  support: {
    label: "Support & Training",
    icon: <Search className="h-4 w-4" />,
    faqs: [
      {
        id: "training",
        question: "What training and support do you provide?",
        answer:
          "Every subscription includes unlimited support, comprehensive training resources, video tutorials, weekly webinars, and personalized onboarding sessions.",
        popularity: 70,
      },
      {
        id: "difference",
        question: "How is WeExit.ai different from other practice management tools?",
        answer:
          "Our platform was created by exit planning professionals for exit planning professionals. Unlike generic CRMs, WeExit.ai includes exit-specific templates, AI guidance, and collaboration tools.",
        popularity: 65,
      },
      {
        id: "roi",
        question: "How do you measure ROI for professionals using WeExit.ai?",
        answer:
          "Most professionals slash admin time by 30-50%, onboard new advisors 40% faster, and handle 25% more clients without extra overhead. Our dashboard includes time-saving metrics.",
        popularity: 60,
      },
    ],
  },
};

export default function FAQOptimized() {
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const allFaqs = Object.values(faqCategories).flatMap(category => category.faqs);
  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqCategories[activeTab as keyof typeof faqCategories].faqs;

  return (
    <Section
      title="FAQ"
      subtitle="Find answers quickly"
      description="Get answers to common questions about using WeExit.ai in your exit planning practice."
    >
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search frequently asked questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs - Only show if not searching */}
      {!searchQuery && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(faqCategories).map(([key, category]) => (
              <TabsTrigger key={category]} key={key} value={key} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* FAQ Accordion */}
      <div className="mx-auto my-8 md:max-w-[800px]">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          {filteredFaqs.map((faq) => (
            <AccordionItem key={index}
              key={faq.id}
              value={faq.id}
              className="w-full border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 text-left">
                <div className="flex items-center gap-3">
                  {faq.popularity >= 80 && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h4 className="mb-4 text-center text-sm font-medium tracking-tight text-foreground/80">
          Still have questions? Our team is ready to help.
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="outline" asChild>
            <a href="mailto:hello@weexit.ai">Email Support</a>
          </Button>
          <Button asChild>
            <a href="/schedule-demo">Schedule Demo</a>
          </Button>
        </div>
      </div>
    </Section>
  );
}