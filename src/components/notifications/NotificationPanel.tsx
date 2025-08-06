"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Circle,
  Settings,
  Trash2,
  CheckCheck,
  Bell,
  BellOff,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationItem } from "./NotificationItem";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  onClose?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onClose,
}) => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleSettingsClick = () => {
    router.push("/settings/notifications");
    onClose?.();
  };

  const handleViewAll = () => {
    router.push("/notifications");
    onClose?.();
  };

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((group) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") {
      return group.notifications.some((n) => !n.read_at);
    }
    return false;
  });

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {unreadCount > 0 && (
          <CardDescription>
            You have {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="all" className="rounded-none">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-none">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {activeTab === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((group) => (
                    <div key={group.group_id}>
                      {group.count === 1 ? (
                        <NotificationItem
                          notification={group.notifications[0]}
                          onClose={onClose}
                        />
                      ) : (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {group.count} related notifications
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {group.notifications.map((notification) => (
                              <NotificationItem key={index}
                                key={notification.id}
                                notification={notification}
                                compact
                                onClose={onClose}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={handleViewAll}
          >
            View all notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
