"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Download,
  Share2,
  Edit3,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Clock,
  User,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DocumentApiService } from "@/lib/document-api";
import { useAuth } from "@/hooks/useAuth";
// Import CSS for react-pdf (these may need to be adjusted based on the version)
import "react-pdf/src/Page/AnnotationLayer.css";
import "react-pdf/src/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  documentId: string;
  workspaceId: string;
  onClose?: () => void;
}

interface DocumentData {
  id: string;
  name: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  category: string;
  isEncrypted: boolean;
  currentVersion: number;
  versions: Array<{
    versionNumber: number;
    uploadedAt: string;
    uploadedBy: {
      name: string;
      email: string;
    };
    comments?: string;
  }>;
  metadata: {
    pageCount?: number;
    wordCount?: number;
    author?: string;
    createdDate?: string;
    customTags?: string[];
  };
  permissions: Array<{
    userId?: string;
    email?: string;
    permission: string;
    sharedAt: string;
  }>;
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
  lastAccessedAt?: string;
  accessCount: number;
}

export function DocumentViewer({
  documentId,
  workspaceId,
  onClose,
}: DocumentViewerProps) {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const { toast } = useToast();
  const { token } = useAuth();
  const [documentApi] = useState(
    () => new DocumentApiService(workspaceId, token || undefined),
  );

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);

      // Fetch document metadata
      const doc = await documentApi.getDocument(documentId);
      setDocument(doc as any);

      // Get signed URL for document viewing
      const viewInfo = await documentApi.getViewUrl(documentId);
      setDocumentUrl(viewInfo.url);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async () => {
    try {
      const downloadInfo = await documentApi.getDownloadUrl(documentId);
      window.open(downloadInfo.url, "_blank");

      toast({
        title: "Success",
        description: "Document download started",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document || !documentUrl) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Document not found</p>
      </div>
    );
  }

  const isPDF = document.mimeType === "application/pdf";
  const isImage = document.mimeType.startsWith("image/");
  const isText =
    document.mimeType.startsWith("text/") ||
    ["application/json", "application/xml"].includes(document.mimeType);
  const isOfficeDoc = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ].includes(document.mimeType);

  const handleShare = async () => {
    try {
      // Generate a shareable link
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
          permissions: ["view", "download"],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share link");
      }

      const { shareUrl } = await response.json();

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      // Show success message (you might want to use a toast notification here)
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing document:", error);
      alert("Failed to create share link. Please try again.");
    }
  };

  const getFileIcon = () => {
    if (isPDF) return <FileText className="h-5 w-5 text-red-500" />;
    if (isImage) return <FileText className="h-5 w-5 text-blue-500" />;
    if (isText) return <FileText className="h-5 w-5 text-green-500" />;
    if (isOfficeDoc) return <FileText className="h-5 w-5 text-orange-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <h2 className="text-lg font-semibold">{document.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                {document.isEncrypted && (
                  <Lock className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm text-gray-500">
                  {document.fileType.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={downloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          <span>•</span>
          <span>Version {document.currentVersion}</span>
          <span>•</span>
          <Badge variant="secondary">{document.category}</Badge>
          <span>•</span>
          <span>Accessed {document.accessCount} times</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Document Content */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {isPDF && (
            <>
              {/* PDF Controls */}
              <div className="sticky top-0 z-10 bg-white border-b p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {pageNumber} of {numPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={pageNumber >= (numPages || 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{Math.round(scale * 100)}%</span>
                  <Button variant="outline" size="sm" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="flex justify-center p-4">
                <Document
                  file={documentUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
            </>
          )}

          {isImage && (
            <div className="flex justify-center items-center h-full p-4">
              <img
                src={documentUrl}
                alt={document.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {isText && documentUrl && (
            <div className="flex justify-center p-4 h-full">
              <div className="w-full max-w-4xl bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">
                    Text Preview
                  </h3>
                </div>
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <iframe
                      src={documentUrl}
                      className="w-full h-96 border-0"
                      title={document.name}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {isOfficeDoc && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <FileText className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Office Document</h3>
                <p className="text-gray-600 mb-4">
                  Preview is available through Microsoft Office Online or Google
                  Docs
                </p>
                <div className="space-y-2">
                  <Button onClick={downloadDocument} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(documentUrl)}`,
                        "_blank",
                      )
                    }
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Online
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isPDF && !isImage && !isText && !isOfficeDoc && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Preview Not Available
                </h3>
                <p className="text-gray-600 mb-4">
                  This file type cannot be previewed in the browser
                </p>
                <Button onClick={downloadDocument}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-white">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex-1">
                Versions
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                Comments
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="details" className="p-4 m-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Document Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span>{document.fileType.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span>
                          {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      {document.metadata.pageCount && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pages:</span>
                          <span>{document.metadata.pageCount}</span>
                        </div>
                      )}
                      {document.metadata.wordCount && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Words:</span>
                          <span>
                            {document.metadata.wordCount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Owner</h3>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        <p className="font-medium">{document.owner.name}</p>
                        <p className="text-gray-500">{document.owner.email}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">
                          Created{" "}
                          {new Date(document.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {document.lastAccessedAt && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">
                            Last accessed{" "}
                            {new Date(
                              document.lastAccessedAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">
                          Viewed {document.accessCount} times
                        </span>
                      </div>
                    </div>
                  </div>

                  {document.metadata.customTags &&
                    document.metadata.customTags.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {document.metadata.customTags.map((tag) => (
                              <Badge key={index}
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </TabsContent>

              <TabsContent value="versions" className="p-4 m-0">
                <div className="space-y-3">
                  {document.versions.map((version) => (
                    <Card key={version.versionNumber} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Version {version.versionNumber}
                            {version.versionNumber ===
                              document.currentVersion && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Current
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {version.uploadedBy.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(version.uploadedAt).toLocaleString()}
                          </p>
                          {version.comments && (
                            <p className="text-xs text-gray-600 mt-2">
                              {version.comments}
                            </p>
                          )}
                        </div>
                        {version.versionNumber !== document.currentVersion && (
                          <Button variant="outline" size="sm">
                            Restore
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="p-4 m-0">
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No comments yet</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Comment
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
