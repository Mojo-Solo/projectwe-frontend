import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAgentConfigurator from "@/components/admin/content/AIAgentConfigurator";
import TemplatesManager from "@/components/admin/content/TemplatesManager";
import EmailTemplatesManager from "@/components/admin/content/EmailTemplatesManager";
import KnowledgeBaseManager from "@/components/admin/content/KnowledgeBaseManager";
import FeatureFlagsManager from "@/components/admin/content/FeatureFlagsManager";
import AnnouncementsManager from "@/components/admin/content/AnnouncementsManager";
import {
  FileText,
  Bot,
  Mail,
  BookOpen,
  ToggleLeft,
  Megaphone,
} from "lucide-react";

// Force this page to be rendered dynamically at runtime
export const dynamic = 'force-dynamic';

export default function AdminContentPage() {
  // Guard against missing DATABASE_URL during build
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-600 mt-1">
            Database configuration required. Please set DATABASE_URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-gray-600 mt-1">
          Manage AI agents, templates, and system content
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-lg">AI Agents</CardTitle>
              <CardDescription>12 active configurations</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <CardTitle className="text-lg">Templates</CardTitle>
              <CardDescription>48 system templates</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-3">
            <ToggleLeft className="h-8 w-8 text-purple-600" />
            <div>
              <CardTitle className="text-lg">Feature Flags</CardTitle>
              <CardDescription>8 active flags</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Content Management Tabs */}
      <Tabs defaultValue="ai-agents" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Configurations</CardTitle>
              <CardDescription>
                Manage AI agent behaviors and prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIAgentConfigurator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Templates</CardTitle>
              <CardDescription>
                Edit document and workflow templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Configure system email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Manage help articles and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeBaseManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Control feature availability</CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureFlagsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Announcements</CardTitle>
              <CardDescription>
                Manage platform-wide announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}