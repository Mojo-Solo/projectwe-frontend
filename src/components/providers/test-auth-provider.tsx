"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

interface TestAuthContextType {
  user: TestUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/test-login");
      const data = await res.json();
      
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/test-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await fetch("/api/auth/test-logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <TestAuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </TestAuthContext.Provider>
  );
}

export function useTestAuth() {
  const context = useContext(TestAuthContext);
  if (context === undefined) {
    throw new Error("useTestAuth must be used within a TestAuthProvider");
  }
  return context;
}