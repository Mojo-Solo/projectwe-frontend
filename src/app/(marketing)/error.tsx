
interface MarketingErrorProps {
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
import {
  AlertCircle,
  Home,
  ArrowLeft,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Marketing page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
          <CardDescription className="mt-2">
            We&apos;re having trouble loading this page. Don&apos;t worry,
            we&apos;re on it!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="bg-muted rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground text-center">
              While we fix this, you might want to explore our other resources
              or get in touch with our team.
            </p>
          </div>

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
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          <div className="flex gap-2 w-full mt-2">
            <Link href="/demo" className="flex-1">
              <Button variant="secondary" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Book Demo
              </Button>
            </Link>

            <Button
              variant="secondary"
              onClick={() => (window.location.href = "tel:+1234567890")}
              className="flex-1"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Us
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
