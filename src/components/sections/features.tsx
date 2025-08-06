
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

import FeaturesHorizontal from "@/components/features-horizontal";
import Section from "@/components/section";
import { ProgressiveDisclosure } from "@/components/ui/progressive-disclosure";
import {
  Brain,
  ChartColumn,
  BookOpen,
  Briefcase,
  FileText,
  ChartPie,
  Users,
  Shield,
} from "lucide-react";

const data = [
  {
    id: 1,
    title: "The AI Opportunity Blueprint",
    content:
      "A 6-12 week strategic diagnostic to transform AI uncertainty into clear, actionable roadmap.\nPrioritized initiatives with ROI projections and strategic guidance.",
    image: "/dashboard.png",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Transformation Accelerator",
    content:
      "Long-term partnership embedding systems, skills, and culture for competitive advantage.\nCross-functional Tiger Teams tackle high-priority projects with expert guidance.",
    image: "/dashboard.png",
    icon: <ChartColumn className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "AI Catalyst Cohort",
    content:
      "2-day intensive + 60-day execution sprint for foundational AI & People Roadmap.\nLearn alongside curated peer leaders with high-performance accountability.",
    image: "/dashboard.png",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "AI Workflow Quick-Start",
    content:
      "Automate a single, painful business process in 90 days for measurable ROI.\nProve AI value with tangible wins and build momentum for larger initiatives.",
    image: "/dashboard.png",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
  },
  {
    id: 5,
    title: "Leadership Engine",
    content:
      "3-6 month intensive equipping leadership teams with disruption-ready mindset.\nOperating rhythm and alignment prerequisite for successful transformation.",
    image: "/dashboard.png",
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
  {
    id: 6,
    title: "Build vs. Buy Advisory",
    content:
      "Expert, unbiased analysis for confident build, buy, or partner decisions.\nAligns with long-term strategy, capabilities, and budget constraints.",
    image: "/dashboard.png",
    icon: <ChartPie className="h-6 w-6 text-primary" />,
  },
  {
    id: 7,
    title: "Internal AI Enablement",
    content:
      "Strategic co-pilot coaching internal teams with proven methodologies.\nEmbeds People + Culture aspects often ignored by technical teams.",
    image: "/dashboard.png",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    id: 8,
    title: "AI-Ready Workforce Training",
    content:
      "Company-wide competitive advantage through AI literacy and practical application.\nTransform fear and uncertainty into strategic capability.",
    image: "/dashboard.png",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
];

export default function Component() {
  // Core services (most popular and comprehensive)
  const coreServices = data.slice(0, 4);
  // Additional services (for those who need specialized options)
  const additionalServices = data.slice(4);

  return (
    <Section
      title="Strategic Excellence"
      subtitle="ProjectWE® Core Services"
    >
      <div className="space-y-8">
        {/* Core Services - Always Visible */}
        <FeaturesHorizontal
          collapseDelay={5000}
          linePosition="bottom"
          data={coreServices}
        />
        
        {/* Additional Services - Progressive Disclosure */}
        <div className="max-w-4xl mx-auto">
          <ProgressiveDisclosure
            title="Specialized Services"
            summary="Additional offerings for specific transformation needs"
            variant="minimal"
            className="text-center"
          >
            <div className="mt-8">
              <FeaturesHorizontal
                collapseDelay={5000}
                linePosition="bottom"
                data={additionalServices}
              />
            </div>
          </ProgressiveDisclosure>
        </div>
      </div>
    </Section>
  );
}
