
"use client";

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

import FlickeringGrid from "@/components/magicui/flickering-grid";
import Ripple from "@/components/magicui/ripple";
import Safari from "@/components/safari";
import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "The AI Opportunity Blueprint",
    description:
      "A 6-12 week strategic diagnostic to transform AI uncertainty into a clear, prioritized, and actionable roadmap. We overcome AI complexity, align leadership, and connect technology to the essential human and cultural elements that drive successful transformations.",
    className: "hover:bg-red-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Safari
          src="/dashboard.png"
          url="https://weexit.ai"
          className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
  {
    title: "The Transformation Accelerator",
    description:
      "A long-term partnership to embed the systems, skills, and culture for sustained competitive advantage in the AI era. We address systemic issues, build an engine for continuous growth, and solve talent retention by creating a high-performance culture.",
    className:
      "order-3 xl:order-none hover:bg-blue-500/10 transition-all duration-500 ease-out",
    content: (
      <Safari
        src="/dashboard.png"
        url="https://weexit.ai"
        className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
      />
    ),
  },
  {
    title: "The AI Catalyst Cohort",
    description:
      "In a 2-day intensive followed by a 60-day execution sprint, we guide your team to build a foundational AI & People Roadmap while embedding the high-performance habits to bring it to life. You achieve clarity and tangible progress alongside a curated group of peer leaders.",
    className:
      "md:row-span-2 hover:bg-orange-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <Safari
          src="/dashboard.png"
          url="https://weexit.ai"
          className="-mb-48 ml-12 mt-16 h-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
  {
    title: "Strategic Implementation Framework",
    description:
      "The methodology exists. The blueprint is battle-tested. We provide the expert, unbiased analysis you need to confidently decide whether to build, buy, or partner, ensuring your decision aligns with your long-term strategy, capabilities, and budget.",
    className:
      "flex-row order-4 md:col-span-2 md:flex-row xl:order-none hover:bg-green-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Ripple className="absolute -bottom-full" />
        <Safari
          src="/dashboard.png"
          url="https://weexit.ai"
          className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
];

export default function Component() {
  return (
    <Section
      title="Build Your Blueprint"
      subtitle="The Transformation Accelerator"
      description="The leaders who will own the next decade are making moves right now. They're not merely adapting to change—they're architecting it. Our proven methodology turns market confusion into market domination."
      className="bg-neutral-100 dark:bg-neutral-900"
    >
      <div className="mx-auto mt-16 grid max-w-sm grid-cols-1 gap-6 text-gray-500 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={`feature-${index}`}
            className={cn(
              "group relative items-start overflow-hidden bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl",
              feature.className,
            )}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="font-semibold mb-2 text-primary text-lg">
                {feature.title}
              </h3>
              <p className="text-foreground">{feature.description}</p>
            </div>
            {feature.content}
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-800 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
