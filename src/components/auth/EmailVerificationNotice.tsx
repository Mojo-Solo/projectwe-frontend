"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EmailVerificationNoticeProps {
  onDismiss?: () => void;
  className?: string;
}

export default function EmailVerificationNotice({
  onDismiss,
  className,
}: EmailVerificationNoticeProps) {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Don't show if user is verified
  if (!user || user.email_verified_at) {
    return null;
  }

  const resendVerification = async () => {
    setIsResending(true);
    setError("");
    setShowSuccess(false);

    try {
      const response = await fetch(
        `${API_URL}/api/email/verification-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to resend verification email");
      }

      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  if (showSuccess) {
    return (
      <Alert className={className}>
        <Mail className="h-4 w-4" />
        <AlertTitle>Verification email sent!</AlertTitle>
        <AlertDescription>
          Please check your inbox and click the verification link to verify your
          email address.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={className} variant="warning">
      <Mail className="h-4 w-4" />
      <AlertTitle>Verify your email address</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Your email address ({user.email}) has not been verified yet. Please
          check your inbox for a verification email.
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resendVerification}
            disabled={isResending}
          >
            {isResending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Resend verification email
          </Button>
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
