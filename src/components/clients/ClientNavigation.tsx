"use client";

import React from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  User,
  Brain,
  FileText,
  Activity,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Client } from "@/types/client";

interface ClientNavigationProps {
  client: Client;
  currentSection?: string;
}

export function ClientNavigation({ client, currentSection }: ClientNavigationProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const clientId = params.id as string;

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: User,
      path: `/clients/${clientId}`,
      description: "Client details and summary"
    },
    {
      id: "intelligence",
      label: "Intelligence",
      icon: Brain,
      path: `/clients/${clientId}/intelligence`,
      description: "AI-powered insights and analysis",
      badge: "AI"
    },
    {
      id: "assessments",
      label: "Assessments",
      icon: BarChart3,
      path: `/clients/${clientId}?tab=assessments`,
      description: "Exit readiness and evaluations"
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      path: `/clients/${clientId}?tab=documents`,
      description: "Client documents and files"
    },
    {
      id: "activities",
      label: "Activities",
      icon: Activity,
      path: `/clients/${clientId}?tab=activities`,
      description: "Meetings, calls, and tasks"
    },
    {
      id: "notes",
      label: "Notes",
      icon: MessageSquare,
      path: `/clients/${clientId}?tab=notes`,
      description: "Internal notes and observations"
    },
  ];

  const getCurrentSection = () => {
    if (pathname.includes("/intelligence")) return "intelligence";
    if (currentSection) return currentSection;
    return "overview";
  };

  const currentSectionId = getCurrentSection();
  const currentItem = navigationItems.find(item => item.id === currentSectionId);

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => router.push("/clients")}
                className="cursor-pointer"
              >
                Clients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{client.companyName}</BreadcrumbPage>
            </BreadcrumbItem>
            {currentSectionId !== "overview" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {currentItem?.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Client Header & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {client.companyName}
              </h1>
              <p className="text-muted-foreground">
                {client.firstName} {client.lastName} • {client.industry}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {client.status.toLowerCase().replace("_", " ")}
              </Badge>
              {client.engagementLevel && (
                <Badge 
                  variant={client.engagementLevel === "HIGH" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {client.engagementLevel.toLowerCase()} engagement
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation Dropdown */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/clients")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {currentItem?.icon && <currentItem.icon className="h-4 w-4" />}
                  {currentItem?.label}
                  {currentItem?.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {currentItem.badge}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === currentSectionId;
                  
                  return (
                    <DropdownMenuItem key={index}
                      key={item.id}
                      onClick={() => router.push(item.path)}
                      className={`flex items-center gap-3 cursor-pointer ${
                        isActive ? "bg-accent" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === "intelligence" && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => router.push(`/clients/${clientId}/intelligence`)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Brain className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-600">
                        Open Intelligence Dashboard
                      </span>
                      <ExternalLink className="h-3 w-3 text-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full AI analysis and insights
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats for Intelligence */}
        {currentSectionId === "intelligence" && (
          <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              <span>O3 AI Synthesis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
              <span>CASCADE Framework</span>
            </div>
            <div className="text-xs">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}