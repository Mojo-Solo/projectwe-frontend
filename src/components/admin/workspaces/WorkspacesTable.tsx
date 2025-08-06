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
import {
  MoreHorizontal,
  Building2,
  Users,
  HardDrive,
  Activity,
  Trash,
  Settings,
} from "lucide-react";
import { format } from "date-fns";

interface Workspace {
  id: string;
  name: string;
  owner: {
    name: string;
    email: string;
  };
  plan: "free" | "starter" | "pro" | "enterprise";
  status: "active" | "trial" | "suspended" | "archived";
  users: number;
  storage: string;
  documents: number;
  lastActivity: Date;
  createdAt: Date;
}

interface WorkspacesTableProps {
  filter?: string;
}

export default function WorkspacesTable({ filter }: WorkspacesTableProps) {
  const [workspaces] = useState<Workspace[]>([
    {
      id: "ws_1",
      name: "Acme Corp Exit Planning",
      owner: { name: "John Doe", email: "john@acme.com" },
      plan: "pro",
      status: "active",
      users: 12,
      storage: "4.2 GB",
      documents: 234,
      lastActivity: new Date("2024-01-29"),
      createdAt: new Date("2023-08-15"),
    },
    {
      id: "ws_2",
      name: "Tech Startup Strategy",
      owner: { name: "Jane Smith", email: "jane@techstartup.com" },
      plan: "starter",
      status: "trial",
      users: 3,
      storage: "1.1 GB",
      documents: 45,
      lastActivity: new Date("2024-01-28"),
      createdAt: new Date("2024-01-15"),
    },
  ]);

  const getStatusBadge = (status: Workspace["status"]) => {
    const variants = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      trial: { label: "Trial", className: "bg-blue-100 text-blue-800" },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800" },
      archived: { label: "Archived", className: "bg-gray-100 text-gray-800" },
    };

    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getPlanBadge = (plan: Workspace["plan"]) => {
    const variants = {
      free: { label: "Free", className: "border-gray-300" },
      starter: { label: "Starter", className: "border-blue-300" },
      pro: { label: "Pro", className: "border-purple-300" },
      enterprise: { label: "Enterprise", className: "border-orange-300" },
    };

    const variant = variants[plan];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const filteredWorkspaces = filter
    ? workspaces.filter((ws) => ws.status === filter)
    : workspaces;

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Storage</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkspaces.map((workspace) => (
            <TableRow key={workspace.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{workspace.name}</p>
                    <p className="text-xs text-gray-500">{workspace.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{workspace.owner.name}</p>
                  <p className="text-sm text-gray-500">
                    {workspace.owner.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>{getPlanBadge(workspace.plan)}</TableCell>
              <TableCell>{getStatusBadge(workspace.status)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{workspace.users}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span>{workspace.storage}</span>
                </div>
              </TableCell>
              <TableCell>{workspace.documents}</TableCell>
              <TableCell>
                {format(workspace.lastActivity, "MMM dd, yyyy")}
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
                      <Building2 className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="mr-2 h-4 w-4" />
                      View Activity
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Workspace
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
