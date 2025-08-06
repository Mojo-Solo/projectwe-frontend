
"use client";

interface HeaderWithAIProps {
  className?: string;
  children?: React.ReactNode;
}

import Drawer from "@/components/drawer";
import { Icons } from "@/components/icons";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import { Bot } from "lucide-react";

function Navigation() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/services",
      label: "Strategic Services",
      active: pathname.startsWith("/services"),
    },
    {
      href: "/methodology",
      label: "Our Methodology",
      active: pathname === "/methodology",
    },
    {
      href: "/case-studies",
      label: "Case Studies",
      active: pathname === "/case-studies",
    },
    {
      href: "/insights",
      label: "Strategic Insights",
      active: pathname === "/insights",
    },
    {
      href: "/ai",
      label: "AI Assistant",
      active: pathname === "/ai",
      icon: <Bot className="w-4 h-4" />,
    },
    {
      href: "/about",
      label: "About ProjectWE®",
      active: pathname === "/about",
    },
  ];

  return (
    <nav className="hidden sm:flex items-center space-x-1">
      {routes.map((route) => (
        <Link key={route.href}
          href={route.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-foreground" : "text-foreground/60",
            "flex items-center gap-2",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export default function HeaderWithAI() {
  const [addBorder, setAddBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setAddBorder(true);
      } else {
        setAddBorder(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "relative sticky top-0 z-50 py-2 bg-background/60 backdrop-blur",
        addBorder && "border-b",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          title="ProjectWE® brand logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">WE-Exit</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            AI
          </span>
        </Link>

        <div className="hidden lg:block">
          <div className="flex items-center">
            <Navigation />
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "text-sm font-medium",
                )}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-2 cursor-pointer block lg:hidden">
          <Drawer>
            <div className="flex flex-col space-y-4">
              <Navigation />
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "text-sm font-medium w-full",
                  )}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
