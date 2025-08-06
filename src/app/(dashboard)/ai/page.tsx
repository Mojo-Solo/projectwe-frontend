
interface AIPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { AIDashboard } from "@/components/ai/AIDashboard";

export default function AIPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get intelligent insights and guidance for your exit planning journey
        </p>
      </div>
      <AIDashboard />
    </div>
  );
}
