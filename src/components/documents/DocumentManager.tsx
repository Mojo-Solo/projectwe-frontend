"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Share2,
  Trash2,
  Download,
  Eye,
  Edit,
  Clock,
  GitBranch,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type {
  Document,
  DocumentPermission,
  Annotation,
} from "@/types/document";
import { DocumentList } from "./DocumentList";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentShare } from "./DocumentShare";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentVersionControl } from "./DocumentVersionControl";
import { format } from "date-fns";
import { DocumentApiService } from "@/lib/document-api";
import { useAuth } from "@/hooks/useAuth";

// Dynamic imports for viewer components to prevent SSR issues
const PDFViewer = dynamic(() => import("./viewer/PDFViewer").then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading PDF viewer...</p>
      </div>
    </div>
  ),
});

const ImageViewer = dynamic(() => import("./viewer/ImageViewer").then(mod => ({ default: mod.ImageViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading image viewer...</p>
      </div>
    </div>
  ),
});

const TextViewer = dynamic(() => import("./viewer/TextViewer").then(mod => ({ default: mod.TextViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading text viewer...</p>
      </div>
    </div>
  ),
});

interface DocumentManagerProps {
  workspaceId: string;
  userId: string;
  className?: string;
}

interface ViewerState {
  isOpen: boolean;
  document: Document | null;
  viewMode: "default" | "pdf" | "image" | "text" | "version";
}

export function DocumentManager({
  workspaceId,
  userId,
  className,
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState<Document | null>(null);
  const [viewer, setViewer] = useState<ViewerState>({
    isOpen: false,
    document: null,
    viewMode: "default",
  });
  const [annotations, setAnnotations] = useState<Record<string, Annotation[]>>(
    {},
  );
  const { toast } = useToast();
  const { token } = useAuth();
  const [documentApi] = useState(
    () => new DocumentApiService(workspaceId, token || undefined),
  );

  // Load documents
  useEffect(() => {
    if (token) {
      loadDocuments();
    }
  }, [workspaceId, token, searchQuery, selectedCategory]);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const params = {
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedFileType !== "all" && { fileType: selectedFileType }),
        ...(dateRange.from && { dateFrom: dateRange.from.toISOString() }),
        ...(dateRange.to && { dateTo: dateRange.to.toISOString() }),
        sortBy,
        sortOrder,
      };

      const result = await documentApi.listDocuments(params);
      setDocuments(result.data);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map((file) =>
        documentApi.uploadDocument(file, {
          // You can add additional metadata here if needed
          tags: [],
        }),
      );

      await Promise.all(uploadPromises);

      setUploadDialog(false);
      await loadDocuments();

      toast({
        title: "Success",
        description: `Uploaded ${files.length} file(s) successfully`,
      });
    } catch (error) {
      console.error("Failed to upload files:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await documentApi.deleteDocument(documentId);

      setDocuments((docs) => docs.filter((d) => d.id !== documentId));

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (
    documentId: string,
    permissions: DocumentPermission[],
  ) => {
    try {
      await documentApi.shareDocument(documentId, permissions);

      toast({
        title: "Success",
        description: "Document shared successfully",
      });
    } catch (error) {
      console.error("Failed to share document:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to share document",
        variant: "destructive",
      });
    }
  };

  const openViewer = async (document: Document) => {
    try {
      // Get the view URL for the document
      const viewInfo = await documentApi.getViewUrl(document.id);

      // Update the document with the view URL
      const updatedDocument = {
        ...document,
        versions: [
          {
            ...document.versions[0],
            fileUrl: viewInfo.url,
          },
          ...document.versions.slice(1),
        ],
      };

      let viewMode: ViewerState["viewMode"] = "default";

      if (document.mimeType === "application/pdf") {
        viewMode = "pdf";
      } else if (document.mimeType.startsWith("image/")) {
        viewMode = "image";
      } else if (
        document.mimeType.startsWith("text/") ||
        ["js", "jsx", "ts", "tsx", "json", "md", "yml", "yaml"].includes(
          document.fileType,
        )
      ) {
        viewMode = "text";
      }

      setViewer({
        isOpen: true,
        document: updatedDocument,
        viewMode,
      });
    } catch (error) {
      console.error("Failed to open document viewer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to open document",
        variant: "destructive",
      });
    }
  };

  const handleAnnotationCreate = (annotation: Omit<Annotation, "id">) => {
    if (!viewer.document) return;

    const newAnnotation: Annotation = {
      ...annotation,
      id: Date.now().toString(),
      documentId: viewer.document.id,
    };

    setAnnotations((prev) => ({
      ...prev,
      [viewer.document!.id]: [
        ...(prev[viewer.document!.id] || []),
        newAnnotation,
      ],
    }));
  };

  const handleAnnotationUpdate = (id: string, updates: Partial<Annotation>) => {
    if (!viewer.document) return;

    setAnnotations((prev) => ({
      ...prev,
      [viewer.document!.id]: prev[viewer.document!.id].map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
    }));
  };

  const handleAnnotationDelete = (id: string) => {
    if (!viewer.document) return;

    setAnnotations((prev) => ({
      ...prev,
      [viewer.document!.id]: prev[viewer.document!.id].filter(
        (a) => a.id !== id,
      ),
    }));
  };

  // Filter documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;
      const matchesFileType =
        selectedFileType === "all" || doc.fileType === selectedFileType;

      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const docDate = new Date(doc.updatedAt);
        if (dateRange.from && docDate < dateRange.from)
          matchesDateRange = false;
        if (dateRange.to && docDate > dateRange.to) matchesDateRange = false;
      }

      return (
        matchesSearch && matchesCategory && matchesFileType && matchesDateRange
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "size":
          comparison = a.fileSize - b.fileSize;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Get unique categories and file types
  const categories = ["all", ...new Set(documents.map((d) => d.category))];
  const fileTypes = ["all", ...new Set(documents.map((d) => d.fileType))];

  return (
    <div key={index} className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-gray-600">
            Manage and collaborate on your exit planning documents
          </p>
        </div>
        <Button onClick={() => setUploadDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Basic Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedFileType} onValueChange={setSelectedFileType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypes.map((fileType) => (
              <SelectItem key={fileType} value={fileType}>
                {fileType === "all" ? "All Types" : fileType.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showAdvancedSearch ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced
        </Button>

        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sortBy">Sort by</Label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date Modified</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger id="sortOrder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Range</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={
                    dateRange.from
                      ? dateRange.from.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      from: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    }))
                  }
                  className="text-sm"
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="date"
                  value={
                    dateRange.to ? dateRange.to.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      to: e.target.value ? new Date(e.target.value) : undefined,
                    }))
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm text-gray-600">
              {filteredDocuments.length} of {documents.length} documents
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFileType("all");
                setDateRange({});
                setSortBy("date");
                setSortOrder("desc");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Documents */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search filters"
                : "Upload your first document to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={index}
              key={document.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openViewer(document)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewer(document);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const downloadInfo = await documentApi.getDownloadUrl(
                            document.id,
                          );
                          window.open(downloadInfo.url, "_blank");
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to download document",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareDialog(document);
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewer({
                          isOpen: true,
                          document,
                          viewMode: "version",
                        });
                      }}
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      Versions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(document.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-medium mb-1 line-clamp-1">{document.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {(document.fileSize / 1024 / 1024).toFixed(2)} MB •{" "}
                {document.fileType.toUpperCase()}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {format(new Date(document.updatedAt), "MMM d, yyyy")}
                </span>
                <div className="flex items-center gap-2">
                  {document.isEncrypted && <Shield className="h-3 w-3" />}
                  {document.versions.length > 1 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />v{document.currentVersion}
                    </span>
                  )}
                </div>
              </div>

              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {document.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{document.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <DocumentList
          documents={filteredDocuments}
          onView={openViewer}
          onShare={(doc) => setShareDialog(doc)}
          onDelete={handleDelete}
          onVersions={(doc) =>
            setViewer({
              isOpen: true,
              document: doc,
              viewMode: "version",
            })
          }
        />
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload documents to your exit planning workspace
            </DialogDescription>
          </DialogHeader>
          <DocumentUpload
            workspaceId={workspaceId}
            onUpload={handleUpload}
            onCancel={() => setUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {shareDialog && (
        <Dialog open={true} onOpenChange={() => setShareDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Document</DialogTitle>
              <DialogDescription>
                Share &quot;{shareDialog.name}&quot; with team members or
                external parties
              </DialogDescription>
            </DialogHeader>
            <DocumentShare
              document={shareDialog}
              onShare={(permissions) => {
                handleShare(shareDialog.id, permissions);
                setShareDialog(null);
              }}
              onCancel={() => setShareDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Document Viewer */}
      {viewer.isOpen && viewer.document && (
        <Dialog
          open={viewer.isOpen}
          onOpenChange={(open) =>
            !open &&
            setViewer({ isOpen: false, document: null, viewMode: "default" })
          }
        >
          <DialogContent className="max-w-7xl max-h-[90vh] p-0">
            {viewer.viewMode === "pdf" && (
              <PDFViewer
                url={viewer.document.versions[0].fileUrl}
                fileName={viewer.document.name}
                annotations={annotations[viewer.document.id] || []}
                onAnnotationCreate={handleAnnotationCreate}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
                watermark={
                  viewer.document.shareSettings.watermarkEnabled
                    ? { text: "CONFIDENTIAL", opacity: 0.1 }
                    : undefined
                }
                permissions={{
                  allowPrinting: viewer.document.shareSettings.allowPrinting,
                  allowCopying: viewer.document.shareSettings.allowCopying,
                  allowAnnotations: true,
                }}
              />
            )}

            {viewer.viewMode === "image" && (
              <ImageViewer
                url={viewer.document.versions[0].fileUrl}
                fileName={viewer.document.name}
                annotations={annotations[viewer.document.id] || []}
                onAnnotationCreate={handleAnnotationCreate}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
                watermark={
                  viewer.document.shareSettings.watermarkEnabled
                    ? { text: "CONFIDENTIAL", opacity: 0.1 }
                    : undefined
                }
                permissions={{
                  allowAnnotations: true,
                  allowDownload: true,
                  allowEdit: true,
                }}
              />
            )}

            {viewer.viewMode === "text" && (
              <TextViewer
                content="// Sample code content\nfunction exitPlanning() {\n  return 'Success!';\n}"
                fileName={viewer.document.name}
                language={viewer.document.fileType}
              />
            )}

            {viewer.viewMode === "version" && (
              <div className="p-6">
                <DocumentVersionControl
                  document={viewer.document}
                  currentUser={{
                    id: userId,
                    name: "Current User",
                    email: "user@example.com",
                  }}
                  onVersionCreate={async (versionData) => {
                    console.log("Creating version:", versionData);
                    // Handle version creation
                  }}
                  onVersionRestore={async (versionId) => {
                    console.log("Restoring version:", versionId);
                    // Handle version restoration
                  }}
                  onVersionTag={async (versionId, tag) => {
                    console.log("Tagging version:", versionId, tag);
                    // Handle version tagging
                  }}
                />
              </div>
            )}

            {viewer.viewMode === "default" && (
              <DocumentViewer
                documentId={viewer.document.id}
                workspaceId={workspaceId}
                onClose={() =>
                  setViewer({
                    isOpen: false,
                    document: null,
                    viewMode: "default",
                  })
                }
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Add missing import
import { MoreVertical } from "lucide-react";
