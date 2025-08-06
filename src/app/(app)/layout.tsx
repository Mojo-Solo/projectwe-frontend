import { EnhancedSessionProvider } from "@/components/providers/EnhancedSessionProvider";

export const dynamic = "force-dynamic";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <EnhancedSessionProvider>{children}</EnhancedSessionProvider>;
}
