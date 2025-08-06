
interface TwoFactorRecoveryPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key } from "lucide-react";

export default function TwoFactorRecoveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanCode = recoveryCode.replace(/\s/g, "");
    if (!cleanCode) {
      setError("Please enter a recovery code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/two-factor-challenge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recovery_code: cleanCode }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid recovery code");
      }

      const data = await response.json();

      // Store token if returned
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message || "Invalid recovery code");
      setRecoveryCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Key className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Use recovery code
          </CardTitle>
          <CardDescription className="text-center">
            Enter one of your recovery codes to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recoveryCode">Recovery code</Label>
              <Input
                id="recoveryCode"
                type="text"
                placeholder="xxxxx-xxxxx"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
                disabled={isLoading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Recovery codes are 10 characters long (format: xxxxx-xxxxx)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !recoveryCode.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify recovery code
            </Button>
          </form>

          <Alert>
            <AlertDescription className="text-sm">
              Each recovery code can only be used once. After using this code,
              it will no longer be valid.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Link href="/auth/two-factor" className="w-full">
            <Button className="w-full" variant="ghost">
              Use authenticator app instead
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
