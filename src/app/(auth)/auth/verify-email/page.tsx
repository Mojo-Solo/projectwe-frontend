
interface VerifyEmailPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "resent"
  >("verifying");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const id = searchParams.get("id");
  const hash = searchParams.get("hash");
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // If we have verification parameters, verify the email
    if (id && hash && expires && signature) {
      verifyEmail();
    } else {
      // No parameters, just showing the resend page
      setStatus("error");
      setError("No verification link provided");
    }
  }, [id, hash, expires, signature]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Verification failed");
      }

      setStatus("success");

      // Refresh user data to update email_verified_at
      await refreshUser();

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setError(
        err.message || "Failed to verify email. The link may be expired.",
      );
    }
  };

  const resendVerification = async () => {
    setIsResending(true);
    setError("");

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

      setStatus("resent");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verifying your email
            </CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Email verified!
            </CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified. Redirecting to
              dashboard...
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === "resent") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verification email sent
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a new verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your inbox and click the verification link to verify
              your email address.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Return to Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStatus("error")}
              className="w-full"
            >
              Didn&apos;t receive the email?
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error or resend state
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Verification failed
          </CardTitle>
          <CardDescription className="text-center">
            {error || "The verification link is invalid or has expired"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && !user.email_verified_at && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Your email address ({user.email}) has not been verified yet.
              </p>
              <Button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full"
              >
                {isResending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend verification email
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
