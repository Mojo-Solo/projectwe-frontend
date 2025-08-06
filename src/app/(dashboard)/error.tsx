
interface DashboardErrorProps {
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
import { AlertCircle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  const errorMessages: Record<
    string,
    { title: string; description: string; actions?: React.ReactNode }
  > = {
    AUTH_REQUIRED: {
      title: "Authentication Required",
      description: "Please log in to access your dashboard.",
      actions: (
        <Button onClick={() => router.push("/login")} className="w-full">
          Go to Login
        </Button>
      ),
    },
    PERMISSION_DENIED: {
      title: "Access Denied",
      description:
        "You don't have permission to view this page. Please contact your administrator.",
    },
    NOT_FOUND: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
    },
    DEFAULT: {
      title: "Something went wrong",
      description:
        "We encountered an unexpected error. Please try again or contact support if the issue persists.",
    },
  };

  // Determine which error message to show based on the error
  const getErrorInfo = () => {
    if (error.message?.includes("auth") || error.message?.includes("login")) {
      return errorMessages.AUTH_REQUIRED;
    }
    if (
      error.message?.includes("permission") ||
      error.message?.includes("forbidden")
    ) {
      return errorMessages.PERMISSION_DENIED;
    }
    if (
      error.message?.includes("not found") ||
      error.message?.includes("404")
    ) {
      return errorMessages.NOT_FOUND;
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
                {error.stack && "\n\nStack trace:\n" + error.stack}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {errorInfo.actions || (
            <>
              <Button onClick={reset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard Home
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
