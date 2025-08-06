"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  User,
  Flag,
  Calendar,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  GitBranch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskActivity } from "@/types/task";

interface TaskActivityFeedProps {
  activities: TaskActivity[];
}

export default function TaskActivityFeed({
  activities,
}: TaskActivityFeedProps) {
  const getActivityIcon = (action: string) => {
    const iconMap: Record<string, React.ElementType> = {
      created: CheckCircle,
      updated: Activity,
      status_changed: GitBranch,
      assigned: User,
      unassigned: User,
      commented: MessageSquare,
      attachment_added: Paperclip,
      attachment_removed: Paperclip,
      due_date_changed: Calendar,
      priority_changed: Flag,
      completed: CheckCircle,
      reopened: XCircle,
      archived: Archive,
      restored: Archive,
      time_logged: Clock,
    };

    return iconMap[action] || Activity;
  };

  const getActivityColor = (action: string) => {
    const colorMap: Record<string, string> = {
      created: "text-green-500 bg-green-50",
      completed: "text-green-500 bg-green-50",
      archived: "text-gray-500 bg-gray-50",
      priority_changed: "text-orange-500 bg-orange-50",
      due_date_changed: "text-blue-500 bg-blue-50",
      reopened: "text-red-500 bg-red-50",
    };

    return colorMap[action] || "text-gray-500 bg-gray-50";
  };

  const renderChanges = (activity: TaskActivity) => {
    if (
      !activity.formatted_changes ||
      activity.formatted_changes.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-2 space-y-1">
        {activity.formatted_changes.map((change, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            <span className="font-medium">{change.field}:</span>{" "}
            {change.from && (
              <>
                <span className="line-through">{change.from}</span>
                <span className="mx-1">→</span>
              </>
            )}
            <span>{change.to}</span>
          </div>
        ))}
      </div>
    );
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      {/* Activity items */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.action);
          const iconColor = getActivityColor(activity.action);

          return (
            <div key={activity.id} className="flex gap-3 relative">
              {/* Icon */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                  iconColor,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user?.avatar} />
                    <AvatarFallback>
                      {activity.user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {activity.user?.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activity.human_description || activity.action}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {/* Additional description */}
                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                )}

                {/* Changes */}
                {renderChanges(activity)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
