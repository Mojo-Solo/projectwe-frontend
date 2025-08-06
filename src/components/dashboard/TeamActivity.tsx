"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CheckSquare,
  MessageSquare,
  Upload,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamActivityProps {
  detailed?: boolean;
}

export function TeamActivity({ detailed = false }: TeamActivityProps) {
  const activities = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        role: "CFO",
        avatar: "/avatars/sarah.jpg",
        initials: "SC",
      },
      action: "uploaded",
      target: "Q4 Financial Statements",
      type: "document",
      timestamp: "10 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Michael Rodriguez",
        role: "Legal Counsel",
        avatar: "/avatars/michael.jpg",
        initials: "MR",
      },
      action: "completed",
      target: "Contract Review - Vendor Agreement #12",
      type: "task",
      timestamp: "2 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Emily Johnson",
        role: "COO",
        avatar: "/avatars/emily.jpg",
        initials: "EJ",
      },
      action: "commented on",
      target: "Operational Efficiency Report",
      type: "comment",
      timestamp: "4 hours ago",
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        role: "CEO",
        avatar: "/avatars/david.jpg",
        initials: "DK",
      },
      action: "scheduled",
      target: "Buyer Meeting - Strategic Corp",
      type: "meeting",
      timestamp: "5 hours ago",
    },
    {
      id: 5,
      user: {
        name: "Alex Thompson",
        role: "VP Sales",
        avatar: "/avatars/alex.jpg",
        initials: "AT",
      },
      action: "updated",
      target: "Customer Retention Metrics",
      type: "document",
      timestamp: "1 day ago",
    },
  ];

  const teamMembers = [
    { name: "Sarah Chen", role: "CFO", status: "online", tasksCompleted: 12 },
    {
      name: "Michael Rodriguez",
      role: "Legal Counsel",
      status: "online",
      tasksCompleted: 8,
    },
    { name: "Emily Johnson", role: "COO", status: "away", tasksCompleted: 15 },
    { name: "David Kim", role: "CEO", status: "online", tasksCompleted: 6 },
    {
      name: "Alex Thompson",
      role: "VP Sales",
      status: "offline",
      tasksCompleted: 10,
    },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "task":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Team Activity
            </CardTitle>
          </div>
          <Badge variant="secondary">
            {teamMembers.filter((m) => m.status === "online").length} Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Activities */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </h4>
          <div className="space-y-3">
            {activities
              .slice(0, detailed ? activities.length : 3)
              .map((activity, index) => (
                <motion key={index}.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {activity.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {activity.action}
                      </span>
                      {getActionIcon(activity.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.target}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Team Members Grid */}
        {detailed && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Team Members
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamMembers.map((member, index) => (
                <motion key={index}.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div key={index}
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                          getStatusColor(member.status),
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {member.tasksCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">tasks done</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">51</p>
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">Docs Uploaded</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">94%</p>
            <p className="text-xs text-muted-foreground">On Schedule</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            View All Activity
          </Button>
          <Button className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Team Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
