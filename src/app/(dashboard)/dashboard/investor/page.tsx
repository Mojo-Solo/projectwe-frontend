
interface InvestorDashboardProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, TrendingUp, Building2 } from "lucide-react";

export default function InvestorDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Investor Data Room</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.name || "Investor"}. Access confidential business
          information below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">47</p>
            <p className="text-sm text-muted-foreground">Available files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5 Years</p>
            <p className="text-sm text-muted-foreground">Historical data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Updated</p>
            <p className="text-sm text-muted-foreground">2 days ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Access Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Full</p>
            <p className="text-sm text-muted-foreground">All documents</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Data Room Contents</CardTitle>
          <CardDescription>
            Confidential documents for due diligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Document browser coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
