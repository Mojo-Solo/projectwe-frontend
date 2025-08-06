import Section from "@/components/section";
import { ProgressiveDisclosure } from "@/components/ui/progressive-disclosure";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "client-management",
    question: "How does WeExit.ai help me manage multiple client engagements?",
    answer:
      "WeExit.ai is built exclusively for exit planning professionals who juggle numerous client relationships. It organizes every case into a simple, streamlined workflow—letting you reduce administrative tasks by up to 60%. Imagine how many new clients you can take on today once your schedule frees up.",
  },
  {
    id: "four-pillars",
    question: "What are the 'Four Pillars' of the WeExit.ai platform?",
    answer:
      "Our platform is organized around four key pillars: (1) Client Management for tracking timelines and progress, (2) Education for learning about exit options, risk mitigation, and value drivers, (3) Strategic AI Coach for tailored guidance, and (4) Plan Execution for implementing strategies with templates and collaboration tools. This structure ensures you have everything you need at each stage of the exit planning process.",
  },
  {
    id: "pricing",
    question:
      "What does WeExit.ai cost, and are there different pricing tiers?",
    answer:
      "WeExit.ai offers flexible pricing based on your practice needs. We have three tiers: Essentials ($199/month) for solo practitioners, Professional ($349/month) for small teams handling up to 15 clients, and Enterprise ($649/month) for larger firms with unlimited clients and advanced customization. All plans include our core features, with higher tiers adding team collaboration tools, white-labeling options, and integration capabilities. We offer a 20% discount for annual billing and a 14-day free trial with no credit card required.",
  },
  {
    id: "implementation",
    question: "How long does it take to implement WeExit.ai in my practice?",
    answer:
      "Most advisors are up and running within 1-2 days. Our guided onboarding process helps you set up your account, configure your preferences, and import your client data in under an hour. You'll then have a 30-minute orientation call with our team (optional but recommended) to ensure you're getting maximum value. Within a week, most users report that WeExit.ai feels like a natural part of their workflow.",
  },
  {
    id: "upcoming-features",
    question: "What new features are coming to WeExit.ai?",
    answer:
      "We&apos;re constantly enhancing the platform based on advisor feedback. Coming soon: separate interfaces for advisors and business owners, advanced educational modules on topics like Asset vs. Stock Sales, enhanced plan execution with specialized team role assignments, and deeper integration with existing advisor tools. Our beta testers are already providing valuable input on these features.",
  },
  {
    id: "difference",
    question:
      "How is WeExit.ai different from other practice management tools?",
    answer:
      "Our platform was created by exit planning professionals for exit planning professionals. We understand the complexities of coordinating multiple advisors and implementing transition strategies. Unlike generic CRMs or document management systems, WeExit.ai includes exit-specific templates, AI guidance tailored to different exit scenarios, and collaboration tools designed for the unique team dynamics of exit planning.",
  },
  {
    id: "onboarding",
    question: "How quickly can I onboard my existing client list to WeExit.ai?",
    answer:
      "You can migrate your entire client roster in under a day—even a few hours if you're fully prepared. WeExit.ai's onboarding utilities and ready-to-use templates make it practically effortless. We provide import tools for common CRMs and a guided process for manual entries. That means you'll start seeing immediate ROI, with drastically less admin work and fewer headaches, right now.",
  },
  {
    id: "security",
    question:
      "Is my clients' sensitive exit planning data secure with WeExit.ai?",
    answer:
      "Security is non-negotiable. WeExit.ai uses enterprise-grade security protocols, end-to-end encryption, and role-based access. Your data is stored in SOC 2 Type II compliant facilities with regular security audits. We never share your data with third parties, and you have full control over your data at all times, so you can focus on delivering value without worrying about data breaches.",
  },
  {
    id: "roi",
    question:
      "How do you measure the ROI for exit planning professionals using WeExit.ai?",
    answer:
      "Most professionals slash admin time by 30-50%, onboard new advisors 40% faster, and handle 25% more clients without extra overhead. This means more revenue, less stress, and a practice that can scale aggressively without burning you out. Our dashboard includes time-saving metrics so you can track your own efficiency improvements.",
  },
  {
    id: "integration",
    question:
      "Can WeExit.ai integrate with my existing exit planning tools and CRM?",
    answer:
      "Absolutely. Our open architecture syncs seamlessly with Salesforce, HubSpot, Slack, Microsoft Teams, and more. We also integrate with commonly used document management systems, email platforms, and calendar applications. No more redundant data entry—just a single source of truth for your entire operation so you can keep growing confidently.",
  },
  {
    id: "training",
    question: "What training and support do you provide for new users?",
    answer:
      "Every subscription includes unlimited support and comprehensive training resources. This includes access to our knowledge base, video tutorials, weekly live webinars, and personalized onboarding sessions. Our Customer Success team is available via chat, email, or scheduled calls to answer questions and help you maximize the platform's value. Enterprise users also receive quarterly strategy sessions to ensure they're utilizing all available features.",
  },
  {
    id: "specialties",
    question: "Does WeExit.ai work for specific exit planning specialties?",
    answer:
      "Yes, WeExit.ai is designed to support various exit planning specialties. Whether you focus on family business transitions, strategic sales to third parties, ESOPs, management buyouts, or any other exit strategy, our platform includes specialized templates, guidance, and resources for each scenario. You can customize your workflow based on your specialty, and our AI coach provides industry-specific insights relevant to your niche.",
  },
];

export default function FAQ() {
  // Most important FAQs (commonly asked by prospects)
  const essentialFaqs = faqs.slice(0, 6);
  // Additional FAQs (for more detailed inquiries)
  const additionalFaqs = faqs.slice(6);

  return (
    <Section
      title="FAQ"
      subtitle="Common Questions"
      description="Get answers to the most frequently asked questions about ProjectWE®."
    >
      <div className="mx-auto my-12 md:max-w-[800px] space-y-8">
        {/* Essential FAQs - Always Visible */}
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          {essentialFaqs.map((faq) => (
            <AccordionItem key={index}
              key={faq.id}
              value={faq.id}
              className="w-full border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional FAQs - Progressive Disclosure */}
        <ProgressiveDisclosure
          title="More Questions"
          summary="Additional answers about features, security, and implementation"
          variant="minimal"
          className="text-center"
        >
          <div className="mt-6">
            <Accordion
              type="single"
              collapsible
              className="flex w-full flex-col items-center justify-center space-y-2"
            >
              {additionalFaqs.map((faq) => (
                <AccordionItem key={index}
                  key={faq.id}
                  value={faq.id}
                  className="w-full border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ProgressiveDisclosure>
      </div>
      
      <div className="text-center">
        <h4 className="mb-4 text-center text-sm font-medium tracking-tight text-foreground/80">
          Still have questions? Our team is ready to help.
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:hello@projectwe.com"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <span>Email us</span>
          </a>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <a
            href="/contact"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <span>Schedule a consultation</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
