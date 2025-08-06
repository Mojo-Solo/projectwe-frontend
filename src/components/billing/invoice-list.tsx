"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Download, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/stripe/client";
import type { Invoice } from "@/types/billing";

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/billing/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoice: Invoice) => {
    if (!invoice.downloadUrl) return;

    setDownloading(invoice.id);
    try {
      window.open(invoice.downloadUrl, "_blank");
    } finally {
      setDownloading(null);
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "open":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "void":
      case "uncollectible":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants: Record<
      Invoice["status"],
      "default" | "secondary" | "destructive" | "outline"
    > = {
      paid: "default",
      open: "secondary",
      draft: "outline",
      void: "destructive",
      uncollectible: "destructive",
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <InvoiceListSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invoices found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invoice.status)}
                      <span className="font-medium">{invoice.number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(invoice.periodStart), "MMM d")} -{" "}
                    {format(new Date(invoice.periodEnd), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.downloadUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(invoice)}
                        disabled={downloading === invoice.id}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function InvoiceListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
