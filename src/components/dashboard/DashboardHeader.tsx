"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  Settings,
  Bell,
  Moon,
  Sun,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";

interface DashboardHeaderProps {
  userRole: "owner" | "advisor" | "team";
  onRoleChange: (role: "owner" | "advisor" | "team") => void;
  onExport: () => void;
  onShare: () => void;
  onCustomize: () => void;
}

export function DashboardHeader({
  userRole,
  onRoleChange,
  onExport,
  onShare,
  onCustomize,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  const userData = {
    name: "David Kim",
    email: "david@techcorp.com",
    company: "TechCorp Solutions",
    avatar: "/avatars/david.jpg",
    initials: "DK",
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">
                  Exit Planning Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getGreeting()}, {userData.name}
                </p>
              </div>
            </div>

            {/* Role Selector */}
            <Select
              value={userRole}
              onValueChange={(value: any) => onRoleChange(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner View</SelectItem>
                <SelectItem value="advisor">Advisor View</SelectItem>
                <SelectItem value="team">Team View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Center Section - Company Info */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {userData.company}
            </Badge>
            <Badge className="bg-green-100 text-green-700 px-3 py-1">
              Exit Target: Q3 2024
            </Badge>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* Export */}
            <Button variant="ghost" size="icon" onClick={onExport}>
              <Download className="h-5 w-5" />
            </Button>

            {/* Share */}
            <Button variant="ghost" size="icon" onClick={onShare}>
              <Share2 className="h-5 w-5" />
            </Button>

            {/* Customize */}
            <Button variant="ghost" size="icon" onClick={onCustomize}>
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Avatar */}
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
