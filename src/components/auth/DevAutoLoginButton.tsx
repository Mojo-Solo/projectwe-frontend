"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface DevAutoLoginButtonProps {
  onError: (error: string) => void;
  disabled?: boolean;
}

export function DevAutoLoginButton({
  onError,
  disabled,
}: DevAutoLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    return null;
  }

  const handleDevAutoLogin = async () => {
    onError("");
    setIsLoading(true);

    // Test credentials
    const testEmail = "test@weexit.dev";
    const testPassword = "test123456";

    try {
      const result = await signIn("credentials", {
        email: testEmail,
        password: testPassword,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        onError(
          'Test user not found. Run "pnpm prisma db seed" or create user manually with email: test@weexit.dev and password: test123456',
        );
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      onError("Auto-login failed. Make sure test user exists.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-dashed border-yellow-500/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-yellow-600 font-medium">
            Development Only
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-yellow-500/50 bg-yellow-50/50 hover:bg-yellow-100/50 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/40"
        onClick={handleDevAutoLogin}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-yellow-600" />
        )}
        <span className="text-yellow-700 dark:text-yellow-500">
          One-Click Dev Login (test@weexit.dev)
        </span>
      </Button>
    </>
  );
}
