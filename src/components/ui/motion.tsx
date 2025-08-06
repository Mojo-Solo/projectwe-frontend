"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { animations } from "@/lib/design-tokens";

/**
 * Props interface for the Motion component
 */
interface MotionProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Animation type to apply */
  animation: "fade" | "slide-up" | "scale" | "blur-fade";
  /** Delay in seconds before starting the animation */
  delay?: number;
  /** Viewport threshold percentage for triggering the animation */
  threshold?: number;
  /** Whether to trigger the animation only once */
  once?: boolean;
  /** Whether to show debug outlines (dev mode only) */
  debug?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Motion component for consistent animation effects
 *
 * @example
 * <Motion animation="fade">
 *   <p>This will fade in when it enters the viewport</p>
 * </Motion>
 */
export function Motion({
  children,
  animation,
  delay = 0,
  threshold = 0.2,
  once = true,
  debug = false,
  className,
}: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, delay, hasAnimated]);

  /**
   * Get the appropriate CSS classes for the selected animation
   */
  const getAnimationStyles = (): string => {
    if (!isInView && !hasAnimated) {
      switch (animation) {
        case "fade":
          return "opacity-0";
        case "slide-up":
          return "opacity-0 translate-y-8";
        case "scale":
          return "opacity-0 scale-95";
        case "blur-fade":
          return "opacity-0 blur-sm";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        getAnimationStyles(),
        debug && "outline outline-1 outline-pink-500",
        className,
      )}
      style={{
        transitionDuration: hasAnimated ? animations.durations.normal : "0ms",
        transitionTimingFunction: animations.easings.default,
        transitionDelay: hasAnimated ? `${delay}s` : "0s",
      }}
    >
      {children}
    </div>
  );
}

export default Motion;
