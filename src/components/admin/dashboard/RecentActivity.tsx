"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, CreditCard, Shield, FileText, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: Date;
  type: "user" | "billing" | "security" | "content" | "settings";
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      admin: "Sarah Admin",
      action: "impersonated user",
      target: "john.doe@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "user",
    },
    {
      id: "2",
      admin: "Mike Support",
      action: "issued refund",
      target: "$99.00 to jane.smith@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "billing",
    },
    {
      id: "3",
      admin: "Sarah Admin",
      action: "updated feature flag",
      target: "ai_exit_generator",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: "content",
    },
    {
      id: "4",
      admin: "Alex Security",
      action: "added IP to allowlist",
      target: "192.168.1.100",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: "security",
    },
    {
      id: "5",
      admin: "Mike Support",
      action: "reset user password",
      target: "user@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      type: "user",
    },
  ];

  const getActivityIcon = (type: Activity["type"]) => {
    const icons = {
      user: User,
      billing: CreditCard,
      security: Shield,
      content: FileText,
      settings: Settings,
    };

    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getActivityColor = (type: Activity["type"]) => {
    const colors = {
      user: "bg-blue-100 text-blue-600",
      billing: "bg-green-100 text-green-600",
      security: "bg-red-100 text-red-600",
      content: "bg-purple-100 text-purple-600",
      settings: "bg-gray-100 text-gray-600",
    };

    return colors[type];
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{activity.admin}</span>{" "}
              <span className="text-gray-600">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
