
interface PipelinePageProps {
  className?: string;
  children?: React.ReactNode;
}

import PipelineConveyor from "@/components/PipelineConveyor";

export const dynamic = 'force-dynamic';

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            huYman Pipeline
          </h1>
          <p className="text-xl text-gray-400">
            Visualizing the symbiosis of machine and human intelligence in a
            dynamic workflow
          </p>
        </div>

        <PipelineConveyor
          title="AI + Human Collaborative Pipeline"
          items={[
            { id: 1, label: "Stage 1: Data Collection", status: "completed" },
            { id: 2, label: "Stage 2: AI Analysis", status: "completed" },
            { id: 3, label: "Stage 3: Human Review", status: "active" },
            { id: 4, label: "Stage 4: Refinement", status: "pending" },
            { id: 5, label: "Stage 5: Implementation", status: "pending" },
            { id: 6, label: "Stage 6: Evaluation", status: "pending" },
          ]}
        />

        <div className="mt-24 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            How Machine & Human Intelligence Work Together
          </h2>
          <p className="text-gray-400">
            Our pipeline illustrates the seamless flow between automated AI
            processes and human expertise, creating a synergistic workflow that
            leverages the strengths of both intelligences.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">
                Machine Intelligence
              </h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• Rapid data processing and analysis</li>
                <li>• Pattern recognition across vast datasets</li>
                <li>• Consistent application of algorithms</li>
                <li>• 24/7 operational capability</li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Human Intelligence</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• Contextual understanding and nuance</li>
                <li>• Creative problem-solving</li>
                <li>• Ethical decision making</li>
                <li>• Adaptability to novel situations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
