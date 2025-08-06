"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const roles = [
  {
    id: "advisor",
    label: "Exit Planning Advisor",
    description: "Manage multiple clients",
    icon: Briefcase,
    color: "text-blue-600",
    path: "/dashboard/advisor",
  },
  {
    id: "owner",
    label: "Business Owner",
    description: "View my exit journey",
    icon: Building2,
    color: "text-green-600",
    path: "/dashboard/owner",
  },
  {
    id: "team_member",
    label: "Team Member",
    description: "Complete assigned tasks",
    icon: Users,
    color: "text-purple-600",
    path: "/dashboard/team",
  },
  {
    id: "investor",
    label: "Investor",
    description: "Access data room",
    icon: TrendingUp,
    color: "text-orange-600",
    path: "/dashboard/investor",
  },
];

export function RoleSwitcher() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState("advisor");

  const handleRoleSwitch = (roleId: string, path: string) => {
    setCurrentRole(roleId);
    router.push(path);
  };

  const current = roles.find((r) => r.id === currentRole);
  const Icon = current?.icon || Briefcase;

  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED !== "true"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="shadow-lg">
            <Icon className={`h-4 w-4 mr-2 ${current?.color}`} />
            <span className="hidden sm:inline">{current?.label}</span>
            <span className="sm:hidden">Role</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            Switch Dashboard View
            <Badge variant="secondary" className="text-xs">
              Dev Only
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <DropdownMenuItem key={index}
                key={role.id}
                onClick={() => handleRoleSwitch(role.id, role.path)}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3 w-full">
                  <RoleIcon className={`h-5 w-5 mt-0.5 ${role.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {role.description}
                    </div>
                  </div>
                  {currentRole === role.id && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground">
              Use this switcher to preview different user experiences during
              development.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
