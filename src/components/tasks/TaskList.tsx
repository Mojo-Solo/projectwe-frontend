"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { InferSelectModel } from "@/db/schema";
import { tasks, users } from "@/db/schema";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Task = InferSelectModel<typeof tasks>;
type User = InferSelectModel<typeof users>;

interface TaskWithRelations extends Task {
  creator: Pick<User, "id" | "name" | "email" | "image">;
  assignee?: Pick<User, "id" | "name" | "email" | "image">;
  project?: { id: string; name: string; status: string };
  _count: {
    comments: number;
    attachments: number;
  };
}

export function TaskList() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskWithRelations[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task.id === taskId ? updatedTask : task)),
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const tasksByStatus = {
    TODO: filteredTasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: filteredTasks.filter((t) => t.status === "IN_PROGRESS"),
    IN_REVIEW: filteredTasks.filter((t) => t.status === "IN_REVIEW"),
    COMPLETED: filteredTasks.filter((t) => t.status === "COMPLETED"),
  };

  if (!session) {
    return (
      <div key={index} className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view tasks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <Button onClick={() => setIsCreating(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <div className="border rounded-lg p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* Tasks View */}
      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* To Do Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">To Do</h3>
                <span className="text-sm text-muted-foreground">
                  {tasksByStatus.TODO.length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus.TODO.map((task) => (
                  <TaskCard key={index}
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">In Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {tasksByStatus.IN_PROGRESS.length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus.IN_PROGRESS.map((task) => (
                  <TaskCard key={index}
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* In Review Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">In Review</h3>
                <span className="text-sm text-muted-foreground">
                  {tasksByStatus.IN_REVIEW.length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus.IN_REVIEW.map((task) => (
                  <TaskCard key={index}
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Completed</h3>
                <span className="text-sm text-muted-foreground">
                  {tasksByStatus.COMPLETED.length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus.COMPLETED.map((task) => (
                  <TaskCard key={index}
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard key={index}
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
