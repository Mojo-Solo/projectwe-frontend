import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserImpersonation from "@/components/admin/support/UserImpersonation";
import ActivityLogsViewer from "@/components/admin/support/ActivityLogsViewer";
import DebugConsole from "@/components/admin/support/DebugConsole";
import EmailPreview from "@/components/admin/support/EmailPreview";
import APIMonitor from "@/components/admin/support/APIMonitor";
import ErrorLogsViewer from "@/components/admin/support/ErrorLogsViewer";
import {
  HeadphonesIcon,
  User,
  Activity,
  Terminal,
  Mail,
  Zap,
  AlertTriangle,
} from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminSupportPage() {
  const supportStats = {
    openTickets: 47,
    avgResponseTime: "2.3 hours",
    resolvedToday: 23,
    satisfaction: 94.2,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Support Tools</h1>
          <p className="text-gray-600 mt-1">
            Debug tools and user support utilities
          </p>
        </div>
        <Button>
          <HeadphonesIcon className="mr-2 h-4 w-4" />
          Open Support Dashboard
        </Button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{supportStats.openTickets}</p>
            <p className="text-sm text-red-600">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{supportStats.avgResponseTime}</p>
            <p className="text-sm text-green-600">-30min from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{supportStats.resolvedToday}</p>
            <p className="text-sm text-gray-600">On track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{supportStats.satisfaction}%</p>
            <p className="text-sm text-green-600">+2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tools Tabs */}
      <Tabs defaultValue="impersonate" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="impersonate">Impersonate</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="debug">Debug Console</TabsTrigger>
          <TabsTrigger value="email">Email Preview</TabsTrigger>
          <TabsTrigger value="api">API Monitor</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="impersonate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Impersonation</span>
              </CardTitle>
              <CardDescription>
                Login as any user for support purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserImpersonation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Activity Logs</span>
              </CardTitle>
              <CardDescription>
                View user and system activity logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLogsViewer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Debug Console</span>
              </CardTitle>
              <CardDescription>
                Execute debug commands and queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DebugConsole />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Preview & Testing</span>
              </CardTitle>
              <CardDescription>
                Preview and test email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailPreview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>API Usage Monitor</span>
              </CardTitle>
              <CardDescription>
                Monitor API usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APIMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Error Logs</span>
              </CardTitle>
              <CardDescription>View and analyze system errors</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorLogsViewer />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
