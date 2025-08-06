// Disable SSG for interactive dashboard routes while stabilizing
export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

import { Metadata } from "next";
import { EnhancedSessionProvider } from "@/components/providers/EnhancedSessionProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

export const metadata: Metadata = {
  title: "Dashboard - ProjectWE®",
  description:
    "Comprehensive exit planning dashboard for strategic business exits",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnhancedSessionProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-background">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <RoleSwitcher />
        </div>
      </ProtectedRoute>
    </EnhancedSessionProvider>
  );
}
