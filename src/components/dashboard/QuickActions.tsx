"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  Calendar,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";

interface QuickActionsProps {
  userRole: "owner" | "advisor" | "team";
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = {
    owner: [
      {
        icon: Upload,
        label: "Upload Document",
        action: "upload-doc",
        primary: true,
      },
      { icon: Calendar, label: "Schedule Meeting", action: "schedule-meeting" },
      { icon: BarChart3, label: "Run Valuation", action: "run-valuation" },
      { icon: MessageSquare, label: "Ask AI", action: "ask-ai" },
      { icon: Users, label: "Invite Team", action: "invite-team" },
    ],
    advisor: [
      {
        icon: FileText,
        label: "Review Documents",
        action: "review-docs",
        primary: true,
      },
      { icon: Plus, label: "Add Task", action: "add-task" },
      { icon: Users, label: "Contact Buyer", action: "contact-buyer" },
      { icon: BarChart3, label: "Market Analysis", action: "market-analysis" },
      { icon: Settings, label: "Settings", action: "settings" },
    ],
    team: [
      {
        icon: Plus,
        label: "Create Task",
        action: "create-task",
        primary: true,
      },
      { icon: Upload, label: "Upload File", action: "upload-file" },
      { icon: MessageSquare, label: "Team Chat", action: "team-chat" },
      { icon: FileText, label: "View Tasks", action: "view-tasks" },
      { icon: Calendar, label: "Calendar", action: "calendar" },
    ],
  };

  const currentActions = actions[userRole] || actions.owner;

  const handleAction = (action: string) => {
    // Handle different actions based on the action type
    console.log(`Executing action: ${action}`);

    switch (action) {
      case "upload-doc":
      case "upload-file":
        // Open upload modal
        break;
      case "schedule-meeting":
        // Open calendar scheduler
        break;
      case "ask-ai":
        // Open AI chat interface
        break;
      case "run-valuation":
        // Navigate to valuation tool
        break;
      default:
        // Handle other actions
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-4">
        <Zap className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Quick Actions</span>
      </div>

      {currentActions.map((action, index) => (
        <motion key={index}.div
          key={action.action}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Button
            variant={action.primary ? "default" : "outline"}
            size="sm"
            onClick={() => handleAction(action.action)}
            className="flex items-center gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
