import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  duration?: number;
}

export const AnimatedGradientText = ({
  text,
  className,
  gradientFrom = "#ff7700",
  gradientTo = "#4e44ce",
  duration = 3,
}: AnimatedGradientTextProps) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r animate-gradient-x inline-block",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo}, ${gradientFrom})`,
        backgroundSize: "200% 100%",
        animation: `gradient-x ${duration}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
};

export default AnimatedGradientText;
