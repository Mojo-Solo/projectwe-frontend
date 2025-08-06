
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Clock,
  Shield,
  FileQuestion,
  Users,
  Briefcase,
} from "lucide-react";

const problems = [
  {
    title: "Implementation Paralysis",
    description:
      "Everyone talks about transformation. Fewer understand the strategic sequence that turns market confusion into market domination. The right moves, in the right order, collapse decades of gradual progress into months of explosive growth.",
    icon: Brain,
  },
  {
    title: "The Methodology Gap",
    description:
      "There's a methodology to transformation, a blueprint to turn industry outsiders into category killers almost overnight. It starts with seeing what others can't: every technological shift creates a narrow window of opportunity.",
    icon: Clock,
  },
  {
    title: "Strategic Execution",
    description:
      "The most transformative business applications aren't born from technical expertise alone—they're built by leaders who master the art of strategic execution, who understood the gap between knowing and doing.",
    icon: Users,
  },
  {
    title: "Market Leadership",
    description:
      "The companies that will define the next decade aren't waiting for perfect solutions. They're engineering their own certainty, one calculated move at a time, turning market confusion into market domination.",
    icon: FileQuestion,
  },
  {
    title: "The Architecture of Inevitability",
    description:
      "Market leaders have discovered breakthrough results don't come from better software—they come from better sequences. They've cracked the code on something their rivals missed entirely.",
    icon: Shield,
  },
  {
    title: "Your Moment of Truth",
    description:
      "The methodology exists. The blueprint is battle-tested. The only question is whether you're ready to bridge the gap between where you are and where the market is heading.",
    icon: Briefcase,
  },
];

export default function Component() {
  return (
    <Section
      title="The Inflection Point"
      subtitle="Beyond the Obvious"
      description="While businesses argue about which platform to choose, market leaders are orchestrating something far more sophisticated: the architecture of inevitability. The gap between knowing what to do and actually doing it is where fortunes are made or lost."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.1 + index * 0.1} inView>
            <Card className="bg-background border-none shadow-none h-full">
              <CardContent className="p-6 space-y-4 h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
