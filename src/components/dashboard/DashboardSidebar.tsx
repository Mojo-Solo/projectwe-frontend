"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Briefcase,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Exit Planning",
    icon: Target,
    children: [
      {
        title: "Exit Readiness",
        href: "/dashboard/exit-readiness",
        icon: BarChart3,
        badge: "85%",
      },
      {
        title: "Valuation Tracker",
        href: "/dashboard/valuation",
        icon: TrendingUp,
      },
      {
        title: "Timeline & Milestones",
        href: "/dashboard/timeline",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Clients",
    icon: Briefcase,
    children: [
      {
        title: "All Clients",
        href: "/dashboard/clients",
        icon: Building2,
      },
      {
        title: "Client Brands",
        href: "/dashboard/theme-studio",
        icon: Palette,
        badge: "New",
      },
    ],
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    badge: "12",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "AI Insights",
    href: "/dashboard/insights",
    icon: Brain,
  },
  {
    title: "Agent Dashboard",
    href: "/agent-dashboard",
    icon: Brain,
    badge: "New",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([
    "Exit Planning",
    "Clients",
  ]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.includes(item.title);
    const active = isActive(item.href);

    if (hasChildren) {
      return (
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={() => toggleSection(item.title)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start hover:bg-accent/50",
                depth > 0 && "pl-8",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              <ChevronRight
                className={cn(
                  "ml-auto h-4 w-4 transition-transform",
                  isOpen && "rotate-90",
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children.map((child) => renderNavItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link key={item.title} href={item.href || "#"}>
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            active && "bg-accent",
            depth > 0 && "pl-8",
            "hover:bg-accent/50",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
          {item.badge && (
            <span
              className={cn(
                "ml-auto rounded-full px-2 py-0.5 text-xs",
                item.badge === "New"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {item.badge}
            </span>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className,
      )}
    >
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">ProjectWE®</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.slice(0, -2).map((item) => renderNavItem(item))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          {navItems.slice(-2).map((item) => renderNavItem(item))}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">DK</span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">David Kim</p>
            <p className="text-xs text-muted-foreground truncate">
              TechCorp Solutions
            </p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
