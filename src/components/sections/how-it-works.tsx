
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

import Features from "@/components/features-vertical";
import Section from "@/components/section";
import {
  Brain,
  BookOpen,
  Briefcase,
  BarChart3,
  Users,
  Target,
  Clock,
  ChartPie,
} from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Onboard Your Clients",
    content:
      "Begin by creating comprehensive client profiles with our intuitive onboarding process. Capture essential business information, owner goals, timeline expectations, and industry-specific details. Our platform automatically organizes clients by exit readiness, industry, and revenue potential, helping you prioritize your advisory services.",
    image: "/dashboard.png",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Build the Exit Plan Foundation",
    content:
      "Access our comprehensive educational resources tailored to each client's situation. Explore the 8 exit options (4 internal, 4 external) with detailed guides and assessments. Evaluate risk using our '5 Ds' framework (Death, Disability, Divorce, Distress, Disagreement) and identify critical value drivers that will maximize business value.",
    image: "/dashboard.png",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Leverage AI-Powered Insights",
    content:
      "Our strategic AI coach analyzes each client's unique profile and provides tailored recommendations. Receive industry-specific exit valuation benchmarks, timing strategies, and team composition guidance. The AI identifies knowledge gaps and suggests relevant educational resources while highlighting critical next steps in the exit planning process.",
    image: "/dashboard.png",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    id: 4,
    title: "4. Assemble Your Advisory Team",
    content:
      "Use our team building tools to identify and engage the perfect specialists for each exit scenario. Our platform helps coordinate attorneys, financial advisors, tax specialists, and other experts within a unified workspace. Assign role-specific tasks, share relevant documents, and maintain clear communication channels throughout the process.",
    image: "/dashboard.png",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    id: 5,
    title: "5. Execute the Exit Strategy",
    content:
      "Transform strategies into action with our comprehensive template library. Select from frameworks for family succession, strategic buyer transitions, financial buyer roadmaps, and organized liquidation. Each template includes detailed checklists, timelines, document requirements, and communication guidelines to ensure nothing falls through the cracks.",
    image: "/dashboard.png",
    icon: <Briefcase className="w-6 h-6 text-primary" />,
  },
  {
    id: 6,
    title: "6. Monitor Progress & Adapt",
    content:
      "Track implementation milestones and progress through our visual dashboard. Set automated reminders for critical deadlines, identify bottlenecks before they become issues, and generate progress reports for client meetings. Our platform helps you continuously adapt the strategy as business conditions or owner goals evolve.",
    image: "/dashboard.png",
    icon: <ChartPie className="w-6 h-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section title="How it works" subtitle="The Complete Exit Planning Journey">
      <Features data={data} />
    </Section>
  );
}
