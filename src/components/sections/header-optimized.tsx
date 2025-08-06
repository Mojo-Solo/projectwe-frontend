"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, Users, BookOpen, Calculator } from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  userType?: "all" | "advisor" | "owner" | "new";
}

const primaryNavigation: NavigationItem[] = [
  {
    title: "Platform Overview",
    href: "/platform",
    description: "See how ProjectWE® transforms exit planning",
    icon: <Sparkles className="h-4 w-4" />,
    userType: "all",
  },
  {
    title: "For Advisors",
    href: "/advisors",
    description: "Tools built specifically for exit planning professionals",
    icon: <Users className="h-4 w-4" />,
    userType: "advisor",
  },
  {
    title: "For Business Owners",
    href: "/owners",
    description: "Strategic guidance for your exit journey",
    icon: <BookOpen className="h-4 w-4" />,
    userType: "owner",
  },
];

const quickActions: NavigationItem[] = [
  {
    title: "Schedule Demo",
    href: "/demo",
    description: "See the platform in action",
    badge: "Popular",
    userType: "new",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Simple, transparent pricing",
    userType: "all",
  },
  {
    title: "Free Assessment",
    href: "/assessment",
    description: "Discover your exit readiness",
    badge: "Free",
    userType: "owner",
  },
];

export default function HeaderOptimized() {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<"all" | "advisor" | "owner" | "new">("new");
  const pathname = usePathname();

  // Simple user type detection based on current page
  useEffect(() => {
    if (pathname.includes("/advisor")) setUserType("advisor");
    else if (pathname.includes("/owner")) setUserType("owner");
    else if (pathname === "/") setUserType("new");
    else setUserType("all");
  }, [pathname]);

  const filteredNavigation = primaryNavigation.filter(
    (item) => item.userType === "all" || item.userType === userType
  );

  const filteredQuickActions = quickActions.filter(
    (item) => item.userType === "all" || item.userType === userType
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">ProjectWE®</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Main Navigation */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    {filteredNavigation.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-start space-x-3 rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {item.icon && (
                            <div className="mt-1 text-muted-foreground">
                              {item.icon}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Quick Actions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[300px]">
                    {filteredQuickActions.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/demo">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icons.logo className="h-5 w-5" />
                  ProjectWE®
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Mobile Navigation */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Solutions
                  </h3>
                  {filteredNavigation.map((item) => (
                    <Link key={index}
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start space-x-3 rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      {item.icon && (
                        <div className="mt-1 text-muted-foreground">
                          {item.icon}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Mobile Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Get Started
                  </h3>
                  {filteredQuickActions.map((item) => (
                    <Link key={index}
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="space-y-3 pt-6 border-t">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/signin" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/demo" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}