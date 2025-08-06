"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Loader2,
  ListTodo,
  Target,
  Calendar,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import { useExitPlanningTasks } from "@/hooks/useExitPlanningTasks";
import { cn } from "@/lib/utils";

interface TaskIntegrationPanelProps {
  workspaceId: string;
  businessName: string;
  exitPlanningId?: string;
}

export function TaskIntegrationPanel({
  workspaceId,
  businessName,
  exitPlanningId,
}: TaskIntegrationPanelProps) {
  const {
    board,
    phases,
    milestones,
    progress,
    isLoading,
    error,
    initializeExitPlanningBoard,
    createTasksForPhase,
    linkToExitPlanning,
  } = useExitPlanningTasks(workspaceId);

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const handleInitialize = async () => {
    await initializeExitPlanningBoard(workspaceId, businessName);
    if (exitPlanningId) {
      await linkToExitPlanning(exitPlanningId);
    }
  };

  const handleCreatePhaseTasks = async (phaseId: string) => {
    await createTasksForPhase(phaseId);
    setSelectedPhase(null);
  };

  if (!board && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Task Management Integration
          </CardTitle>
          <CardDescription>
            Connect your exit planning process to task management for better
            tracking and collaboration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleInitialize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Initialize Exit Planning Tasks
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overall Progress
            </span>
            <span className="text-2xl font-bold">
              {progress.overallProgress}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress.overallProgress} className="h-3 mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">
                {progress.totalTasks}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {progress.completedTasks}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {progress.inProgressTasks}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">
                {progress.blockedTasks}
              </div>
              <div className="text-sm text-muted-foreground">Blocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Phase Management
          </CardTitle>
          <CardDescription>
            Create and manage tasks for each exit planning phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={phases[0]?.id}>
            <TabsList className="grid grid-cols-3 mb-4">
              {phases.map((phase) => (
                <TabsTrigger key={phase.id} value={phase.id}>
                  {phase.name.split("/")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {phases.map((phase) => (
              <TabsContent key={index}
                key={phase.id}
                value={phase.id}
                className="space-y-4"
              >
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{phase.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {phase.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Duration: {phase.duration}
                    </span>
                    <span className="text-sm">
                      <ListTodo className="inline h-4 w-4 mr-1" />
                      {phase.tasks.length} tasks
                    </span>
                  </div>
                </div>

                {progress.phaseProgress[phase.id] !== undefined ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phase Progress</span>
                      <span>{progress.phaseProgress[phase.id]}%</span>
                    </div>
                    <Progress
                      value={progress.phaseProgress[phase.id]}
                      className="h-2"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => handleCreatePhaseTasks(phase.id)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Tasks for This Phase
                  </Button>
                )}

                {/* Phase Tasks Preview */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Tasks in this phase:</h5>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {phase.tasks.map((task, idx) => (
                      <div key={idx}
                        key={idx}
                        className="flex items-center gap-2 text-sm p-2 hover:bg-muted rounded"
                      >
                        <Circle className="h-3 w-3 text-muted-foreground" />
                        <span className="flex-1">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Milestones
          </CardTitle>
          <CardDescription>
            Track major milestones in your exit planning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {milestones.length > 0 ? (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={index}
                  key={milestone.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    milestone.status === "completed" &&
                      "bg-green-50 border-green-200",
                  )}
                >
                  {milestone.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {milestone.description}
                    </div>
                  </div>
                  {milestone.due_date && (
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {new Date(milestone.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No milestones created yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() =>
              window.open(`/dashboard/tasks?board=${board?.id}`, "_blank")
            }
            disabled={!board}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Full Task Board
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open("/dashboard/tasks/templates", "_blank")}
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Browse Task Templates
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
