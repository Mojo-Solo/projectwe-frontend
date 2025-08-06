import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminRolesManager from "@/components/admin/security/AdminRolesManager";
import AuditTrailViewer from "@/components/admin/security/AuditTrailViewer";
import SecuritySettings from "@/components/admin/security/SecuritySettings";
import IPAllowlistManager from "@/components/admin/security/IPAllowlistManager";
import SessionManager from "@/components/admin/security/SessionManager";
import {
  Shield,
  Users,
  FileText,
  Settings,
  Globe,
  Key,
  AlertTriangle,
} from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminSecurityPage() {
  const securityStats = {
    activeAdmins: 8,
    recentAuditEvents: 1247,
    activeSessions: 12,
    allowlistedIPs: 5,
    lastSecurityIncident: "None in last 30 days",
    twoFactorAdoption: 87.5,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Security Management</h1>
          <p className="text-gray-600 mt-1">
            Manage admin roles, audit trails, and security settings
          </p>
        </div>
        <Button variant="destructive">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Security Alert Settings
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{securityStats.activeAdmins}</p>
            <p className="text-sm text-gray-600">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              2FA Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {securityStats.twoFactorAdoption}%
            </p>
            <p className="text-sm text-green-600">7 of 8 admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">Secure</p>
            <p className="text-sm text-gray-600">
              {securityStats.lastSecurityIncident}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Reminder:</strong> All admin actions are logged and
          audited. Ensure you have proper authorization before making changes.
        </AlertDescription>
      </Alert>

      {/* Security Management Tabs */}
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="roles">Admin Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="ip-allowlist">IP Allowlist</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Admin Role Management</span>
              </CardTitle>
              <CardDescription>
                Manage administrator accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRolesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Audit Trail</span>
              </CardTitle>
              <CardDescription>
                View all admin actions and system changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTrailViewer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure platform security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip-allowlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>IP Allowlist</span>
              </CardTitle>
              <CardDescription>
                Restrict admin access to specific IP addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IPAllowlistManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Session Management</span>
              </CardTitle>
              <CardDescription>
                Monitor and manage active admin sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}