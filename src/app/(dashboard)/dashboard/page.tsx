
interface DashboardRouteHandlerProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardRouteHandler() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Route based on user role
      const userRole = user.role || determineUserRole(user);

      switch (userRole) {
        case "advisor":
          router.replace("/dashboard/advisor");
          break;
        case "owner":
          router.replace("/dashboard/owner");
          break;
        case "team_member":
          router.replace("/dashboard/team");
          break;
        case "investor":
          router.replace("/dashboard/investor");
          break;
        default:
          // Fallback to owner dashboard if role is unclear
          router.replace("/dashboard/owner");
      }
    }
  }, [user, isLoading, router]);

  // Determine role from user data if not explicitly set
  function determineUserRole(user: any): string {
    // Check for advisor indicators
    if (
      user.email?.includes("advisor") ||
      user.company?.toLowerCase().includes("advisory") ||
      user.title?.toLowerCase().includes("advisor") ||
      user.is_advisor
    ) {
      return "advisor";
    }

    // Check for team member indicators
    if (
      user.title?.toLowerCase().includes("cfo") ||
      user.title?.toLowerCase().includes("coo") ||
      user.title?.toLowerCase().includes("manager") ||
      user.is_team_member
    ) {
      return "team_member";
    }

    // Check for investor indicators
    if (
      user.email?.includes("investor") ||
      user.company?.toLowerCase().includes("capital") ||
      user.company?.toLowerCase().includes("partners") ||
      user.is_investor
    ) {
      return "investor";
    }

    // Default to owner
    return "owner";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Preparing your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
