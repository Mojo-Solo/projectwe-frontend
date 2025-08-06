"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PaymentMethod } from "@/types/billing";

// Card brand icons mapping
const cardBrandIcons: Record<string, string> = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  discover: "💳",
  diners: "💳",
  jcb: "💳",
  unionpay: "💳",
};

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/billing/payment-methods");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    // This would typically open a Stripe Elements modal or redirect to a payment method setup page
    try {
      const response = await fetch("/api/billing/payment-methods/setup", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to setup payment method:", error);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setSettingDefaultId(paymentMethodId);
    try {
      const response = await fetch(
        `/api/billing/payment-methods/${paymentMethodId}/default`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    try {
      const response = await fetch(
        `/api/billing/payment-methods/${paymentMethodId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setPaymentMethods((prev) =>
          prev.filter((pm) => pm.id !== paymentMethodId),
        );
      }
    } catch (error) {
      console.error("Failed to delete payment method:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <PaymentMethodsSkeleton />;
  }

  const defaultMethod = paymentMethods.find((pm) => pm.isDefault);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment methods for subscriptions
            </CardDescription>
          </div>
          <Button onClick={handleAddPaymentMethod} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payment methods added</p>
            <Button
              onClick={handleAddPaymentMethod}
              variant="outline"
              className="mt-4"
            >
              Add your first payment method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={index}
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {cardBrandIcons[method.card?.brand || ""] || "💳"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium capitalize">
                        {method.card?.brand || "Card"}
                      </span>
                      <span className="text-muted-foreground">
                        •••• {method.card?.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.card?.expMonth}/{method.card?.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={settingDefaultId === method.id}
                    >
                      {settingDefaultId === method.id ? (
                        "Setting..."
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Set as default
                        </>
                      )}
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={method.isDefault}
                        onClick={() => setDeletingId(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Payment Method
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this payment method?
                          This action cannot be undone.
                          {method.isDefault && (
                            <Alert className="mt-4">
                              <AlertDescription>
                                This is your default payment method. Please set
                                another payment method as default before
                                deleting this one.
                              </AlertDescription>
                            </Alert>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(method.id)}
                          disabled={method.isDefault}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentMethodsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
