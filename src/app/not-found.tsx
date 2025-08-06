
interface NotFoundProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion, Home, Search, ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl">404</CardTitle>
          <CardDescription className="text-lg mt-2">
            Page not found
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the page you&apos;re looking for. It might
            have been moved, deleted, or never existed.
          </p>

          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Back to Homepage
              </Button>
            </Link>

            <Link href="/exit-readiness">
              <Button variant="outline" className="w-full">
                <Compass className="mr-2 h-4 w-4" />
                Exit Readiness Calculator
              </Button>
            </Link>

            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                View Pricing
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
