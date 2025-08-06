
interface LoginRedirectProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to test login page
    router.replace("/auth/test-login");
  }, [router]);

  return null;
}
