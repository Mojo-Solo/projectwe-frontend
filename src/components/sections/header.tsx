
"use client";

interface HeaderProps {
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

function Navigation() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/services",
      label: "Services",
      active: pathname.startsWith("/services"),
    },
    {
      href: "/methodology",
      label: "Methodology",
      active: pathname === "/methodology",
    },
    {
      href: "/case-studies",
      label: "Case Studies",
      active: pathname === "/case-studies",
    },
    {
      href: "/insights",
      label: "Insights",
      active: pathname === "/insights",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ];

  return (
    <nav className="hidden sm:flex items-center space-x-1">
      {routes.map((route) => (
        <Link key={route.href}
          href={route.href}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-colors",
            route.active
              ? "text-foreground bg-accent/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
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
      className={
        "relative sticky top-0 z-50 py-2 bg-background/60 backdrop-blur"
      }
    >
      <div className="flex justify-between items-center container">
        <Link
          href="/"
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          <Icons.logo className="w-auto h-[40px]" />
          <span className="font-bold text-xl">ProjectWE®</span>
        </Link>

        <div className="hidden lg:block">
          <div className="flex items-center ">
            <Navigation />

            <div className="gap-2 flex">
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost" })}
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline" })}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full sm:w-auto text-background flex gap-2",
                )}
              >
                <Icons.logo className="h-6 w-6" />
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-2 cursor-pointer block lg:hidden">
          <Drawer />
        </div>
      </div>
      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}
