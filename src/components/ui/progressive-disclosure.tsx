"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface ProgressiveDisclosureProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  variant?: "card" | "inline" | "minimal";
  className?: string;
}

export function ProgressiveDisclosure({
  title,
  summary,
  children,
  defaultExpanded = false,
  variant = "card",
  className,
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const baseClasses = {
    card: "border border-gray-200 rounded-lg bg-white shadow-sm",
    inline: "border-l-4 border-primary-500 pl-4",
    minimal: "",
  };

  const headerClasses = {
    card: "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
    inline: "py-2 cursor-pointer",
    minimal: "cursor-pointer",
  };

  const contentClasses = {
    card: "px-4 pb-4 border-t border-gray-100",
    inline: "mt-2",
    minimal: "mt-2",
  };

  return (
    <div className={cn(baseClasses[variant], className)}>
      <div
        className={headerClasses[variant]}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{summary}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className={contentClasses[variant]}>
          <div className="animate-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface ContentSummaryProps {
  title: string;
  points: string[];
  expandLabel?: string;
  children: React.ReactNode;
}

export function ContentSummary({
  title,
  points,
  expandLabel = "Learn More",
  children,
}: ContentSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <ul className="space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        {showDetails ? "Show Less" : expandLabel}
        {showDetails ? (
          <ChevronUpIcon className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        )}
      </button>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}