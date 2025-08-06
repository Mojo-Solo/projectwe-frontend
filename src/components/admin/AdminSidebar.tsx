"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  FileText,
  HeadphonesIcon,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AdminUser,
  hasPermission,
  ADMIN_PERMISSIONS,
} from "@/lib/admin/middleware";

interface AdminSidebarProps {
  user: AdminUser;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permission: ADMIN_PERMISSIONS.VIEW_USERS,
  },
  {
    name: "Workspaces",
    href: "/admin/workspaces",
    icon: Building2,
    permission: ADMIN_PERMISSIONS.VIEW_WORKSPACES,
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    permission: ADMIN_PERMISSIONS.VIEW_BILLING,
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    permission: ADMIN_PERMISSIONS.EDIT_CONTENT,
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: HeadphonesIcon,
    permission: ADMIN_PERMISSIONS.VIEW_SUPPORT,
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: Shield,
    permission: ADMIN_PERMISSIONS.VIEW_AUDIT_LOGS,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(
    (item) => !item.permission || hasPermission(user, item.permission),
  );

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">WE-Exit Admin</h1>
          <p className="text-sm text-gray-400 mt-1">
            {user.role.replace("_", " ").toUpperCase()}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={index}
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <Link
              href="/logout"
              className="ml-3 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
