
interface DevSignInPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DevSignInPage() {
  const router = useRouter();

  const handleDevLogin = () => {
    // For development, we'll bypass authentication
    // In a real app, this would never exist in production
    if (process.env.NODE_ENV === "development") {
      // Set a dummy session cookie
      document.cookie = "dev-auth=true; path=/; max-age=86400";
      router.push("/intelligence");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Development Login
          </CardTitle>
          <CardDescription className="text-yellow-600">
            ⚠️ This page is only available in development mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              This bypasses authentication for development purposes only. In
              production, proper authentication would be required.
            </p>
          </div>

          <Button
            onClick={handleDevLogin}
            className="w-full"
            size="lg"
            variant="default"
          >
            Continue to Intelligence Dashboard (Dev Mode)
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Or use the regular{" "}
              <a href="/auth/signin" className="text-primary hover:underline">
                sign in page
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
