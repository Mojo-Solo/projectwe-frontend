
interface SignupRedirectProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to test login page (signup not needed for test users)
    router.replace("/auth/test-login");
  }, [router]);

  return null;
}