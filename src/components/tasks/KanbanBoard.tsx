"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Plus, Settings, Archive, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskBoard, Task, BoardColumn } from "@/types/task";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskDetailModal from "./TaskDetailModal";
import { useToast } from "@/components/ui/use-toast";

interface KanbanBoardProps {
  board: TaskBoard;
  tasks: Task[];
  onTaskMove: (
    taskId: string,
    newStatus: string,
    newPosition: number,
  ) => Promise<void>;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskCreate: (task: Partial<Task>) => Promise<void>;
  onBoardUpdate: (updates: Partial<TaskBoard>) => Promise<void>;
  isLoading?: boolean;
}

export default function KanbanBoard({
  board,
  tasks,
  onTaskMove,
  onTaskUpdate,
  onTaskCreate,
  onBoardUpdate,
  isLoading = false,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<BoardColumn[]>(board.columns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Group tasks by status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  // Sort tasks by position within each column
  Object.keys(tasksByStatus).forEach((status) => {
    tasksByStatus[status].sort((a, b) => a.position - b.position);
  });

  // Filter tasks based on search
  const filteredTasksByStatus = Object.entries(tasksByStatus).reduce(
    (acc, [status, statusTasks]) => {
      const filtered = statusTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
      if (filtered.length > 0) {
        acc[status] = filtered;
      }
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask) return;

    // If dropping over a column (not a task)
    if (over.id.toString().startsWith("column-")) {
      const newStatus = over.id.toString().replace("column-", "");
      if (activeTask.status !== newStatus) {
        // Move to end of new column
        const columnTasks = tasksByStatus[newStatus] || [];
        const newPosition = columnTasks.length;
        onTaskMove(activeTask.id, newStatus, newPosition);
      }
    } else if (overTask && activeTask.status !== overTask.status) {
      // Moving to a different column over a task
      onTaskMove(activeTask.id, overTask.status, overTask.position);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask) return;

    try {
      if (over.id.toString().startsWith("column-")) {
        // Dropped on column
        const newStatus = over.id.toString().replace("column-", "");
        const columnTasks = tasksByStatus[newStatus] || [];
        const newPosition = columnTasks.length;

        if (
          activeTask.status !== newStatus ||
          activeTask.position !== newPosition
        ) {
          await onTaskMove(activeTask.id, newStatus, newPosition);
        }
      } else if (overTask) {
        // Dropped on task
        if (activeTask.status === overTask.status) {
          // Same column reorder
          const columnTasks = tasksByStatus[activeTask.status];
          const oldIndex = columnTasks.findIndex((t) => t.id === activeTask.id);
          const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);

          if (oldIndex !== newIndex) {
            await onTaskMove(activeTask.id, activeTask.status, newIndex);
          }
        } else {
          // Different column
          await onTaskMove(activeTask.id, overTask.status, overTask.position);
        }
      }
    } catch (error) {
      toast({
        title: "Error moving task",
        description: "Failed to update task position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = (status: string) => {
    setCreateTaskStatus(status);
    setIsCreateDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{board.name}</h2>
          {board.description && (
            <p className="text-sm text-muted-foreground">{board.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onBoardUpdate({ is_archived: true })}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 min-w-max h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            {columns.map((column) => {
              const columnTasks = filteredTasksByStatus[column.id] || [];
              const taskIds = columnTasks.map((t) => t.id);

              return (
                <KanbanColumn key={index}
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  taskCount={board.task_counts?.[column.id] || 0}
                  onCreateTask={() => handleCreateTask(column.id)}
                >
                  <SortableContext
                    items={taskIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {columnTasks.map((task) => (
                        <TaskCard key={index}
                          key={task.id}
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          isDragging={task.id === activeId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </KanbanColumn>
              );
            })}
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} isDragging />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        boardId={board.id}
        defaultStatus={createTaskStatus}
        columns={columns}
        onSubmit={async (taskData) => {
          await onTaskCreate(taskData);
          setIsCreateDialogOpen(false);
        }}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onUpdate={async (updates) => {
            await onTaskUpdate(selectedTask.id, updates);
            setSelectedTask({ ...selectedTask, ...updates });
          }}
        />
      )}
    </div>
  );
}
