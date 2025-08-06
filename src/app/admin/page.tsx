
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  className?: string;
  children?: React.ReactNode;
}

// Force this page to be rendered dynamically at runtime
export default function AdminPage() {
  redirect("/admin/dashboard");
}
