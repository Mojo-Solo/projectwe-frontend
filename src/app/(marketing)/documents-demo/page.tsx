
interface DocumentsDemoProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Section } from "@/components/sections/section";

// Dynamic import for DocumentManagerDemo to prevent SSR issues with PDF components
const DocumentManagerDemo = dynamic(
  () => import("@/components/documents/DocumentManagerDemo").then(mod => ({ default: mod.DocumentManagerDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document manager...</p>
        </div>
      </div>
    ),
  }
);
import {
  FileText,
  Shield,
  GitBranch,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DocumentsDemo() {
  // In a real app, these would come from auth context
  const workspaceId = "demo-workspace";
  const userId = "demo-user";

  return (
    <>
      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Document Management System
            </h1>
            <p className="text-xl text-gray-600">
              Enterprise-grade document management for exit planning with
              version control, collaboration, and AI-powered insights
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Secure Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bank-level encryption with granular access controls and audit
                  trails
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GitBranch className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Version Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track changes, restore previous versions, and manage document
                  branches
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Annotations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add comments, highlights, and drawings directly on documents
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time collaboration with team members and external
                  advisors
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Multi-Format</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Support for PDFs, images, text documents, spreadsheets, and
                  more
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatic document analysis, entity extraction, and risk
                  assessment
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Key Features List */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Complete Document Viewer Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">PDF Viewer</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Page navigation with thumbnails</li>
                  <li>• Zoom controls and fit options</li>
                  <li>• Text search with highlighting</li>
                  <li>• Annotation tools (highlight, comment, draw)</li>
                  <li>• Bookmarks and navigation</li>
                  <li>• Print and download options</li>
                  <li>• Fullscreen presentation mode</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Version Control</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Automatic version tracking</li>
                  <li>• Visual diff comparison</li>
                  <li>• Branch management</li>
                  <li>• Restore previous versions</li>
                  <li>• Version tagging and comments</li>
                  <li>• Digital signatures</li>
                  <li>• Merge conflict resolution</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Image Viewer</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Pan and zoom controls</li>
                  <li>• Rotation and flip tools</li>
                  <li>• Annotation support</li>
                  <li>• Export with transformations</li>
                  <li>• Watermark support</li>
                  <li>• Fullscreen mode</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Text Viewer</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Syntax highlighting for code</li>
                  <li>• Line numbers and word wrap</li>
                  <li>• Theme selection</li>
                  <li>• Search functionality</li>
                  <li>• Copy and download</li>
                  <li>• Print optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Demo Section */}
      <Section className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Interactive Demo
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DocumentManagerDemo workspaceId={workspaceId} userId={userId} />
          </div>
        </div>
      </Section>

      {/* Integration Section */}
      <Section>
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Seamless Integration with Exit Planning Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automatic document analysis and categorization</li>
                  <li>• Extract key metrics and entities</li>
                  <li>• Risk identification and mitigation suggestions</li>
                  <li>• Generate summaries and reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Link documents to specific tasks</li>
                  <li>• Track document completion status</li>
                  <li>• Automated reminders for reviews</li>
                  <li>• Document approval workflows</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• End-to-end encryption</li>
                  <li>• Access control and permissions</li>
                  <li>• Audit trails and activity logs</li>
                  <li>• GDPR and SOC 2 compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collaboration Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time document sharing</li>
                  <li>• Threaded discussions on documents</li>
                  <li>• External party access with controls</li>
                  <li>• Email notifications and updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
