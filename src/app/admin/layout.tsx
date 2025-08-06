// Disable SSG for interactive admin routes while stabilizing
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { checkAdminAuth } from "@/lib/admin/middleware";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dynamic import to avoid build-time auth validation
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth-simple");

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check admin permissions
  const adminUser = await checkAdminAuth({
    headers: { get: () => null },
  } as any);

  if (!adminUser) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar user={adminUser} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={adminUser} />

          <main className="flex-1 overflow-y-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
