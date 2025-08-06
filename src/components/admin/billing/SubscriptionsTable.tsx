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
  CreditCard,
  Receipt,
  XCircle,
  RefreshCw,
  Edit,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  plan: string;
  amount: number;
  status: "active" | "past_due" | "canceled" | "trialing";
  nextBilling: Date;
  createdAt: Date;
  paymentMethod: string;
}

export default function SubscriptionsTable() {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "sub_1",
      customer: { name: "John Doe", email: "john@acme.com" },
      plan: "Pro Monthly",
      amount: 99,
      status: "active",
      nextBilling: new Date("2024-02-15"),
      createdAt: new Date("2023-08-15"),
      paymentMethod: "•••• 4242",
    },
    {
      id: "sub_2",
      customer: { name: "Jane Smith", email: "jane@techstartup.com" },
      plan: "Starter Monthly",
      amount: 49,
      status: "trialing",
      nextBilling: new Date("2024-02-01"),
      createdAt: new Date("2024-01-15"),
      paymentMethod: "•••• 5555",
    },
    {
      id: "sub_3",
      customer: { name: "Bob Wilson", email: "bob@enterprise.com" },
      plan: "Enterprise Annual",
      amount: 4999,
      status: "past_due",
      nextBilling: new Date("2024-01-20"),
      createdAt: new Date("2023-01-20"),
      paymentMethod: "•••• 1234",
    },
  ]);

  const getStatusBadge = (status: Subscription["status"]) => {
    const variants = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      past_due: { label: "Past Due", className: "bg-red-100 text-red-800" },
      canceled: { label: "Canceled", className: "bg-gray-100 text-gray-800" },
      trialing: { label: "Trialing", className: "bg-blue-100 text-blue-800" },
    };

    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Billing</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{subscription.customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {subscription.customer.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{subscription.plan}</p>
                  <p className="text-xs text-gray-500">{subscription.id}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${subscription.amount.toFixed(2)}
                  <span className="text-gray-500 text-sm">
                    /{subscription.plan.includes("Annual") ? "year" : "month"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(subscription.status)}</TableCell>
              <TableCell>
                {format(subscription.nextBilling, "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{subscription.paymentMethod}</span>
                </div>
              </TableCell>
              <TableCell>
                {format(subscription.createdAt, "MMM dd, yyyy")}
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
                      <Receipt className="mr-2 h-4 w-4" />
                      View Invoices
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Add Credit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Payment
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Subscription
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
