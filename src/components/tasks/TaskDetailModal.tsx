"use client";

import React, { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Clock,
  Flag,
  Paperclip,
  MessageSquare,
  Users,
  Activity,
  CheckSquare,
  X,
  Edit3,
  Trash2,
  Archive,
  Play,
  Pause,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Task,
  TaskComment,
  TaskActivity,
  UpdateTaskRequest,
} from "@/types/task";
import TaskCommentSection from "./TaskCommentSection";
import TaskActivityFeed from "./TaskActivityFeed";
import TaskChecklist from "./TaskChecklist";
import TaskTimeTracker from "./TaskTimeTracker";

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: UpdateTaskRequest) => Promise<void>;
}

export default function TaskDetailModal({
  task,
  open,
  onOpenChange,
  onUpdate,
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(
    task.description || "",
  );
  const [activeTab, setActiveTab] = useState("comments");

  const priorityConfig = {
    critical: {
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: Flag,
    },
    high: {
      label: "High",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      icon: Flag,
    },
    medium: {
      label: "Medium",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      icon: Flag,
    },
    low: {
      label: "Low",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: Flag,
    },
  };

  const handleSaveEdit = async () => {
    await onUpdate({
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handlePriorityChange = async (priority: Task["priority"]) => {
    await onUpdate({ priority });
  };

  const handleChecklistUpdate = async (checklist: Task["checklist"]) => {
    await onUpdate({ checklist });
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed_at;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-lg font-semibold"
                      />
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Add description..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedTitle(task.title);
                            setEditedDescription(task.description || "");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <DialogTitle className="text-xl pr-8">
                        {task.title}
                      </DialogTitle>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Task Metadata */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                {/* Priority */}
                <Select
                  value={task.priority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([value, config]) => (
                      <SelectItem key={config]} key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <config.icon
                            className={cn("h-3 w-3", config.color)}
                          />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Assign
                    </Button>
                  )}
                </div>

                {/* Due Date */}
                {task.due_date && (
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      isOverdue && "text-red-500",
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(task.due_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}

                {/* Time Tracked */}
                {task.total_tracked_time !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {Math.round(task.total_tracked_time / 60)}h tracked
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Progress */}
              {task.progress !== undefined && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>
              )}
            </DialogHeader>

            <Separator />

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none border-b px-6">
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                  {task.comments && task.comments.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {task.comments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="checklist" className="gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Checklist
                  {task.checklist_total > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {task.checklist_completed}/{task.checklist_total}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="attachments" className="gap-2">
                  <Paperclip className="h-4 w-4" />
                  Files
                  {task.attachments && task.attachments.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {task.attachments.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="comments" className="p-6 m-0">
                  <TaskCommentSection
                    taskId={task.id}
                    comments={task.comments || []}
                    onCommentAdd={async (comment) => {
                      // Handle comment addition
                    }}
                  />
                </TabsContent>

                <TabsContent value="activity" className="p-6 m-0">
                  <TaskActivityFeed activities={task.activities || []} />
                </TabsContent>

                <TabsContent value="checklist" className="p-6 m-0">
                  <TaskChecklist
                    checklist={task.checklist || []}
                    onChange={handleChecklistUpdate}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="p-6 m-0">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attachment
                    </Button>
                    {task.attachments?.map((attachment) => (
                      <div key={index}
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {attachment.file_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.human_file_size} • Uploaded{" "}
                              {formatDistanceToNow(
                                new Date(attachment.created_at),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-muted/50 p-6 space-y-6">
            {/* Time Tracking */}
            <TaskTimeTracker
              taskId={task.id}
              timeEntries={task.time_entries || []}
              onTimeLog={async (entry) => {
                // Handle time logging
              }}
            />

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </div>

            <Separator />

            {/* Task Details */}
            <div className="space-y-3 text-sm">
              <h3 className="font-medium mb-3">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {formatDistanceToNow(new Date(task.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {formatDistanceToNow(new Date(task.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {task.estimated_hours && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimate</span>
                    <span>{task.estimated_hours}h</span>
                  </div>
                )}
                {task.actual_hours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual</span>
                    <span>{task.actual_hours}h</span>
                  </div>
                )}
              </div>
            </div>

            {/* Collaborators */}
            {task.collaborators && task.collaborators.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Collaborators</h3>
                  <div className="space-y-2">
                    {task.collaborators.map((collaborator) => (
                      <div key={index}
                        key={collaborator.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={collaborator.user?.avatar} />
                            <AvatarFallback>
                              {collaborator.user?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {collaborator.user?.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {collaborator.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
