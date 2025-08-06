export const dynamic = 'force-dynamic';

import { EnhancedSessionProvider } from "@/components/providers/EnhancedSessionProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AuthLayoutProps) {
  return (
    <EnhancedSessionProvider>
      <ProtectedRoute requireAuth={false}>
        <main className="flex flex-col items-center justify-center h-screen">
          {children}
        </main>
      </ProtectedRoute>
    </EnhancedSessionProvider>
  );
}
