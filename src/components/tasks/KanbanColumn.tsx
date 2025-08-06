"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BoardColumn, Task } from "@/types/task";

interface KanbanColumnProps {
  column: BoardColumn;
  tasks: Task[];
  taskCount: number;
  onCreateTask: () => void;
  children: React.ReactNode;
}

export default function KanbanColumn({
  column,
  tasks,
  taskCount,
  onCreateTask,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const isOverLimit = column.limit && taskCount > column.limit;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col bg-muted/50 rounded-lg p-3 w-80 min-h-[200px] transition-colors",
        isOver && "bg-muted/80 ring-2 ring-primary/20",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{column.name}</h3>
          <Badge
            variant={isOverLimit ? "destructive" : "secondary"}
            className="text-xs"
          >
            {taskCount}
            {column.limit && ` / ${column.limit}`}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Set WIP Limit</DropdownMenuItem>
              <DropdownMenuItem>Clear Column</DropdownMenuItem>
              <DropdownMenuItem>Column Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Column Color Indicator */}
      {column.color && (
        <div
          className="h-1 rounded-full mb-3"
          style={{ backgroundColor: column.color }}
        />
      )}

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto space-y-2">{children}</div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">No tasks</p>
        </div>
      )}

      {/* Add Task Button */}
      <Button
        variant="ghost"
        className="w-full mt-2 justify-start text-muted-foreground"
        onClick={onCreateTask}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add task
      </Button>
    </div>
  );
}
