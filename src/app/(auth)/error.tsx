
interface AuthErrorProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, LogIn, KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  const errorMessages: Record<
    string,
    { title: string; description: string; action?: React.ReactNode }
  > = {
    INVALID_CREDENTIALS: {
      title: "Invalid Credentials",
      description:
        "The email or password you entered is incorrect. Please try again.",
      action: (
        <Button onClick={() => router.push("/login")} className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      ),
    },
    SESSION_EXPIRED: {
      title: "Session Expired",
      description: "Your session has expired. Please log in again to continue.",
      action: (
        <Button onClick={() => router.push("/login")} className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Log In Again
        </Button>
      ),
    },
    EMAIL_NOT_VERIFIED: {
      title: "Email Not Verified",
      description:
        "Please verify your email address before logging in. Check your inbox for the verification link.",
      action: (
        <Button
          onClick={() => router.push("/auth/verify-email")}
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          Resend Verification
        </Button>
      ),
    },
    ACCOUNT_LOCKED: {
      title: "Account Locked",
      description:
        "Your account has been temporarily locked due to too many failed login attempts. Please try again later or reset your password.",
      action: (
        <Button
          onClick={() => router.push("/auth/forgot-password")}
          className="w-full"
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Reset Password
        </Button>
      ),
    },
    DEFAULT: {
      title: "Authentication Error",
      description:
        "We encountered an error during authentication. Please try again.",
    },
  };

  // Determine error type
  const getErrorInfo = () => {
    const errorMessage = error.message?.toLowerCase() || "";

    if (
      errorMessage.includes("invalid") ||
      errorMessage.includes("incorrect")
    ) {
      return errorMessages.INVALID_CREDENTIALS;
    }
    if (errorMessage.includes("session") || errorMessage.includes("expired")) {
      return errorMessages.SESSION_EXPIRED;
    }
    if (
      errorMessage.includes("verify") ||
      errorMessage.includes("verification")
    ) {
      return errorMessages.EMAIL_NOT_VERIFIED;
    }
    if (errorMessage.includes("locked") || errorMessage.includes("attempts")) {
      return errorMessages.ACCOUNT_LOCKED;
    }

    return errorMessages.DEFAULT;
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
          <CardDescription className="mt-2">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words text-xs">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {errorInfo.action || (
            <>
              <Button onClick={reset} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
