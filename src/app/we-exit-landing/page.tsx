import Blog from "@/components/sections/blog";
import CTA from "@/components/sections/cta";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Problem from "@/components/sections/problem";
import Section from "@/components/section";
import Solution from "@/components/sections/solution";
import Testimonials from "@/components/sections/testimonials";

export const dynamic = 'force-dynamic';

export default function WEExitLandingPage() {
  return (
    <main>
      <Header />
      <Hero />

      <Section
        title="The Challenge"
        subtitle="Exit planning needs better tools"
        description="Fragmented processes frustrate advisors and clients alike."
      >
        <Problem />
      </Section>

      <Section
        title="Our Solution"
        subtitle="Four Pillars of Excellence"
        description="Client Management • Education • AI Coach • Plan Execution"
      >
        <Solution />
      </Section>

      <Section title="How it works" subtitle="Smart. Simple. Effective.">
        <HowItWorks />
      </Section>

      <Section title="Features" subtitle="Complete Exit Planning Platform">
        <Features />
      </Section>

      <Section
        title="Roadmap"
        subtitle="What's Next"
        description="New capabilities developed with leading exit planning experts."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <div className="text-sm font-semibold text-primary/80 mb-1">
              Q3 2024
            </div>
            <h3 className="text-xl font-semibold mb-2">Tailored Experiences</h3>
            <p className="text-muted-foreground text-sm">
              Role-specific interfaces with targeted tools for advisors and
              owners.
            </p>
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <div className="text-sm font-semibold text-primary/80 mb-1">
              Beta Testing
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
            <p className="text-muted-foreground text-sm">
              Advanced modules on exit options, sales types, and risk
              frameworks.
            </p>
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <div className="text-sm font-semibold text-primary/80 mb-1">
              Q4 2024
            </div>
            <h3 className="text-xl font-semibold mb-2">Plan Execution</h3>
            <p className="text-muted-foreground text-sm">
              Interactive builder with client dashboards and team assignments.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Education & Collaboration"
        subtitle="Knowledge Resources"
        description=""
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              Educational Resources
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Exit Options</strong> — 8 strategies with pros/cons.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>5 Ds Risk Framework</strong> — Mitigate key business
                  risks.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Asset vs. Stock Sales</strong> — Legal and tax
                  implications.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Business Continuity</strong> — Stability through
                  transitions.
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              Team Collaboration
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Attorney Roles</strong> — Estate and M&A
                  responsibilities.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Team Building</strong> — Right professionals at right
                  time.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Task Assignment</strong> — Track team
                  responsibilities.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                  ✓
                </div>
                <span className="text-sm">
                  <strong>Best Practices</strong> — Communication and document
                  sharing.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Plan Templates"
        subtitle="Strategy to Action"
        description=""
        className="bg-neutral-100 dark:bg-neutral-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl flex flex-col h-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary text-lg">1</span>
            </div>
            <h3 className="text-base font-semibold mb-2 text-primary">
              Family Succession
            </h3>
            <p className="text-muted-foreground text-xs flex-grow mb-3">
              Leadership transition preserving harmony and success.
            </p>
            <div className="text-xs text-muted-foreground">
              Governance framework, alignment tools
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl flex flex-col h-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary text-lg">2</span>
            </div>
            <h3 className="text-base font-semibold mb-2 text-primary">
              Strategic Buyer
            </h3>
            <p className="text-muted-foreground text-xs flex-grow mb-3">
              Selling to buyers seeking operational synergies.
            </p>
            <div className="text-xs text-muted-foreground">
              Due diligence, valuation, integration
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl flex flex-col h-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary text-lg">3</span>
            </div>
            <h3 className="text-base font-semibold mb-2 text-primary">
              Financial Buyer
            </h3>
            <p className="text-muted-foreground text-xs flex-grow mb-3">
              Private equity acquisitions for financial returns.
            </p>
            <div className="text-xs text-muted-foreground">
              Growth projections, KPI tracking
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl flex flex-col h-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary text-lg">4</span>
            </div>
            <h3 className="text-base font-semibold mb-2 text-primary">
              Liquidation
            </h3>
            <p className="text-muted-foreground text-xs flex-grow mb-3">
              Maximize value when winding down operations.
            </p>
            <div className="text-xs text-muted-foreground">
              Valuation, timeline, communications
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="User Experiences"
        subtitle="Tailored for Your Role"
        description=""
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="relative">
            <div className="absolute -top-3 -left-3 bg-primary text-white text-xs font-medium rounded-full px-2 py-0.5">
              Available
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl h-full">
              <h3 className="text-xl font-semibold mb-3 text-primary">
                Advisor Platform
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tools for guiding clients through successful transitions.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Client Dashboard</strong> — Track milestones and
                    timelines
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Advisor AI</strong> — Strategic guidance and
                    coordination
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Pro Collaboration</strong> — Coordinate with
                    specialists
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-3 -left-3 bg-neutral-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
              Coming Soon
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl h-full opacity-80">
              <h3 className="text-xl font-semibold mb-3 text-neutral-500">
                Owner Portal
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tools to explore options and collaborate with advisors.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-neutral-400/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-neutral-500 text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Options Explorer</strong> — Find your ideal exit
                    path
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-neutral-400/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-neutral-500 text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Owner AI Coach</strong> — Timeline and readiness
                    tools
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="h-5 w-5 rounded-full bg-neutral-400/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-neutral-500 text-sm">
                    ✓
                  </div>
                  <span className="text-sm">
                    <strong>Advisor Connect</strong> — Share info and track
                    progress
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Testimonials"
        subtitle="Client Success Stories"
        description=""
      >
        <Testimonials />
      </Section>

      <Section
        title="Join Now"
        subtitle="Better Exit Planning"
        description="Streamline your workflow. Build stronger relationships. Deliver exceptional outcomes."
      >
        <CTA />
      </Section>

      <Footer />
    </main>
  );
}
