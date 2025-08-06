"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Play,
  Save,
  Trash2,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Bot,
  Settings,
  Copy,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIWorkflow, WorkflowStep, AVAILABLE_AGENTS } from "@/types/ai";
import AIApiService from "@/lib/ai-api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface AgentWorkflowBuilderProps {
  onWorkflowCreated?: (workflow: AIWorkflow) => void;
  initialWorkflow?: AIWorkflow;
}

export function AgentWorkflowBuilder({
  onWorkflowCreated,
  initialWorkflow,
}: AgentWorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<Partial<AIWorkflow>>(
    initialWorkflow || {
      name: "",
      description: "",
      steps: [],
      status: "draft",
    },
  );

  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [savedWorkflows, setSavedWorkflows] = useState<AIWorkflow[]>([]);

  const apiService = new AIApiService();

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      agentId: "",
      action: "",
      input: {},
      status: "pending",
    };

    setWorkflow((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), newStep],
    }));

    setSelectedStep(workflow.steps?.length || 0);
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    setWorkflow((prev) => ({
      ...prev,
      steps:
        prev.steps?.map((step, i) =>
          i === index ? { ...step, ...updates } : step,
        ) || [],
    }));
  };

  const removeStep = (index: number) => {
    setWorkflow((prev) => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index) || [],
    }));

    if (selectedStep === index) {
      setSelectedStep(null);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(workflow.steps || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkflow((prev) => ({ ...prev, steps: items }));
  };

  const saveWorkflow = async () => {
    try {
      const savedWorkflow = await apiService.createWorkflow(workflow);
      setSavedWorkflows((prev) => [...prev, savedWorkflow]);

      if (onWorkflowCreated) {
        onWorkflowCreated(savedWorkflow);
      }

      // Show success message
      alert("Workflow saved successfully!");
    } catch (error) {
      console.error("Failed to save workflow:", error);
      alert("Failed to save workflow");
    }
  };

  const executeWorkflow = async () => {
    if (!workflow.steps?.length) return;

    setIsExecuting(true);
    setExecutionResults([]);

    try {
      // First save the workflow if it doesn't have an ID
      let workflowId = (workflow as AIWorkflow).id;
      if (!workflowId) {
        const saved = await apiService.createWorkflow(workflow);
        workflowId = saved.id;
        setWorkflow(saved);
      }

      // Execute the workflow
      const result = await apiService.executeWorkflow(workflowId, {});

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const status = await apiService.getWorkflowStatus(workflowId);
          setWorkflow(status);

          if (status.status === "completed" || status.status === "failed") {
            clearInterval(pollInterval);
            setIsExecuting(false);

            // Collect results
            const results = status.steps
              .map((step) => step.output)
              .filter(Boolean);
            setExecutionResults(results);
          }
        } catch (error) {
          console.error("Failed to poll workflow status:", error);
          clearInterval(pollInterval);
          setIsExecuting(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to execute workflow:", error);
      setIsExecuting(false);
    }
  };

  const duplicateWorkflow = () => {
    const duplicated = {
      ...workflow,
      id: undefined,
      name: `${workflow.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
    };

    setWorkflow(duplicated);
  };

  const exportWorkflow = () => {
    const data = JSON.stringify(workflow, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${workflow.name || "unnamed"}.json`;
    a.click();
  };

  const getStepStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle key={i} className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Workflow Builder
          </CardTitle>
          <CardDescription>
            Create custom AI agent workflows for your exit planning process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="execute">Execute</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      placeholder="Exit Strategy Analysis"
                      value={workflow.name || ""}
                      onChange={(e) =>
                        setWorkflow((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow-description">Description</Label>
                    <Input
                      id="workflow-description"
                      placeholder="Comprehensive analysis of exit options"
                      value={workflow.description || ""}
                      onChange={(e) =>
                        setWorkflow((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Workflow Steps</h3>
                    <Button onClick={addStep} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div className="space-y-2">
                            {workflow.steps?.map((step, index) => (
                              <Draggable key={index}
                                key={step.id}
                                draggableId={step.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={cn(
                                      "border rounded-lg p-3 bg-background transition-all",
                                      snapshot.isDragging && "shadow-lg",
                                      selectedStep === index &&
                                        "ring-2 ring-primary",
                                    )}
                                    onClick={() => setSelectedStep(index)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {getStepStatusIcon(step.status)}
                                        <span className="font-medium">
                                          Step {index + 1}
                                        </span>
                                        {step.agentId && (
                                          <Badge variant="secondary">
                                            {
                                              AVAILABLE_AGENTS.find(
                                                (a) => a.id === step.agentId,
                                              )?.name
                                            }
                                          </Badge>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeStep(index);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    {step.action && (
                                      <p className="text-sm text-muted-foreground mt-2">
                                        {step.action}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {selectedStep !== null && workflow.steps?.[selectedStep] && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Configure Step {selectedStep + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Agent</Label>
                          <Select
                            value={workflow.steps[selectedStep].agentId}
                            onValueChange={(value) =>
                              updateStep(selectedStep, { agentId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_AGENTS.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4" />
                                    {agent.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Action</Label>
                          <Input
                            placeholder="Analyze financial statements"
                            value={workflow.steps[selectedStep].action}
                            onChange={(e) =>
                              updateStep(selectedStep, {
                                action: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <Label>Input Parameters (JSON)</Label>
                          <Textarea
                            placeholder='{"timeframe": "5 years", "includeProjections": true}'
                            value={JSON.stringify(
                              workflow.steps[selectedStep].input,
                              null,
                              2,
                            )}
                            onChange={(e) => {
                              try {
                                const input = JSON.parse(e.target.value);
                                updateStep(selectedStep, { input });
                              } catch {}
                            }}
                            className="font-mono text-sm"
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={saveWorkflow}
                    disabled={!workflow.name || !workflow.steps?.length}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </Button>
                  <Button variant="outline" onClick={duplicateWorkflow}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" onClick={exportWorkflow}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="execute" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Execute Workflow</CardTitle>
                  <CardDescription>
                    Run your workflow and see real-time results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={executeWorkflow}
                    disabled={!workflow.steps?.length || isExecuting}
                    className="w-full"
                  >
                    {isExecuting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Workflow
                      </>
                    )}
                  </Button>

                  {executionResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Results</h4>
                      <ScrollArea className="h-[300px] border rounded-lg p-4">
                        <pre className="text-sm">
                          {JSON.stringify(executionResults, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    name: "Complete Exit Analysis",
                    description:
                      "Full valuation, strategy, and timeline planning",
                    steps: [
                      "Valuation",
                      "Market Analysis",
                      "Strategy Development",
                      "Timeline Creation",
                    ],
                  },
                  {
                    name: "Quick Valuation",
                    description: "Fast business valuation with key metrics",
                    steps: [
                      "Financial Analysis",
                      "Market Comparables",
                      "Valuation Report",
                    ],
                  },
                  {
                    name: "Risk Assessment",
                    description: "Comprehensive risk analysis and mitigation",
                    steps: [
                      "Risk Identification",
                      "Impact Analysis",
                      "Mitigation Strategies",
                    ],
                  },
                ].map((template) => (
                  <Card key={index}
                    key={template.name}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {template.steps.map((step, i) => (
                          <Badge key={i} key={i} variant="secondary">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
