"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCheckout } from "@/hooks/use-billing";
import { PLANS } from "@/types/billing";
import { formatCurrency, calculateAnnualSavings } from "@/lib/stripe/client";
import type { SubscriptionPlan, BillingInterval } from "@/types/billing";

interface PricingCardsProps {
  currentPlan?: SubscriptionPlan;
  onPlanSelect?: (plan: SubscriptionPlan, interval: BillingInterval) => void;
}

export function PricingCards({ currentPlan, onPlanSelect }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");
  const { createCheckoutSession, loading } = useCheckout();

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan, billingInterval);
    } else {
      await createCheckoutSession(plan, billingInterval);
    }
  };

  const plans = Object.values(PLANS).filter((plan) => plan.id !== "custom");

  return (
    <div className="space-y-8">
      {/* Billing interval toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-interval" className="text-base">
          Monthly
        </Label>
        <Switch
          id="billing-interval"
          checked={billingInterval === "annual"}
          onCheckedChange={(checked) =>
            setBillingInterval(checked ? "annual" : "monthly")
          }
        />
        <Label htmlFor="billing-interval" className="text-base">
          Annual
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const price =
            billingInterval === "monthly"
              ? plan.monthlyPrice
              : plan.annualPrice / 12; // Show monthly price for annual billing

          const isCurrentPlan = currentPlan === plan.id;
          const savings =
            billingInterval === "annual"
              ? calculateAnnualSavings(plan.monthlyPrice)
              : 0;

          return (
            <Card key={index}
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-6 rotate-45 bg-primary px-12 py-1 text-center text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {formatCurrency(price * 100)}
                    </span>
                    <span className="ml-2 text-muted-foreground">/month</span>
                  </div>
                  {billingInterval === "annual" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(plan.annualPrice * 100)} billed annually
                    </p>
                  )}
                  {savings > 0 && (
                    <p className="mt-1 text-sm font-medium text-green-600">
                      Save {formatCurrency(savings * 100)} per year
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Workspaces</span>
                    <span className="font-medium">
                      {plan.limits.workspaces === -1
                        ? "Unlimited"
                        : plan.limits.workspaces}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Users</span>
                    <span className="font-medium">
                      {plan.limits.users === -1
                        ? "Unlimited"
                        : plan.limits.users}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>AI Tokens/mo</span>
                    <span className="font-medium">
                      {plan.limits.aiTokensPerMonth === -1
                        ? "Unlimited"
                        : `${(plan.limits.aiTokensPerMonth / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-medium">
                      {plan.limits.documentStorageGB === -1
                        ? "Unlimited"
                        : `${plan.limits.documentStorageGB}GB`}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={loading || isCurrentPlan}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : `Get Started with ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Custom plan CTA */}
      <Card className="mx-auto max-w-2xl border-dashed">
        <CardHeader className="text-center">
          <CardTitle>Need a Custom Solution?</CardTitle>
          <CardDescription>
            For organizations with unique requirements or needing more than 50
            users
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
