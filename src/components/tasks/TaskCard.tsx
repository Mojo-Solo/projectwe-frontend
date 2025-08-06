"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckSquare,
  Paperclip,
  MessageSquare,
  Users,
  Flag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    critical: "text-red-500 bg-red-50 border-red-200",
    high: "text-orange-500 bg-orange-50 border-orange-200",
    medium: "text-yellow-500 bg-yellow-50 border-yellow-200",
    low: "text-blue-500 bg-blue-50 border-blue-200",
  };

  const priorityIcons = {
    critical: <Flag className="h-3 w-3" />,
    high: <AlertCircle className="h-3 w-3" />,
    medium: <Clock className="h-3 w-3" />,
    low: null,
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed_at;
  const dueDate = task.due_date ? new Date(task.due_date) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(attributes || {})}
      {...(listeners || {})}
      onClick={onClick}
      className={cn(
        "bg-background border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all",
        "select-none touch-none",
        isDragging || isSortableDragging ? "opacity-50 shadow-lg" : "",
        task.is_blocked && "border-red-200 bg-red-50/50",
        task.is_milestone && "border-purple-200 bg-purple-50/50",
      )}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority !== "medium" && (
          <div className={cn("p-1 rounded", priorityColors[task.priority])}>
            {priorityIcons[task.priority]}
          </div>
        )}
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      {task.progress !== undefined && task.progress > 0 && (
        <Progress value={task.progress} className="h-1 mb-2" />
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={index}
              key={tag}
              variant="secondary"
              className="text-xs px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Task Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {/* Due Date */}
          {dueDate && (
            <div
              className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-500",
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(dueDate, { addSuffix: true })}</span>
            </div>
          )}

          {/* Checklist Progress */}
          {task.checklist_total > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              <span>
                {task.checklist_completed}/{task.checklist_total}
              </span>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}

          {/* Comments */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-xs">
              {task.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Blocked Indicator */}
      {task.is_blocked && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span>Blocked</span>
        </div>
      )}
    </div>
  );
}
