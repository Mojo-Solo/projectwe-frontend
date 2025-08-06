import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkspacesTable from "@/components/admin/workspaces/WorkspacesTable";
import WorkspaceStats from "@/components/admin/workspaces/WorkspaceStats";
import { Search, Download, Building2 } from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminWorkspacesPage() {
  const stats = {
    totalWorkspaces: 3421,
    activeWorkspaces: 2987,
    avgUsersPerWorkspace: 4.2,
    totalStorage: "2.4 TB",
    avgDocuments: 147,
    topPlan: "Pro",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Workspace Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all platform workspaces
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Workspace Stats */}
      <WorkspaceStats stats={stats} />

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Workspaces</CardTitle>
          <CardDescription>
            Find workspaces by name, owner, or ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input placeholder="Search workspaces..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Workspace Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Workspaces</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Workspaces</CardTitle>
              <CardDescription>
                Total: {stats.totalWorkspaces.toLocaleString()} workspaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspacesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Workspaces</CardTitle>
              <CardDescription>
                Workspaces with active subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspacesTable filter="active" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial">
          <Card>
            <CardHeader>
              <CardTitle>Trial Workspaces</CardTitle>
              <CardDescription>Workspaces on trial period</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspacesTable filter="trial" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended">
          <Card>
            <CardHeader>
              <CardTitle>Suspended Workspaces</CardTitle>
              <CardDescription>
                Workspaces that have been suspended
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspacesTable filter="suspended" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Archived Workspaces</CardTitle>
              <CardDescription>Deleted or archived workspaces</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspacesTable filter="archived" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
