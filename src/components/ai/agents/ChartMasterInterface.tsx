import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  GitBranch,
  Network,
  Calendar,
  Brain,
  Map,
  PieChart,
  Activity,
  Workflow,
  Download,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChartMasterInterfaceProps {
  onSubmit: (data: ChartRequest) => Promise<ChartResponse>;
  initialData?: any;
}

interface ChartRequest {
  request: string;
  type: string;
  data?: any;
}

interface ChartResponse {
  mermaid_code: string;
  rendered_url?: string;
  rendered_svg?: string;
  chart_type: string;
  title: string;
  description: string;
  recommendations: string[];
}

const CHART_TYPES = [
  {
    value: "auto",
    label: "Auto-detect",
    icon: Brain,
    description: "Let AI choose the best chart type",
  },
  {
    value: "flowchart",
    label: "Flowchart",
    icon: Workflow,
    description: "Process flows and decision trees",
  },
  {
    value: "sequence",
    label: "Sequence",
    icon: Activity,
    description: "Interaction and communication flows",
  },
  {
    value: "gantt",
    label: "Gantt Chart",
    icon: Calendar,
    description: "Project timelines and schedules",
  },
  {
    value: "stateDiagram",
    label: "State Diagram",
    icon: Network,
    description: "State machines and transitions",
  },
  {
    value: "mindmap",
    label: "Mind Map",
    icon: Brain,
    description: "Hierarchical concept organization",
  },
  {
    value: "journey",
    label: "User Journey",
    icon: Map,
    description: "User experience mapping",
  },
  {
    value: "pie",
    label: "Pie Chart",
    icon: PieChart,
    description: "Data distribution visualization",
  },
  {
    value: "gitGraph",
    label: "Git Graph",
    icon: GitBranch,
    description: "Version control workflows",
  },
];

export const ChartMasterInterface: React.FC<ChartMasterInterfaceProps> = ({
  onSubmit,
  initialData,
}) => {
  const [request, setRequest] = useState("");
  const [chartType, setChartType] = useState("auto");
  const [response, setResponse] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!request.trim()) {
      toast({
        title: "Error",
        description: "Please describe what chart you want to create",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const chartRequest: ChartRequest = {
        request,
        type: chartType,
        data: initialData,
      };

      const result = await onSubmit(chartRequest);
      setResponse(result);
      setActiveTab("output");

      toast({
        title: "Chart Created",
        description: `Successfully generated ${result.chart_type} diagram`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create chart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyMermaidCode = () => {
    if (response?.mermaid_code) {
      navigator.clipboard.writeText(response.mermaid_code);
      toast({
        title: "Copied",
        description: "Mermaid code copied to clipboard",
      });
    }
  };

  const downloadSVG = () => {
    if (response?.rendered_svg) {
      const blob = new Blob([response.rendered_svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${response.title.toLowerCase().replace(/\s+/g, "-")}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getChartIcon = (type: string) => {
    const chartType = CHART_TYPES.find((ct) => ct.value === type);
    return chartType ? (
      <chartType.icon className="w-4 h-4" />
    ) : (
      <BarChart className="w-4 h-4" />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-6 h-6" />
          Chart Master
        </CardTitle>
        <CardDescription>
          Create sophisticated data visualizations and diagrams using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Create Chart</TabsTrigger>
            <TabsTrigger value="output" disabled={!response}>
              View Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-start gap-2">
                        <type.icon className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe Your Chart</label>
              <Textarea
                placeholder="E.g., Create a flowchart showing the customer onboarding process with decision points for verification and approval steps..."
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            {initialData && (
              <Alert>
                <AlertDescription>
                  Using provided data for visualization
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || !request.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating Chart...
                </>
              ) : (
                <>
                  <BarChart className="w-4 h-4 mr-2" />
                  Generate Chart
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            {response && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{response.title}</h3>
                    <Badge variant="outline" className="gap-1">
                      {getChartIcon(response.chart_type)}
                      {response.chart_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {response.description}
                  </p>
                </div>

                {response.rendered_svg && (
                  <div className="border rounded-lg p-4 bg-muted/10">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: response.rendered_svg,
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Mermaid Code</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyMermaidCode}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      {response.rendered_svg && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={downloadSVG}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download SVG
                        </Button>
                      )}
                    </div>
                  </div>
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                    <code className="text-sm">{response.mermaid_code}</code>
                  </pre>
                </div>

                {response.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommendations</h4>
                    <ul className="space-y-1">
                      {response.recommendations.map((rec, index) => (
                        <li key={index}
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("input")}
                  className="w-full"
                >
                  Create Another Chart
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
