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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Download,
  User,
  Shield,
  Edit,
  Trash,
  Eye,
  Key,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";

interface AuditEvent {
  id: string;
  timestamp: Date;
  admin: {
    name: string;
    email: string;
  };
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: "low" | "medium" | "high" | "critical";
}

const actionIcons: Record<string, any> = {
  "user.view": Eye,
  "user.edit": Edit,
  "user.delete": Trash,
  "user.impersonate": User,
  "security.update": Shield,
  "password.reset": Key,
  "billing.refund": CreditCard,
};

export default function AuditTrailViewer() {
  const [events] = useState<AuditEvent[]>([
    {
      id: "1",
      timestamp: new Date("2024-01-29T10:30:00"),
      admin: { name: "Sarah Admin", email: "sarah@weexit.ai" },
      action: "user.impersonate",
      resource: "User",
      resourceId: "usr_123",
      details:
        "Impersonated user john.doe@example.com for support ticket #1234",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0",
      severity: "high",
    },
    {
      id: "2",
      timestamp: new Date("2024-01-29T09:15:00"),
      admin: { name: "Mike Support", email: "mike@weexit.ai" },
      action: "password.reset",
      resource: "User",
      resourceId: "usr_456",
      details: "Reset password for jane.smith@example.com",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox/121.0",
      severity: "medium",
    },
    {
      id: "3",
      timestamp: new Date("2024-01-29T08:45:00"),
      admin: { name: "Sarah Admin", email: "sarah@weexit.ai" },
      action: "billing.refund",
      resource: "Subscription",
      resourceId: "sub_789",
      details: "Issued refund of $99.00 for subscription",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0",
      severity: "high",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const getSeverityBadge = (severity: AuditEvent["severity"]) => {
    const variants = {
      low: { label: "Low", className: "bg-gray-100 text-gray-800" },
      medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "High", className: "bg-orange-100 text-orange-800" },
      critical: { label: "Critical", className: "bg-red-100 text-red-800" },
    };

    const variant = variants[severity];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getActionIcon = (action: string) => {
    const Icon = actionIcons[action] || Shield;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by admin, action, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user">User Actions</SelectItem>
                <SelectItem value="billing">Billing Actions</SelectItem>
                <SelectItem value="security">Security Actions</SelectItem>
                <SelectItem value="content">Content Actions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="whitespace-nowrap">
                  {format(event.timestamp, "MMM dd, yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{event.admin.name}</p>
                    <p className="text-sm text-gray-500">{event.admin.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(event.action)}
                    <span>{event.action.replace(".", " ").toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{event.resource}</p>
                    <p className="text-sm text-gray-500">{event.resourceId}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate">{event.details}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{event.ipAddress}</p>
                    <p className="text-xs text-gray-500">{event.userAgent}</p>
                  </div>
                </TableCell>
                <TableCell>{getSeverityBadge(event.severity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
