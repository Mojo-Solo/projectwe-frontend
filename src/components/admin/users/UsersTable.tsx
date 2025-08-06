"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  User,
  Shield,
  Ban,
  Key,
  Mail,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "trial" | "suspended" | "inactive";
  plan: "free" | "starter" | "pro" | "enterprise";
  workspaces: number;
  lastActive: Date;
  createdAt: Date;
  twoFactorEnabled: boolean;
}

interface UsersTableProps {
  filter?: string;
}

export default function UsersTable({ filter }: UsersTableProps) {
  // Mock data - replace with actual API call
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/avatars/01.png",
      status: "active",
      plan: "pro",
      workspaces: 3,
      lastActive: new Date("2024-01-28"),
      createdAt: new Date("2023-06-15"),
      twoFactorEnabled: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "trial",
      plan: "starter",
      workspaces: 1,
      lastActive: new Date("2024-01-29"),
      createdAt: new Date("2024-01-15"),
      twoFactorEnabled: false,
    },
    // Add more mock users...
  ]);

  const getStatusBadge = (status: User["status"]) => {
    const variants = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      trial: { label: "Trial", className: "bg-blue-100 text-blue-800" },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
    };

    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getPlanBadge = (plan: User["plan"]) => {
    const variants = {
      free: { label: "Free", className: "bg-gray-100 text-gray-800" },
      starter: { label: "Starter", className: "bg-blue-100 text-blue-800" },
      pro: { label: "Pro", className: "bg-purple-100 text-purple-800" },
      enterprise: {
        label: "Enterprise",
        className: "bg-orange-100 text-orange-800",
      },
    };

    const variant = variants[plan];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const filteredUsers = filter
    ? users.filter((user) => user.status === filter)
    : users;

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Workspaces</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>2FA</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div key={index}>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{getPlanBadge(user.plan)}</TableCell>
              <TableCell>{user.workspaces}</TableCell>
              <TableCell>{format(user.lastActive, "MMM dd, yyyy")}</TableCell>
              <TableCell>{format(user.createdAt, "MMM dd, yyyy")}</TableCell>
              <TableCell>
                {user.twoFactorEnabled ? (
                  <Shield className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="mr-2 h-4 w-4" />
                      View Activity
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Impersonate User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Reset 2FA
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
