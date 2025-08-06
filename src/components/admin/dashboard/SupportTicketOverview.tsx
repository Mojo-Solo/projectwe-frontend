
interface SupportTicketOverviewProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function SupportTicketOverview() {
  const tickets = [
    {
      id: "1234",
      title: "Cannot access workspace",
      priority: "high",
      status: "open",
      time: "2h ago",
    },
    {
      id: "1235",
      title: "Billing question",
      priority: "medium",
      status: "in_progress",
      time: "4h ago",
    },
    {
      id: "1236",
      title: "Feature request: Export to PDF",
      priority: "low",
      status: "open",
      time: "1d ago",
    },
  ];

  const stats = {
    open: 47,
    inProgress: 12,
    resolved: 23,
    avgResponseTime: "2.3h",
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const;

    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {priority}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Recent support activity</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.open}</p>
            <p className="text-xs text-gray-600">Open</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.inProgress}</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </p>
            <p className="text-xs text-gray-600">Resolved Today</p>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          {tickets.map((ticket) => (
            <div key={index}
              key={ticket.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  #{ticket.id}: {ticket.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{ticket.time}</span>
                </div>
              </div>
              {getPriorityBadge(ticket.priority)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
