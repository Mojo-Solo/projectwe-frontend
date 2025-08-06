"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Archive,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Financial audit completed",
      message: "Q4 2023 financial statements have been reviewed and approved.",
      time: "5 minutes ago",
      read: false,
      category: "document",
    },
    {
      id: 2,
      type: "warning",
      title: "Action required: Legal review",
      message:
        "3 contracts require your review before proceeding with buyer discussions.",
      time: "1 hour ago",
      read: false,
      category: "task",
    },
    {
      id: 3,
      type: "info",
      title: "New buyer interest",
      message:
        "Strategic Corp has expressed interest in your business. View details.",
      time: "3 hours ago",
      read: false,
      category: "buyer",
    },
    {
      id: 4,
      type: "success",
      title: "Valuation updated",
      message:
        "Your business valuation has increased by 5.2% based on latest metrics.",
      time: "1 day ago",
      read: true,
      category: "valuation",
    },
    {
      id: 5,
      type: "info",
      title: "Team member joined",
      message:
        "Alex Thompson has accepted the invitation to join your exit planning team.",
      time: "2 days ago",
      read: true,
      category: "team",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const archiveNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filterNotifications = (category?: string) => {
    if (!category || category === "all") return notifications;
    return notifications.filter((n) => n.category === category);
  };

  return (
    <>
      {/* Floating Notification Button */}
      <motion key={index}.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="relative rounded-full h-14 w-14 shadow-lg"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Notifications</SheetTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all as read
                  </Button>
                )}
              </div>
              <SheetDescription>
                Stay updated with your exit planning progress
              </SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="document">Docs</TabsTrigger>
                <TabsTrigger value="task">Tasks</TabsTrigger>
                <TabsTrigger value="buyer">Buyers</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <NotificationList
                  notifications={filterNotifications("all")}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  getIcon={getNotificationIcon}
                />
              </TabsContent>

              <TabsContent value="document" className="mt-4">
                <NotificationList
                  notifications={filterNotifications("document")}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  getIcon={getNotificationIcon}
                />
              </TabsContent>

              <TabsContent value="task" className="mt-4">
                <NotificationList
                  notifications={filterNotifications("task")}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  getIcon={getNotificationIcon}
                />
              </TabsContent>

              <TabsContent value="buyer" className="mt-4">
                <NotificationList
                  notifications={filterNotifications("buyer")}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  getIcon={getNotificationIcon}
                />
              </TabsContent>

              <TabsContent value="team" className="mt-4">
                <NotificationList
                  notifications={filterNotifications("team")}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  getIcon={getNotificationIcon}
                />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
}

interface NotificationListProps {
  notifications: any[];
  onMarkAsRead: (id: number) => void;
  onArchive: (id: number) => void;
  getIcon: (type: string) => React.ReactNode;
}

function NotificationList({
  notifications,
  onMarkAsRead,
  onArchive,
  getIcon,
}: NotificationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <AnimatePresence>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <motion key={index}.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  !notification.read && "bg-accent/50",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onArchive(notification.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
