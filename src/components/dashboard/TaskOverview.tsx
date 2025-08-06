"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckSquare, Square, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskOverviewProps {
  detailed?: boolean;
}

export function TaskOverview({ detailed = false }: TaskOverviewProps) {
  const taskStats = {
    total: 48,
    completed: 28,
    inProgress: 12,
    overdue: 3,
    upcoming: 5,
  };

  const recentTasks = [
    {
      id: 1,
      title: "Complete financial audit",
      category: "Finance",
      priority: "high",
      status: "completed",
      dueDate: "2024-03-10",
    },
    {
      id: 2,
      title: "Review legal contracts",
      category: "Legal",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-03-15",
    },
    {
      id: 3,
      title: "Update business plan",
      category: "Strategy",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-03-20",
    },
    {
      id: 4,
      title: "Prepare investor deck",
      category: "Marketing",
      priority: "high",
      status: "overdue",
      dueDate: "2024-03-05",
    },
    {
      id: 5,
      title: "Schedule stakeholder meetings",
      category: "Communication",
      priority: "medium",
      status: "upcoming",
      dueDate: "2024-03-25",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Square className="h-4 w-4 text-gray-400" />;
    }
  };

  const completionRate = Math.round(
    (taskStats.completed / taskStats.total) * 100,
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Task Progress</CardTitle>
          <Badge variant="secondary">{taskStats.total} Total</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm font-semibold">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />

          <div className="grid grid-cols-2 gap-3 mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
            >
              <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold">{taskStats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20"
            >
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold">{taskStats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20"
            >
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-semibold">{taskStats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/20"
            >
              <Square className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm font-semibold">{taskStats.upcoming}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Recent Tasks
          </h4>
          <div className="space-y-2">
            {recentTasks
              .slice(0, detailed ? recentTasks.length : 3)
              .map((task, index) => (
                <motion key={index}.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs",
                            getPriorityColor(task.priority),
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            View All Tasks
          </Button>
          <Button className="flex-1">Add Task</Button>
        </div>
      </CardContent>
    </Card>
  );
}
