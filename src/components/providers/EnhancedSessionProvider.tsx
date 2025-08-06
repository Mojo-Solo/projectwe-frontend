"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";

interface EnhancedSessionProviderProps {
  children: ReactNode;
}

interface AuthHealthStatus {
  isHealthy: boolean;
  lastCheck: Date;
  error?: string;
}

export function EnhancedSessionProvider({
  children,
}: EnhancedSessionProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [healthStatus, setHealthStatus] = useState<AuthHealthStatus>({
    isHealthy: false,
    lastCheck: new Date(),
  });

  useEffect(() => {
    const checkAuthHealth = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const isHealthy =
          response.ok &&
          response.headers.get("content-type")?.includes("application/json");

        setHealthStatus({
          isHealthy,
          lastCheck: new Date(),
          error: isHealthy
            ? undefined
            : `Status: ${response.status}, Content-Type: ${response.headers.get("content-type")}`,
        });

        if (!isHealthy) {
          console.warn("[EnhancedSessionProvider] Auth health check failed:", {
            status: response.status,
            contentType: response.headers.get("content-type"),
          });
        }
      } catch (error) {
        console.warn(
          "[EnhancedSessionProvider] Auth health check error:",
          error,
        );
        setHealthStatus({
          isHealthy: false,
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsReady(true);
      }
    };

    checkAuthHealth();

    // Check health periodically in development
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(checkAuthHealth, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, []);

  const handleAuthError = (error: Error, errorInfo: any) => {
    console.error(
      "[EnhancedSessionProvider] Auth error in boundary:",
      error,
      errorInfo,
    );

    // Update health status
    setHealthStatus((prev) => ({
      ...prev,
      isHealthy: false,
      error: error.message,
      lastCheck: new Date(),
    }));
  };

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return (
    <AuthErrorBoundary onError={handleAuthError}>
      <SessionProvider
        refetchInterval={5 * 60} // 5 minutes
        refetchOnWindowFocus={true}
        refetchWhenOffline={false}
      >
        {process.env.NODE_ENV === "development" && (
          <AuthHealthIndicator status={healthStatus} />
        )}
        {children}
      </SessionProvider>
    </AuthErrorBoundary>
  );
}

function AuthLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Initializing authentication...</p>
      </div>
    </div>
  );
}

interface AuthHealthIndicatorProps {
  status: AuthHealthStatus;
}

function AuthHealthIndicator({ status }: AuthHealthIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 10000); // Hide after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || status.isHealthy) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-2 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-yellow-800">
              Auth service warning: {status.error}
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
