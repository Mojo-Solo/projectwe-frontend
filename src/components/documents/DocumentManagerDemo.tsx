"use client";

import React, { useState } from "react";
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
  Clock,
  GitBranch,
  Shield,
  MoreVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DocumentManagerDemoProps {
  workspaceId: string;
  userId: string;
  className?: string;
}

// Mock document data
const mockDocuments = [
  {
    id: "1",
    name: "Exit Strategy Document.pdf",
    fileType: "pdf",
    fileSize: 2547200, // 2.4 MB
    category: "strategy",
    mimeType: "application/pdf",
    isEncrypted: true,
    tags: ["exit-planning", "strategy", "confidential"],
    description: "Comprehensive exit strategy documentation",
    updatedAt: "2024-01-15",
    currentVersion: 3,
    versions: [{ id: "v1", fileUrl: "/api/demo/exit-strategy.pdf" }],
  },
  {
    id: "2",
    name: "Financial Statements Q4.xlsx",
    fileType: "xlsx",
    fileSize: 1234567,
    category: "financial",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isEncrypted: false,
    tags: ["financial", "q4", "statements"],
    description: "Q4 financial statements and analysis",
    updatedAt: "2024-01-10",
    currentVersion: 1,
    versions: [{ id: "v1", fileUrl: "/api/demo/financial-q4.xlsx" }],
  },
  {
    id: "3",
    name: "Market Analysis Report.pdf",
    fileType: "pdf",
    fileSize: 3456789,
    category: "analysis",
    mimeType: "application/pdf",
    isEncrypted: true,
    tags: ["market", "analysis", "research"],
    description: "Comprehensive market analysis and competitor research",
    updatedAt: "2024-01-08",
    currentVersion: 2,
    versions: [{ id: "v1", fileUrl: "/api/demo/market-analysis.pdf" }],
  },
  {
    id: "4",
    name: "Legal Documents Package.zip",
    fileType: "zip",
    fileSize: 5678901,
    category: "legal",
    mimeType: "application/zip",
    isEncrypted: true,
    tags: ["legal", "contracts", "compliance"],
    description: "Complete legal documentation package",
    updatedAt: "2024-01-05",
    currentVersion: 1,
    versions: [{ id: "v1", fileUrl: "/api/demo/legal-package.zip" }],
  },
  {
    id: "5",
    name: "Business Valuation.pdf",
    fileType: "pdf",
    fileSize: 1876543,
    category: "valuation",
    mimeType: "application/pdf",
    isEncrypted: true,
    tags: ["valuation", "assessment", "financial"],
    description: "Professional business valuation report",
    updatedAt: "2024-01-03",
    currentVersion: 4,
    versions: [{ id: "v1", fileUrl: "/api/demo/business-valuation.pdf" }],
  },
  {
    id: "6",
    name: "Due Diligence Checklist.docx",
    fileType: "docx",
    fileSize: 234567,
    category: "process",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    isEncrypted: false,
    tags: ["due-diligence", "checklist", "process"],
    description: "Comprehensive due diligence checklist",
    updatedAt: "2024-01-01",
    currentVersion: 2,
    versions: [{ id: "v1", fileUrl: "/api/demo/due-diligence.docx" }],
  },
];

export function DocumentManagerDemo({
  workspaceId,
  userId,
  className,
}: DocumentManagerDemoProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState<any>(null);
  const [viewerDialog, setViewerDialog] = useState<any>(null);

  // Filter documents
  const filteredDocuments = mockDocuments
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      const matchesFileType = selectedFileType === "all" || doc.fileType === selectedFileType;
      return matchesSearch && matchesCategory && matchesFileType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "size":
          comparison = a.fileSize - b.fileSize;
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const categories = ["all", ...new Set(mockDocuments.map((d) => d.category))];
  const fileTypes = ["all", ...new Set(mockDocuments.map((d) => d.fileType))];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
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
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger id="sortOrder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm text-gray-600">
              {filteredDocuments.length} of {mockDocuments.length} documents
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFileType("all");
                setSortBy("date");
                setSortOrder("desc");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocuments.map((document) => (
          <Card key={index}
            key={document.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setViewerDialog(document)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
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
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Versions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-medium mb-1 line-clamp-1">{document.name}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {formatBytes(document.fileSize)} • {document.fileType.toUpperCase()}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{format(new Date(document.updatedAt), "MMM d, yyyy")}</span>
              <div className="flex items-center gap-2">
                {document.isEncrypted && <Shield className="h-3 w-3" />}
                {document.currentVersion > 1 && (
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

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload documents to your exit planning workspace (Demo Mode)
            </DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-gray-600">This is a demo - uploads are not actually processed</p>
            <Button className="mt-4" onClick={() => setUploadDialog(false)}>
              Close Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {shareDialog && (
        <Dialog open={true} onOpenChange={() => setShareDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Document</DialogTitle>
              <DialogDescription>
                Share &quot;{shareDialog.name}&quot; with team members (Demo Mode)
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 text-center">
              <Share2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Document Sharing</p>
              <p className="text-gray-600 mb-4">
                In the full version, you can share documents with specific permissions,
                set expiration dates, and track access.
              </p>
              <Button onClick={() => setShareDialog(null)}>Close Demo</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Viewer Dialog */}
      {viewerDialog && (
        <Dialog open={true} onOpenChange={() => setViewerDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Document Viewer</DialogTitle>
              <DialogDescription>
                Viewing &quot;{viewerDialog.name}&quot; (Demo Mode)
              </DialogDescription>
            </DialogHeader>
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Document Viewer Demo</p>
                <p className="text-gray-600 mb-4">
                  In the full version, you would see the actual document with:
                </p>
                <ul className="text-sm text-gray-600 text-left inline-block">
                  <li>• PDF rendering with zoom and navigation</li>
                  <li>• Annotation tools (highlights, comments, drawings)</li>
                  <li>• Text search and highlighting</li>
                  <li>• Version comparison and history</li>
                  <li>• Real-time collaboration features</li>
                </ul>
                <Button className="mt-4" onClick={() => setViewerDialog(null)}>
                  Close Viewer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}