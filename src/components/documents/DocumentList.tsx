"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Share2,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Lock,
  Folder,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentViewer } from "./DocumentViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  name: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  category: string;
  isEncrypted: boolean;
  folderId?: string;
  owner: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  lastAccessedAt?: string;
  thumbnail?: string;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  documentCount: number;
  totalSize: number;
}

interface DocumentListProps {
  workspaceId: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  financial: "bg-green-100 text-green-800",
  legal: "bg-purple-100 text-purple-800",
  operational: "bg-blue-100 text-blue-800",
  strategic: "bg-orange-100 text-orange-800",
  hr: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
};

export function DocumentList({ workspaceId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set(),
  );
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [workspaceId, currentFolderId, selectedCategory]);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(currentFolderId && { folderId: currentFolderId }),
      });

      const response = await fetch(
        `/api/workspaces/${workspaceId}/documents?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to load documents");

      const data = await response.json();
      setDocuments(data.documents);

      // Load folders for current directory
      // This would be a separate API call in a real implementation
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return FileSpreadsheet;
    }
    if (mimeType.startsWith("image/")) {
      return FileImage;
    }
    if (mimeType.includes("pdf") || mimeType.includes("word")) {
      return FileText;
    }
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSelectDocument = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map((d) => d.id)));
    }
  };

  const handleBulkDownload = async () => {
    // Implementation for bulk download
    toast({
      title: "Downloading",
      description: `Downloading ${selectedDocuments.size} documents...`,
    });
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (searchQuery) {
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [documents, searchQuery]);

  return (
    <div key={index} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Documents</h2>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedDocuments.size} document
              {selectedDocuments.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleBulkDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Document List/Grid */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No documents found</p>
              <Button onClick={() => setShowUploadDialog(true)}>
                Upload your first document
              </Button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {/* Folders */}
            {folders.map((folder) => (
              <Card key={index}
                key={folder.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentFolderId(folder.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <Folder className="h-10 w-10 text-blue-500" />
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <h3 className="font-medium truncate">{folder.name}</h3>
                <p className="text-sm text-gray-500">
                  {folder.documentCount} documents
                </p>
              </Card>
            ))}

            {/* Documents */}
            {filteredDocuments.map((doc) => {
              const Icon = getFileIcon(doc.mimeType);
              return (
                <Card key={index}
                  key={doc.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => setViewingDocument(doc.id)}
                >
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedDocuments.has(doc.id)}
                      onCheckedChange={() => handleSelectDocument(doc.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <Icon className="h-10 w-10 text-gray-400" />
                    <div className="flex items-center space-x-1">
                      {doc.isEncrypted && (
                        <Lock className="h-4 w-4 text-yellow-500" />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <h3 className="font-medium truncate mb-1">{doc.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatFileSize(doc.fileSize)}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.other}`}
                  >
                    {doc.category}
                  </Badge>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="divide-y">
            {filteredDocuments.map((doc) => {
              const Icon = getFileIcon(doc.mimeType);
              return (
                <div key={index}
                  key={doc.id}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setViewingDocument(doc.id)}
                >
                  <Checkbox
                    checked={selectedDocuments.has(doc.id)}
                    onCheckedChange={() => handleSelectDocument(doc.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-4"
                  />

                  <Icon className="h-8 w-8 text-gray-400 mr-4" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      {doc.isEncrypted && (
                        <Lock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{doc.owner.name}</span>
                      <span>•</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`ml-4 ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.other}`}
                  >
                    {doc.category}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="ml-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <DocumentUpload
            workspaceId={workspaceId}
            folderId={currentFolderId}
            onUploadComplete={() => {
              setShowUploadDialog(false);
              loadDocuments();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      {viewingDocument && (
        <Dialog
          open={!!viewingDocument}
          onOpenChange={() => setViewingDocument(null)}
        >
          <DialogContent className="max-w-7xl h-[90vh] p-0">
            <DocumentViewer
              documentId={viewingDocument}
              workspaceId={workspaceId}
              onClose={() => setViewingDocument(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
