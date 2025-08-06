"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Type definitions for the Heading component
 */
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/**
 * Props interface for the Heading component
 */
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The heading level (h1-h6) for semantic HTML */
  level: HeadingLevel;
  /** Optional size override - if not provided, defaults based on heading level */
  size?: HeadingSize;
  /** Whether to apply a gradient effect to the text */
  hasGradient?: boolean;
  /** Whether to add additional top margin for spacing */
  withMargin?: boolean;
  /** Center text alignment */
  centered?: boolean;
  /** Add responsive sizing (larger on desktop) */
  responsive?: boolean;
  /** Child elements */
  children: ReactNode;
}

/**
 * Heading component for consistent typography
 *
 * @example
 * <Heading level="h1">Page Title</Heading>
 * <Heading level="h2" size="xl" hasGradient>Gradient Section Title</Heading>
 */
export function Heading({
  level,
  size,
  hasGradient = false,
  withMargin = false,
  centered = false,
  responsive = true,
  className,
  children,
  ...props
}: HeadingProps) {
  // Map heading levels to default sizes if size not provided
  const defaultSizes: Record<HeadingLevel, HeadingSize> = {
    h1: "3xl",
    h2: "2xl",
    h3: "xl",
    h4: "lg",
    h5: "md",
    h6: "sm",
  };

  const Tag = level;
  const fontSize = size || defaultSizes[level];

  const getResponsiveClass = (size: HeadingSize): string => {
    if (!responsive) return "";

    switch (size) {
      case "3xl":
        return "text-3xl md:text-5xl";
      case "2xl":
        return "text-2xl md:text-4xl";
      case "xl":
        return "text-xl md:text-3xl";
      case "lg":
        return "text-lg md:text-2xl";
      case "md":
        return "text-md md:text-xl";
      case "sm":
        return "text-sm md:text-lg";
      case "xs":
        return "text-xs md:text-base";
      default:
        return "";
    }
  };

  return (
    <Tag
      className={cn(
        "font-semibold leading-tight",
        getResponsiveClass(fontSize),
        withMargin && "mt-6 mb-4",
        centered && "text-center",
        hasGradient &&
          "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
        className,
      )}
      {...(props || {})}
    >
      {children}
    </Tag>
  );
}

export default Heading;
