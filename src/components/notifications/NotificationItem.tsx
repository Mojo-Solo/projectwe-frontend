"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckSquare,
  CheckCircle,
  FileText,
  MessageSquare,
  Bot,
  Trophy,
  AlertTriangle,
  AtSign,
  Clock,
  TrendingUp,
  Bell,
  MoreHorizontal,
  Circle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: any;
  compact?: boolean;
  onClose?: () => void;
}

const iconMap: Record<string, any> = {
  CheckSquare,
  CheckCircle,
  FileText,
  MessageSquare,
  Bot,
  Trophy,
  AlertTriangle,
  AtSign,
  Clock,
  TrendingUp,
  Bell,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  compact = false,
  onClose,
}) => {
  const router = useRouter();
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    // Mark as read if unread
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    // Navigate if there's a URL in the data
    if (notification.data.url) {
      router.push(notification.data.url);
      onClose?.();
    }
  };

  const handleAction = async (action: any) => {
    // Handle notification action
    if (action.action === "navigate" && action.url) {
      router.push(action.url);
      onClose?.();
    } else if (action.action === "external" && action.url) {
      window.open(action.url, "_blank");
    }
    // You can add more action handlers here
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  const Icon = iconMap[notification.data.icon || "Bell"] || Bell;
  const isUnread = !notification.read_at;

  const priorityColors = {
    low: "text-gray-500",
    medium: "text-blue-500",
    high: "text-orange-500",
    critical: "text-red-500",
  };

  const priorityBgColors = {
    low: "bg-gray-50",
    medium: "bg-blue-50",
    high: "bg-orange-50",
    critical: "bg-red-50",
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-accent",
          isUnread && "bg-accent/50",
        )}
        onClick={handleClick}
      >
        <div className="relative">
          <Icon
            className={cn("h-4 w-4", priorityColors[notification.priority])}
          />
          {isUnread && (
            <Circle className="h-2 w-2 fill-current text-blue-500 absolute -top-0.5 -right-0.5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm truncate", isUnread && "font-medium")}>
            {notification.data.formatted_message || notification.data.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors group",
        "hover:bg-accent",
        isUnread && "bg-accent/30",
        priorityBgColors[notification.priority],
      )}
      onClick={handleClick}
    >
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            "bg-background border",
          )}
        >
          <Icon
            className={cn("h-5 w-5", priorityColors[notification.priority])}
          />
        </div>
        {isUnread && (
          <Circle className="h-3 w-3 fill-current text-blue-500 absolute -top-0.5 -right-0.5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={cn("text-sm", isUnread && "font-semibold")}>
              {notification.data.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {notification.data.formatted_message || notification.data.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
              })}
            </p>

            {notification.is_actionable && notification.actions && (
              <div className="flex gap-2 mt-2">
                {notification.actions.map((action: any, index: number) => (
                  <Button key={index}
                    size="sm"
                    variant={action.style === "primary" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action);
                    }}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.read_at && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Mark as read
                </DropdownMenuItem>
              )}
              {notification.data.url && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
