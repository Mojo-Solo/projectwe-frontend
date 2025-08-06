
interface TranscriptExamplePageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import React from "react";
import { TranscriptAnalyzer } from "../../components/TranscriptAnalysis/HorizontalScroller";

export const dynamic = 'force-dynamic';

// Sample data for the TranscriptAnalyzer component
const transcriptSections = [
  {
    title: "Business Valuation",
    content: (
      <div className="prose dark:prose-invert">
        <p>
          Current valuation estimate: <strong>$3.8-4.75 million</strong> (based
          on 4-5x EBITDA multiple).
        </p>
        <p>
          Annual growth rate: <strong>8%</strong> for the past three years.
        </p>
        <p>
          Target valuation: <strong>$7.5 million</strong> within 3 years.
        </p>
        <p>
          <em>
            Gap analysis needed to identify specific improvements required to
            reach target valuation.
          </em>
        </p>
      </div>
    ),
  },
  {
    title: "Exit Timeline",
    content: (
      <div className="prose dark:prose-invert">
        <p>
          Owner&apos;s desired exit timeframe: <strong>3 years</strong> (age
          65).
        </p>
        <p>Recommended preparation timeline:</p>
        <ul className="list-disc pl-5">
          <li>6-12 months: Business assessment and strategy development</li>
          <li>12-24 months: Implementing value enhancement initiatives</li>
          <li>6-9 months: Sale process</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Owner Goals",
    content: (
      <div className="prose dark:prose-invert">
        <p>
          Primary exit strategy preference:{" "}
          <strong>Sale to industry buyer</strong>
        </p>
        <p>Key priorities:</p>
        <ul className="list-disc pl-5">
          <li>Preserve company culture</li>
          <li>Maintain existing management team</li>
          <li>Achieve target valuation of $7.5M</li>
          <li>Consider ESOP as alternative</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Tax Considerations",
    content: (
      <div className="prose dark:prose-invert">
        <p>Owner has majority of wealth tied to business.</p>
        <p>Strategies to explore:</p>
        <ul className="list-disc pl-5">
          <li>Installment sales</li>
          <li>Opportunity zone investments</li>
          <li>1045 rollovers (depending on business structure)</li>
          <li>Tax-optimized entity structuring</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Operational Improvements",
    content: (
      <div className="prose dark:prose-invert">
        <p>
          Current manufacturing efficiency: <strong>15% below</strong> industry
          benchmarks
        </p>
        <p>Equipment modernization needed</p>
        <p>
          Opportunity to significantly increase margins through targeted
          investments
        </p>
      </div>
    ),
  },
];

export default function TranscriptExamplePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">
        Exit Planning Transcript Analysis
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        This example demonstrates how the TranscriptAnalyzer component can be
        used to present key insights extracted from exit planning consultation
        transcripts.
      </p>

      <TranscriptAnalyzer
        sections={transcriptSections}
        title="Smith Manufacturing Exit Analysis"
      />
    </div>
  );
}
