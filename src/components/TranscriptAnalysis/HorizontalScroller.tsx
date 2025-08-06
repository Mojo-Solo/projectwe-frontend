"use client";

import React, { useRef } from "react";
import AnimatedGradientText from "../magicui/animated-gradient-text";
import AnimatedBeam from "../magicui/animated-beam";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface TranscriptAnalyzerProps {
  sections: Section[];
  title?: string;
}

export const TranscriptAnalyzer: React.FC<TranscriptAnalyzerProps> = ({
  sections,
  title = "Transcript Analysis",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-8">
      <div className="flex items-center justify-between mb-6">
        <AnimatedGradientText text={title} className="text-2xl font-bold" />
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sections.map((section, i) => (
          <div key={i}
            key={`transcript-section-${i}`}
            className="min-w-[350px] w-[80vw] max-w-[500px] snap-start pr-6"
          >
            <Card className="h-full p-6 relative overflow-hidden">
              <AnimatedBeam
                className="absolute inset-0"
                beamColor="#ffffff"
                beamOpacity={0.1}
                beamHeight={2}
                beamWidth="100%"
                glowColor="#4f8eff"
                glowSpread={20}
                glowOpacity={0.3}
                speed={1.5}
                direction="left-to-right"
              />
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              <div>{section.content}</div>
            </Card>
          </div>
        ))}
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari, and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
