"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

/**
 * Props interface for the PageLayout component
 */
interface PageLayoutProps {
  /** The content to display within the layout */
  children?: ReactNode;
  /** Additional CSS classes for the main content area */
  className?: string;
  /** Whether to show the footer (defaults to true) */
  hasFooter?: boolean;
  /** Whether to add top padding to the main content (defaults to true) */
  hasTopPadding?: boolean;
  /** Whether to add bottom padding to the main content (defaults to true) */
  hasBottomPadding?: boolean;
  /** Container width variant (defaults to "default") */
  containerWidth?: "default" | "narrow" | "wide" | "full";
  /** Whether to show a max-width delimiter in development mode */
  showMaxWidthDelimiter?: boolean;
}

/**
 * PageLayout component for consistent page structure
 *
 * @example
 * <PageLayout>
 *   <YourPageContent />
 * </PageLayout>
 */
export function PageLayout({
  children,
  className,
  hasFooter = true,
  hasTopPadding = true,
  hasBottomPadding = true,
  containerWidth = "default",
  showMaxWidthDelimiter = false,
}: PageLayoutProps) {
  /**
   * Get the appropriate container width class based on the selected variant
   */
  const getContainerClass = () => {
    switch (containerWidth) {
      case "narrow":
        return "max-w-4xl";
      case "wide":
        return "max-w-7xl";
      case "full":
        return "max-w-none px-4 sm:px-6 lg:px-8";
      default: // Default is max-w-6xl
        return "max-w-6xl";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        className={cn(
          "flex-grow",
          hasTopPadding && "pt-12 md:pt-16",
          hasBottomPadding && "pb-12 md:pb-16",
          className,
        )}
      >
        <div
          className={cn(
            "mx-auto px-4 sm:px-6 lg:px-8 relative",
            getContainerClass(),
            showMaxWidthDelimiter &&
              process.env.NODE_ENV !== "production" &&
              "outline outline-1 outline-pink-500/20",
          )}
        >
          {children}
        </div>
      </main>
      {hasFooter && <Footer />}
    </div>
  );
}

// Force the imports to be used as values to prevent linter errors
const _preventLinterError = {
  Header,
  Footer,
  cn,
};

export default PageLayout;
