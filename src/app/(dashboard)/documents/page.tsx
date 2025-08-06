
interface DocumentsPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useEffect, useState } from "react";
import { DocumentManager } from "@/components/documents/DocumentManager";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">Please log in to access documents</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <DocumentManager workspaceId={user.organizationId} userId={user.id} />
    </div>
  );
}
