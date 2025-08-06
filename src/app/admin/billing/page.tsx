import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BillingMetrics from "@/components/admin/billing/BillingMetrics";
import SubscriptionsTable from "@/components/admin/billing/SubscriptionsTable";
import RefundsTable from "@/components/admin/billing/RefundsTable";
import CouponsManager from "@/components/admin/billing/CouponsManager";
import CustomPlansManager from "@/components/admin/billing/CustomPlansManager";
import { Download, Plus, CreditCard, Receipt } from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminBillingPage() {
  const metrics = {
    mrr: 458923,
    arr: 5507076,
    avgRevenuePerUser: 162,
    churnRate: 2.3,
    ltv: 4860,
    totalSubscriptions: 2841,
    trialConversions: 34.2,
    failedPayments: 23,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Billing Administration</h1>
          <p className="text-gray-600 mt-1">
            Manage subscriptions, payments, and revenue
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Revenue Report
          </Button>
          <Button>
            <Receipt className="mr-2 h-4 w-4" />
            Issue Manual Invoice
          </Button>
        </div>
      </div>

      {/* Billing Metrics */}
      <BillingMetrics metrics={metrics} />

      {/* Billing Management Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="plans">Custom Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>
                    Manage all platform subscriptions
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Subscription
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SubscriptionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Transactions table component - Coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Refunds & Credits</CardTitle>
                  <CardDescription>
                    Manage refunds and account credits
                  </CardDescription>
                </div>
                <Button size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Issue Refund
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RefundsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <CouponsManager />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <CustomPlansManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

