
interface GeneratePageProps {
  className?: string;
  children?: React.ReactNode;
}

import { Metadata } from "next";
import { SuccessDefinitionWizard } from "./components/SuccessDefinitionWizard";
import { KnowledgeExtractor } from "./components/KnowledgeExtractor";
import { BlueprintGenerator } from "./components/BlueprintGenerator";
import { MonetizationEngine } from "./components/MonetizationEngine";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AI Blueprint Executor - Define Success, Let AI Build It | WeExit",
  description:
    "Transform your expertise into AI-powered solutions. Define what success looks like, and our AI will find the path through organizational chaos to build it.",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Define Success,
              <br />
              Let AI Build It
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              You know what success looks like. Our AI finds the path through
              organizational chaos to build it. Transform expertise into
              revenue-generating AI solutions.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>103 PDFs Processed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>$2.3M Knowledge Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>3 Revenue Streams</span>
              </div>
            </div>
          </div>

          {/* Process Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Define Success
              </h3>
              <p className="text-sm text-gray-600">
                What does your ideal outcome look like?
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Extract Knowledge
              </h3>
              <p className="text-sm text-gray-600">
                AI interviews SMEs and processes documents
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Generate Blueprint
              </h3>
              <p className="text-sm text-gray-600">
                AI creates executable implementation plan
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Monetize</h3>
              <p className="text-sm text-gray-600">
                Turn knowledge into revenue streams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <SuccessDefinitionWizard />
              <KnowledgeExtractor />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <BlueprintGenerator />
              <MonetizationEngine />
            </div>
          </div>
        </div>
      </section>

      {/* WeExit Case Study */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  WeExit Success Story
                </h2>
                <p className="text-blue-100 mb-6">
                  Julie Keyes defined success as &quot;smooth business exits
                  with maximum value.&quot; Our AI processed her 103 PDFs and
                  created three revenue streams worth $2.3M annually.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Advisor licensing: $960K/year</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>AI company sales: $840K/year</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>SaaS platform: $500K/year</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">$2.3M</div>
                <div className="text-blue-200">Annual Revenue Potential</div>
                <div className="text-sm text-blue-300 mt-2">
                  From organizational chaos to AI solutions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
