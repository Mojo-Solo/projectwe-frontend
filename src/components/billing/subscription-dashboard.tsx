"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CreditCard,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  useSubscription,
  useBillingPortal,
  useUsageMetrics,
} from "@/hooks/use-billing";
import { PLANS } from "@/types/billing";
import { formatCurrency } from "@/lib/stripe/client";
import { PricingCards } from "./pricing-cards";
import type { SubscriptionPlan, BillingInterval } from "@/types/billing";

export function SubscriptionDashboard() {
  const {
    subscription,
    fetchSubscription,
    updateSubscription,
    cancelSubscription,
    loading: subLoading,
  } = useSubscription();
  const { openBillingPortal, loading: portalLoading } = useBillingPortal();
  const { usage, fetchUsage, loading: usageLoading } = useUsageMetrics();
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchSubscription();
    fetchUsage();
  }, [fetchSubscription, fetchUsage]);

  const handlePlanChange = async (
    plan: SubscriptionPlan,
    interval: BillingInterval,
  ) => {
    await updateSubscription({ plan, billingInterval: interval });
    setShowUpgrade(false);
  };

  const handleCancelSubscription = async () => {
    if (
      window.confirm(
        "Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.",
      )
    ) {
      await cancelSubscription();
    }
  };

  if (subLoading || usageLoading) {
    return <SubscriptionDashboardSkeleton />;
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Subscription</AlertTitle>
          <AlertDescription>
            Choose a plan to get started with WE-Exit.ai
          </AlertDescription>
        </Alert>
        <PricingCards />
      </div>
    );
  }

  const plan = PLANS[subscription.plan];
  const statusColors = {
    active: "bg-green-500",
    trialing: "bg-blue-500",
    past_due: "bg-red-500",
    canceled: "bg-gray-500",
    incomplete: "bg-yellow-500",
    incomplete_expired: "bg-red-500",
  };

  const statusLabels = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past Due",
    canceled: "Canceled",
    incomplete: "Incomplete",
    incomplete_expired: "Expired",
  };

  return (
    <div className="space-y-6">
      {/* Subscription overview */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-semibold">{plan.name} Plan</h3>
                <Badge className={statusColors[subscription.status]}>
                  {statusLabels[subscription.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {subscription.billingInterval === "monthly"
                  ? "Monthly"
                  : "Annual"}{" "}
                billing
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowUpgrade(!showUpgrade)}
              >
                Change Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => openBillingPortal()}
                disabled={portalLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Current Period</p>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(subscription.currentPeriodStart),
                    "MMM d, yyyy",
                  )}{" "}
                  -{" "}
                  {format(
                    new Date(subscription.currentPeriodEnd),
                    "MMM d, yyyy",
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    subscription.billingInterval === "monthly"
                      ? plan.monthlyPrice * 100
                      : plan.annualPrice * 100,
                  )}
                  {subscription.billingInterval === "annual" && " per year"}
                </p>
              </div>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Ending</AlertTitle>
              <AlertDescription>
                Your subscription will end on{" "}
                {format(
                  new Date(subscription.currentPeriodEnd),
                  "MMMM d, yyyy",
                )}
                .
                <Button
                  variant="link"
                  className="h-auto p-0 text-destructive-foreground underline"
                  onClick={() =>
                    updateSubscription({
                      /* reactivate */
                    })
                  }
                >
                  Reactivate subscription
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {subscription.trialEnd &&
            new Date(subscription.trialEnd) > new Date() && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Trial Period</AlertTitle>
                <AlertDescription>
                  Your trial ends on{" "}
                  {format(new Date(subscription.trialEnd), "MMMM d, yyyy")}
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>

      {/* Usage metrics */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
            <CardDescription>
              Track your usage across different features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <UsageMetric
                label="Workspaces"
                current={usage.workspaces.current}
                limit={usage.workspaces.limit}
                unlimited={plan.limits.workspaces === -1}
              />
              <UsageMetric
                label="Users"
                current={usage.users.current}
                limit={usage.users.limit}
                unlimited={plan.limits.users === -1}
              />
              <UsageMetric
                label="AI Tokens"
                current={usage.aiTokens.used}
                limit={usage.aiTokens.limit}
                unlimited={plan.limits.aiTokensPerMonth === -1}
                suffix="tokens"
              />
              <UsageMetric
                label="Document Storage"
                current={usage.documentStorage.usedGB}
                limit={usage.documentStorage.limitGB}
                unlimited={plan.limits.documentStorageGB === -1}
                suffix="GB"
                decimals={1}
              />
            </div>

            {Object.values(usage).some(
              (metric) =>
                typeof metric === "object" &&
                "percentage" in metric &&
                metric.percentage > 80,
            ) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Approaching Limits</AlertTitle>
                <AlertDescription>
                  You&apos;re approaching some of your plan limits. Consider
                  upgrading for more capacity.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan upgrade section */}
      {showUpgrade && (
        <Card>
          <CardHeader>
            <CardTitle>Change Your Plan</CardTitle>
            <CardDescription>
              Upgrade or downgrade your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PricingCards
              currentPlan={subscription.plan}
              onPlanSelect={handlePlanChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Danger zone */}
      {!subscription.cancelAtPeriodEnd && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Cancel your subscription. This action can be reversed until the
              end of your billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UsageMetric({
  label,
  current,
  limit,
  unlimited = false,
  suffix = "",
  decimals = 0,
}: {
  label: string;
  current: number;
  limit: number;
  unlimited?: boolean;
  suffix?: string;
  decimals?: number;
}) {
  const percentage = unlimited ? 0 : (current / limit) * 100;
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current.toFixed(decimals)} {suffix}
          {!unlimited && ` / ${limit} ${suffix}`}
          {unlimited && " (Unlimited)"}
        </span>
      </div>
      {!unlimited && (
        <div className="space-y-1">
          <Progress
            value={percentage}
            className={`h-2 ${
              isAtLimit ? "bg-red-100" : isNearLimit ? "bg-yellow-100" : ""
            }`}
          />
          {isNearLimit && (
            <p
              className={`text-xs ${isAtLimit ? "text-red-600" : "text-yellow-600"}`}
            >
              {isAtLimit ? "Limit reached" : `${percentage.toFixed(0)}% used`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SubscriptionDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-x-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
