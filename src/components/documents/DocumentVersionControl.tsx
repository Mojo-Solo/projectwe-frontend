"use client";

import React, { useState } from "react";
import {
  Clock,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  User,
  Calendar,
  FileText,
  Download,
  Eye,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Tag,
  MessageSquare,
  Diff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type {
  Document,
  DocumentVersion,
  VersionChange,
  User as UserType,
} from "@/types/document";
import { DiffViewer } from "./viewer/DiffViewer";
import { format, formatDistanceToNow } from "date-fns";

interface DocumentVersionControlProps {
  document: Document;
  currentUser: UserType;
  onVersionCreate?: (versionData: Partial<DocumentVersion>) => Promise<void>;
  onVersionRestore?: (versionId: string) => Promise<void>;
  onVersionTag?: (versionId: string, tag: string) => Promise<void>;
  onBranchCreate?: (branchName: string, fromVersion: string) => Promise<void>;
  onMerge?: (sourceBranch: string, targetBranch: string) => Promise<void>;
  className?: string;
}

interface Branch {
  id: string;
  name: string;
  baseVersion: string;
  currentVersion: string;
  createdBy: UserType;
  createdAt: string;
  isProtected: boolean;
  lastActivity: string;
}

interface VersionComparisonState {
  leftVersion: string;
  rightVersion: string;
  showDiff: boolean;
}

export function DocumentVersionControl({
  document,
  currentUser,
  onVersionCreate,
  onVersionRestore,
  onVersionTag,
  onBranchCreate,
  onMerge,
  className,
}: DocumentVersionControlProps) {
  const [selectedVersion, setSelectedVersion] =
    useState<DocumentVersion | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(
    new Set(),
  );
  const [createVersionDialog, setCreateVersionDialog] = useState(false);
  const [versionComment, setVersionComment] = useState("");
  const [versionTag, setVersionTag] = useState("");
  const [autoVersion, setAutoVersion] = useState(true);
  const [restoreConfirm, setRestoreConfirm] = useState<DocumentVersion | null>(
    null,
  );
  const [comparison, setComparison] = useState<VersionComparisonState>({
    leftVersion: "",
    rightVersion: "",
    showDiff: false,
  });
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      name: "main",
      baseVersion: "1",
      currentVersion: document.currentVersion.toString(),
      createdBy: document.owner,
      createdAt: document.createdAt,
      isProtected: true,
      lastActivity: new Date().toISOString(),
    },
  ]);
  const [currentBranch, setCurrentBranch] = useState("main");
  const { toast } = useToast();

  const toggleVersionExpansion = (versionNumber: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionNumber)) {
      newExpanded.delete(versionNumber);
    } else {
      newExpanded.add(versionNumber);
    }
    setExpandedVersions(newExpanded);
  };

  const handleCreateVersion = async () => {
    if (!onVersionCreate) return;

    try {
      await onVersionCreate({
        comments: versionComment,
        tags: versionTag ? [versionTag] : [],
      });

      toast({
        title: "Version created",
        description: `Version ${document.currentVersion + 1} has been created successfully.`,
      });

      setCreateVersionDialog(false);
      setVersionComment("");
      setVersionTag("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive",
      });
    }
  };

  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!onVersionRestore) return;

    try {
      await onVersionRestore(version.versionId);

      toast({
        title: "Version restored",
        description: `Document has been restored to version ${version.versionNumber}.`,
      });

      setRestoreConfirm(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore version",
        variant: "destructive",
      });
    }
  };

  const handleTagVersion = async (version: DocumentVersion, tag: string) => {
    if (!onVersionTag) return;

    try {
      await onVersionTag(version.versionId, tag);

      toast({
        title: "Tag added",
        description: `Tag "${tag}" has been added to version ${version.versionNumber}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleCreateBranch = async (
    branchName: string,
    fromVersion: string,
  ) => {
    if (!onBranchCreate) return;

    try {
      await onBranchCreate(branchName, fromVersion);

      const newBranch: Branch = {
        id: Date.now().toString(),
        name: branchName,
        baseVersion: fromVersion,
        currentVersion: fromVersion,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        isProtected: false,
        lastActivity: new Date().toISOString(),
      };

      setBranches([...branches, newBranch]);
      setCurrentBranch(branchName);

      toast({
        title: "Branch created",
        description: `Branch "${branchName}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const renderVersionTimeline = () => {
    const sortedVersions = [...document.versions].sort(
      (a, b) => b.versionNumber - a.versionNumber,
    );

    return (
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-4">
          {sortedVersions.map((version, index) => {
            const isExpanded = expandedVersions.has(version.versionNumber);
            const isCurrent = version.versionNumber === document.currentVersion;
            const isSelected =
              selectedVersion?.versionNumber === version.versionNumber;

            return (
              <div key={version.versionNumber} className="relative">
                {/* Timeline line */}
                {index < sortedVersions.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                )}

                <Card
                  className={cn(
                    "transition-all",
                    isSelected && "ring-2 ring-blue-500",
                    isCurrent && "border-green-500",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center",
                            isCurrent ? "bg-green-100" : "bg-gray-100",
                          )}
                        >
                          <GitCommit
                            className={cn(
                              "h-6 w-6",
                              isCurrent ? "text-green-600" : "text-gray-600",
                            )}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              Version {version.versionNumber}
                            </h3>
                            {isCurrent && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                            {version.tags?.map((tag) => (
                              <Badge key={index}
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(version.uploadedAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleVersionExpansion(version.versionNumber)
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Author info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={version.uploadedBy.avatar} />
                            <AvatarFallback>
                              {version.uploadedBy.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">
                              {version.uploadedBy.name}
                            </p>
                            <p className="text-gray-500">
                              {version.uploadedBy.email}
                            </p>
                          </div>
                        </div>

                        {/* Version details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">
                              {(version.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                              {format(new Date(version.uploadedAt), "PPp")}
                            </p>
                          </div>
                        </div>

                        {/* Comments */}
                        {version.comments && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                              <p className="text-sm text-gray-700">
                                {version.comments}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Changes */}
                        {version.changes && version.changes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Changes
                            </h4>
                            <div className="space-y-1">
                              {version.changes.map((change, i) => (
                                <div key={i}
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      change.type === "addition" &&
                                        "text-green-600 border-green-600",
                                      change.type === "deletion" &&
                                        "text-red-600 border-red-600",
                                      change.type === "modification" &&
                                        "text-blue-600 border-blue-600",
                                    )}
                                  >
                                    {change.type}
                                  </Badge>
                                  <span className="text-gray-600">
                                    {change.location.section ||
                                      `Page ${change.location.page}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Digital signature */}
                        {version.signature && (
                          <div className="flex items-center gap-2 text-sm">
                            <Shield
                              className={cn(
                                "h-4 w-4",
                                version.signature.isValid
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            />
                            <span
                              className={
                                version.signature.isValid
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              Digitally signed by {version.signature.signerName}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVersion(version)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = version.fileUrl;
                              link.download = `${document.name}_v${version.versionNumber}`;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          {!isCurrent && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRestoreConfirm(version)}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setComparison({
                                leftVersion: version.versionId,
                                rightVersion: document.versions[0].versionId,
                                showDiff: true,
                              });
                            }}
                          >
                            <Diff className="h-4 w-4 mr-2" />
                            Compare
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  const renderBranchView = () => {
    return (
      <div className="p-4 space-y-4">
        {/* Current branch selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-gray-600" />
            <Select value={currentBranch} onValueChange={setCurrentBranch}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.name}>
                    <div className="flex items-center gap-2">
                      {branch.name}
                      {branch.isProtected && (
                        <Shield className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <GitBranch className="h-4 w-4 mr-2" />
                New Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Branch</DialogTitle>
                <DialogDescription>
                  Create a new branch from the current version to work on
                  changes independently.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="branch-name">Branch Name</Label>
                  <Input
                    id="branch-name"
                    placeholder="feature/new-section"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="base-version">Base Version</Label>
                  <Select defaultValue={document.currentVersion.toString()}>
                    <SelectTrigger id="base-version" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {document.versions.map((version) => (
                        <SelectItem key={index}
                          key={version.versionNumber}
                          value={version.versionNumber.toString()}
                        >
                          Version {version.versionNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() =>
                    handleCreateBranch(
                      "feature/new-section",
                      document.currentVersion.toString(),
                    )
                  }
                >
                  Create Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Branch list */}
        <div className="space-y-3">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{branch.name}</CardTitle>
                      {branch.isProtected && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Protected
                        </Badge>
                      )}
                      {branch.name === currentBranch && (
                        <Badge className="text-xs">Active</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      Created by {branch.createdBy.name} •{" "}
                      {formatDistanceToNow(new Date(branch.createdAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {branch.name !== "main" &&
                      branch.name !== currentBranch && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentBranch(branch.name)}
                        >
                          Switch
                        </Button>
                      )}
                    {branch.name !== "main" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <GitMerge className="h-4 w-4 mr-2" />
                            Merge
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Merge Branch</DialogTitle>
                            <DialogDescription>
                              Merge &quot;{branch.name}&quot; into another
                              branch.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="target-branch">
                                Target Branch
                              </Label>
                              <Select defaultValue="main">
                                <SelectTrigger
                                  id="target-branch"
                                  className="mt-1"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {branches
                                    .filter((b) => b.name !== branch.name)
                                    .map((b) => (
                                      <SelectItem key={b.id} value={b.name}>
                                        {b.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="merge-message">
                                Merge Message
                              </Label>
                              <Textarea
                                id="merge-message"
                                placeholder="Describe the changes being merged..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => onMerge?.(branch.name, "main")}
                            >
                              Merge Branch
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>
                    Base: Version {branch.baseVersion} → Current: Version{" "}
                    {branch.currentVersion}
                  </p>
                  <p className="mt-1">
                    Last activity:{" "}
                    {formatDistanceToNow(new Date(branch.lastActivity), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Version Control</h2>
          <p className="text-gray-600">
            Manage document versions, branches, and collaboration
          </p>
        </div>
        <Dialog
          open={createVersionDialog}
          onOpenChange={setCreateVersionDialog}
        >
          <DialogTrigger asChild>
            <Button>
              <GitCommit className="h-4 w-4 mr-2" />
              Create Version
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Version</DialogTitle>
              <DialogDescription>
                Save the current state of the document as a new version.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="version-comment">Version Comment</Label>
                <Textarea
                  id="version-comment"
                  placeholder="Describe the changes in this version..."
                  value={versionComment}
                  onChange={(e) => setVersionComment(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="version-tag">Tag (optional)</Label>
                <Input
                  id="version-tag"
                  placeholder="e.g., final-draft, reviewed"
                  value={versionTag}
                  onChange={(e) => setVersionTag(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-version"
                  checked={autoVersion}
                  onCheckedChange={(checked) =>
                    setAutoVersion(checked as boolean)
                  }
                />
                <Label htmlFor="auto-version" className="text-sm font-normal">
                  Enable automatic versioning for future changes
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateVersionDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateVersion}>Create Version</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="branches">
            <GitBranch className="h-4 w-4 mr-2" />
            Branches
          </TabsTrigger>
          <TabsTrigger value="compare">
            <Diff className="h-4 w-4 mr-2" />
            Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {renderVersionTimeline()}
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          {renderBranchView()}
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="left-version">Left Version</Label>
                <Select
                  value={comparison.leftVersion}
                  onValueChange={(value) =>
                    setComparison({ ...comparison, leftVersion: value })
                  }
                >
                  <SelectTrigger id="left-version" className="mt-1">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {document.versions.map((version) => (
                      <SelectItem key={index}
                        key={version.versionId}
                        value={version.versionId}
                      >
                        Version {version.versionNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="right-version">Right Version</Label>
                <Select
                  value={comparison.rightVersion}
                  onValueChange={(value) =>
                    setComparison({ ...comparison, rightVersion: value })
                  }
                >
                  <SelectTrigger id="right-version" className="mt-1">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {document.versions.map((version) => (
                      <SelectItem key={index}
                        key={version.versionId}
                        value={version.versionId}
                      >
                        Version {version.versionNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() =>
                    setComparison({ ...comparison, showDiff: true })
                  }
                  disabled={!comparison.leftVersion || !comparison.rightVersion}
                >
                  Compare
                </Button>
              </div>
            </div>

            {comparison.showDiff &&
              comparison.leftVersion &&
              comparison.rightVersion && (
                <DiffViewer
                  leftVersion={
                    document.versions.find(
                      (v) => v.versionId === comparison.leftVersion,
                    )!
                  }
                  rightVersion={
                    document.versions.find(
                      (v) => v.versionId === comparison.rightVersion,
                    )!
                  }
                  documentName={document.name}
                />
              )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Restore confirmation dialog */}
      <AlertDialog
        open={!!restoreConfirm}
        onOpenChange={() => setRestoreConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore the document to version{" "}
              {restoreConfirm?.versionNumber}? This will create a new version
              with the content from the selected version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                restoreConfirm && handleRestoreVersion(restoreConfirm)
              }
            >
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
