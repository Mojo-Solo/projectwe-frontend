
interface ErrorProps {
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
import { AlertCircle, Home, RefreshCw, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  const errorMessages: Record<
    string,
    { title: string; description: string; icon?: React.ReactNode }
  > = {
    NETWORK_ERROR: {
      title: "Connection Problem",
      description:
        "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    },
    AUTH_ERROR: {
      title: "Authentication Error",
      description:
        "Your session may have expired. Please log in again to continue.",
    },
    PERMISSION_ERROR: {
      title: "Access Denied",
      description:
        "You don't have permission to access this resource. Please contact support if you believe this is an error.",
    },
    NOT_FOUND: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
    },
    SERVER_ERROR: {
      title: "Server Error",
      description:
        "Our servers encountered an unexpected error. We've been notified and are working on a fix.",
    },
    DEFAULT: {
      title: "Something went wrong",
      description:
        "We encountered an unexpected error. Please try again or contact support if the issue persists.",
    },
  };

  // Determine error type based on error message or code
  const getErrorInfo = () => {
    const errorMessage = error.message?.toLowerCase() || "";

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return errorMessages.NETWORK_ERROR;
    }
    if (
      errorMessage.includes("auth") ||
      errorMessage.includes("unauthorized")
    ) {
      return errorMessages.AUTH_ERROR;
    }
    if (
      errorMessage.includes("permission") ||
      errorMessage.includes("forbidden")
    ) {
      return errorMessages.PERMISSION_ERROR;
    }
    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return errorMessages.NOT_FOUND;
    }
    if (errorMessage.includes("500") || errorMessage.includes("server")) {
      return errorMessages.SERVER_ERROR;
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
          {error.digest && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              Error ID:{" "}
              <code className="font-mono text-xs">{error.digest}</code>
            </p>
          )}

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words text-xs overflow-auto max-h-64">
                {error.message}
                {error.stack && "\n\nStack trace:\n" + error.stack}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>

          <Button
            variant="ghost"
            onClick={() =>
              (window.location.href =
                "mailto:support@projectwe.com?subject=Error Report&body=Error ID: " +
                (error.digest || "Unknown"))
            }
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
