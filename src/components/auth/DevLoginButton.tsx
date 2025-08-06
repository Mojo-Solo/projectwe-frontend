"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function DevLoginButton() {
  const [showDevLogin, setShowDevLogin] = useState(false);
  const { devLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    // Only show in development or when explicitly enabled
    const isDev = process.env.NODE_ENV === "development";
    const isEnabled = process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED === "true";
    setShowDevLogin(isDev || isEnabled);
  }, [Only, show, in, development, or, when, explicitly, enabled, const, isDev, process, env, NODE_ENV, isEnabled, NEXT_PUBLIC_DEV_AUTH_ENABLED, true, setShowDevLogin]);

  if (!showDevLogin) return null;

  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      await devLogin();
    } catch (error) {
      console.error("Dev login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or for development
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleDevLogin}
        disabled={isLoading}
      >
        <Zap className="mr-2 h-4 w-4" />
        One-Click DEV Login
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        ⚠️ Development only - bypasses authentication
      </p>
    </div>
  );
}
