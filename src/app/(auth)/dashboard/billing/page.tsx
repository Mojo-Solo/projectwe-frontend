
interface BillingPageProps {
  className?: string;
  children?: React.ReactNode;
}

import { Metadata } from "next";
import { SubscriptionDashboard } from "@/components/billing/subscription-dashboard";
import { UsageChart } from "@/components/billing/usage-chart";
import { InvoiceList } from "@/components/billing/invoice-list";
import { PaymentMethods } from "@/components/billing/payment-methods";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Billing & Subscription | WE-Exit.ai",
  description: "Manage your subscription, billing details, and usage",
};

export default function BillingPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription plan, payment methods, and monitor usage
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SubscriptionDashboard />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageChart />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceList />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  );
}
