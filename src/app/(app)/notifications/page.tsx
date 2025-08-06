"use client";
export const dynamic = "force-dynamic";

interface NotificationsPageProps {
  className?: string;
  children?: React.ReactNode;
}

import React, { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  BellOff,
  CheckCheck,
  Filter,
  Search,
  Settings,
  TrendingUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch notifications with filters
  useEffect(() => {
    const filters: any = {};

    if (activeTab === "unread") {
      filters.unread_only = true;
    }

    if (priorityFilter !== "all") {
      filters.priority = priorityFilter;
    }

    if (typeFilter !== "all") {
      filters.types = [typeFilter];
    }

    fetchNotifications(filters);
  }, [activeTab, priorityFilter, typeFilter, fetchNotifications]);

  // Filter notifications based on search
  const filteredNotifications = notifications.filter((group) => {
    if (!searchQuery) return true;

    return group.notifications.some((n) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        n.data.title?.toLowerCase().includes(searchLower) ||
        n.data.message?.toLowerCase().includes(searchLower) ||
        n.data.formatted_message?.toLowerCase().includes(searchLower)
      );
    });
  });

  // Get statistics
  const stats = {
    total: notifications.reduce((acc, group) => acc + group.count, 0),
    unread: unreadCount,
    critical: notifications.reduce(
      (acc, group) =>
        acc +
        group.notifications.filter((n) => n.priority === "critical").length,
      0,
    ),
    high: notifications.reduce(
      (acc, group) =>
        acc + group.notifications.filter((n) => n.priority === "high").length,
      0,
    ),
  };

  const handleSettingsClick = () => {
    router.push("/settings/notifications");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your latest activities and alerts
          </p>
        </div>
        <Button variant="outline" onClick={handleSettingsClick}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.high}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="task.assigned">Task Assigned</SelectItem>
                  <SelectItem value="task.completed">Task Completed</SelectItem>
                  <SelectItem value="document.shared">
                    Document Shared
                  </SelectItem>
                  <SelectItem value="document.commented">
                    Document Commented
                  </SelectItem>
                  <SelectItem value="ai.completed">AI Completed</SelectItem>
                  <SelectItem value="milestone.achieved">
                    Milestone Achieved
                  </SelectItem>
                  <SelectItem value="system.alert">System Alert</SelectItem>
                  <SelectItem value="team.mention">Team Mention</SelectItem>
                  <SelectItem value="deadline.reminder">
                    Deadline Reminder
                  </SelectItem>
                  <SelectItem value="market.alert">Market Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Notifications</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <ScrollArea className="h-[600px]">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">
                          No notifications found
                        </h3>
                        <p className="text-muted-foreground">
                          {searchQuery
                            ? "Try adjusting your search or filters"
                            : activeTab === "unread"
                              ? "You're all caught up!"
                              : "No notifications to display"}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((group) => (
                        <Card key={group.group_id}>
                          <CardContent className="p-0">
                            {group.count === 1 ? (
                              <NotificationItem
                                notification={group.notifications[0]}
                              />
                            ) : (
                              <div>
                                <div className="p-4 border-b">
                                  <Badge variant="secondary">
                                    {group.count} related notifications
                                  </Badge>
                                </div>
                                <div className="divide-y">
                                  {group.notifications.map(
                                    (notification, index) => (
                                      <NotificationItem
                                        key={notification.id || index}
                                        notification={notification}
                                      />
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
