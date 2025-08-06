"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SharedDocument {
  id: string;
  name: string;
  mimeType: string;
  fileSize: number;
  downloadUrl: string;
  viewUrl: string;
  permissions: string[];
  expiresAt: string;
  ownerName: string;
  workspaceName: string;
}

export default function SharedDocumentPage() {
  const params = useParams();
  const token = params.token as string;

  const [document, setDocument] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedDocument();
  }, [token]);

  const fetchSharedDocument = async () => {
    try {
      const response = await fetch(`/api/shared/documents/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("This share link is invalid or has expired.");
        } else if (response.status === 403) {
          setError("You do not have permission to view this document.");
        } else {
          setError("Failed to load document. Please try again.");
        }
        return;
      }

      const data = await response.json();
      setDocument(data);
    } catch (err) {
      setError("Failed to load document. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document || !document.permissions.includes("download")) {
      return;
    }

    try {
      const response = await fetch(document.downloadUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download document. Please try again.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Expired";
    } else if (diffDays === 0) {
      return "Expires today";
    } else if (diffDays === 1) {
      return "Expires tomorrow";
    } else {
      return `Expires in ${diffDays} days`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle className="text-2xl">{document.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Shared by {document.ownerName} from {document.workspaceName}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This document{" "}
                {formatExpiryDate(document.expiresAt).toLowerCase()}.
                {document.permissions.includes("download")
                  ? " You can view and download this document."
                  : " You can only view this document."}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">File Size</p>
                <p className="font-medium">
                  {formatFileSize(document.fileSize)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{document.mimeType}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => window.open(document.viewUrl, "_blank")}
                className="flex-1"
              >
                View Document
              </Button>
              {document.permissions.includes("download") && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {document.mimeType === "application/pdf" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
                <div
                  className="border rounded-lg overflow-hidden"
                  style={{ height: "600px" }}
                >
                  <iframe
                    src={document.viewUrl}
                    className="w-full h-full"
                    title="Document Preview"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by ProjectWE® • Enterprise Exit Planning Platform</p>
        </div>
      </div>
    </div>
  );
}
