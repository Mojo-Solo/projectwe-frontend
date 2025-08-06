"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const TEST_ACCOUNTS = [
  { email: "test1@projectwe.com", password: "password123", role: "Owner" },
  { email: "test2@projectwe.com", password: "password123", role: "Admin" },
  { email: "test3@projectwe.com", password: "password123", role: "Member" },
  { email: "demo@projectwe.com", password: "demo123", role: "Demo Owner" },
  {
    email: "investor@projectwe.com",
    password: "investor123",
    role: "Investor",
  },
];

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Test Login</CardTitle>
          <CardDescription>
            Use one of the test accounts below or enter credentials manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick login buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Login:</p>
            <div className="grid gap-2">
              {TEST_ACCOUNTS.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className="justify-start"
                  onClick={() => quickLogin(account.email, account.password)}
                >
                  <div className="text-left">
                    <div className="font-medium">{account.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {account.role} • Password: {account.password}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or login manually
              </span>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test1@projectwe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>This is a test login system for development</p>
            <p>In production, use proper authentication</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
