"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  Settings,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DocumentVersion, VersionChange } from "@/types/document";
import { diffLines, diffWords, diffChars, Change } from "diff";

interface DiffViewerProps {
  leftVersion: DocumentVersion;
  rightVersion: DocumentVersion;
  documentName: string;
  onClose?: () => void;
}

interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
}

type DiffMode = "split" | "unified" | "inline";
type DiffGranularity = "line" | "word" | "char";

export function DiffViewer({
  leftVersion,
  rightVersion,
  documentName,
  onClose,
}: DiffViewerProps) {
  const [diffMode, setDiffMode] = useState<DiffMode>("split");
  const [diffGranularity, setDiffGranularity] =
    useState<DiffGranularity>("line");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showUnchanged, setShowUnchanged] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(),
  );
  const [leftContent, setLeftContent] = useState<string>("");
  const [rightContent, setRightContent] = useState<string>("");
  const [differences, setDifferences] = useState<Change[]>([]);
  const [stats, setStats] = useState<DiffStats>({
    additions: 0,
    deletions: 0,
    modifications: 0,
    unchanged: 0,
  });

  // Load content (simulated - in real app would fetch from API)
  useEffect(() => {
    // Simulate loading content
    const loadContent = async () => {
      // In real implementation, fetch content from version URLs
      setLeftContent(`Document Version ${leftVersion.versionNumber} Content

This is the content of the left version.
Some lines will be the same.
This line will be removed.
Common content here.
More common content.`);

      setRightContent(`Document Version ${rightVersion.versionNumber} Content

This is the content of the right version.
Some lines will be the same.
This line was added.
Common content here.
More common content.
This line was also added.`);
    };

    loadContent();
  }, [leftVersion, rightVersion]);

  // Calculate differences
  useEffect(() => {
    if (!leftContent || !rightContent) return;

    let diffs: Change[] = [];

    switch (diffGranularity) {
      case "line":
        diffs = diffLines(leftContent, rightContent);
        break;
      case "word":
        diffs = diffWords(leftContent, rightContent);
        break;
      case "char":
        diffs = diffChars(leftContent, rightContent);
        break;
    }

    setDifferences(diffs);

    // Calculate stats
    const stats: DiffStats = {
      additions: 0,
      deletions: 0,
      modifications: 0,
      unchanged: 0,
    };

    diffs.forEach((diff) => {
      if (diff.added) {
        stats.additions += diff.count || 1;
      } else if (diff.removed) {
        stats.deletions += diff.count || 1;
      } else {
        stats.unchanged += diff.count || 1;
      }
    });

    // Estimate modifications (paired add/remove)
    stats.modifications = Math.min(stats.additions, stats.deletions);
    stats.additions -= stats.modifications;
    stats.deletions -= stats.modifications;

    setStats(stats);
  }, [leftContent, rightContent, diffGranularity]);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const renderSplitView = () => {
    const leftLines: Array<{
      content: string;
      type: "removed" | "unchanged" | "empty";
      lineNumber: number;
    }> = [];
    const rightLines: Array<{
      content: string;
      type: "added" | "unchanged" | "empty";
      lineNumber: number;
    }> = [];

    let leftLineNum = 1;
    let rightLineNum = 1;

    differences.forEach((diff, index) => {
      const lines = diff.value.split("\n").filter((line) => line !== "");

      if (diff.removed) {
        lines.forEach((line) => {
          leftLines.push({
            content: line,
            type: "removed",
            lineNumber: leftLineNum++,
          });
          rightLines.push({ content: "", type: "empty", lineNumber: -1 });
        });
      } else if (diff.added) {
        lines.forEach((line) => {
          leftLines.push({ content: "", type: "empty", lineNumber: -1 });
          rightLines.push({
            content: line,
            type: "added",
            lineNumber: rightLineNum++,
          });
        });
      } else {
        lines.forEach((line) => {
          leftLines.push({
            content: line,
            type: "unchanged",
            lineNumber: leftLineNum++,
          });
          rightLines.push({
            content: line,
            type: "unchanged",
            lineNumber: rightLineNum++,
          });
        });
      }
    });

    return (
      <div className="flex h-full">
        <div className="flex-1 border-r">
          <div className="sticky top-0 bg-gray-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Version {leftVersion.versionNumber}
              </span>
              <Badge variant="secondary">{leftVersion.uploadedBy.name}</Badge>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="font-mono text-sm">
              {leftLines.map((line, index) => (
                <div key={index}
                  key={index}
                  className={cn(
                    "flex",
                    line.type === "removed" && "bg-red-50",
                    line.type === "empty" && "bg-gray-50",
                    !showUnchanged && line.type === "unchanged" && "hidden",
                  )}
                >
                  {showLineNumbers && (
                    <div className="w-12 px-2 py-1 text-gray-500 text-right border-r bg-gray-50">
                      {line.lineNumber > 0 ? line.lineNumber : ""}
                    </div>
                  )}
                  <div className="flex-1 px-4 py-1 whitespace-pre-wrap">
                    {line.type === "removed" && (
                      <span className="text-red-700">- {line.content}</span>
                    )}
                    {line.type === "unchanged" && line.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1">
          <div className="sticky top-0 bg-gray-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Version {rightVersion.versionNumber}
              </span>
              <Badge variant="secondary">{rightVersion.uploadedBy.name}</Badge>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="font-mono text-sm">
              {rightLines.map((line, index) => (
                <div key={index}
                  key={index}
                  className={cn(
                    "flex",
                    line.type === "added" && "bg-green-50",
                    line.type === "empty" && "bg-gray-50",
                    !showUnchanged && line.type === "unchanged" && "hidden",
                  )}
                >
                  {showLineNumbers && (
                    <div className="w-12 px-2 py-1 text-gray-500 text-right border-r bg-gray-50">
                      {line.lineNumber > 0 ? line.lineNumber : ""}
                    </div>
                  )}
                  <div className="flex-1 px-4 py-1 whitespace-pre-wrap">
                    {line.type === "added" && (
                      <span className="text-green-700">+ {line.content}</span>
                    )}
                    {line.type === "unchanged" && line.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  const renderUnifiedView = () => {
    const lines: Array<{
      content: string;
      type: "added" | "removed" | "unchanged";
      leftLineNumber: number;
      rightLineNumber: number;
    }> = [];

    let leftLineNum = 1;
    let rightLineNum = 1;

    differences.forEach((diff) => {
      const diffLines = diff.value.split("\n").filter((line) => line !== "");

      if (diff.removed) {
        diffLines.forEach((line) => {
          lines.push({
            content: line,
            type: "removed",
            leftLineNumber: leftLineNum++,
            rightLineNumber: -1,
          });
        });
      } else if (diff.added) {
        diffLines.forEach((line) => {
          lines.push({
            content: line,
            type: "added",
            leftLineNumber: -1,
            rightLineNumber: rightLineNum++,
          });
        });
      } else {
        diffLines.forEach((line) => {
          lines.push({
            content: line,
            type: "unchanged",
            leftLineNumber: leftLineNum++,
            rightLineNumber: rightLineNum++,
          });
        });
      }
    });

    return (
      <ScrollArea className="h-[600px]">
        <div className="font-mono text-sm">
          {lines.map((line, index) => (
            <div key={index}
              key={index}
              className={cn(
                "flex",
                line.type === "added" && "bg-green-50",
                line.type === "removed" && "bg-red-50",
                !showUnchanged && line.type === "unchanged" && "hidden",
              )}
            >
              {showLineNumbers && (
                <>
                  <div className="w-12 px-2 py-1 text-gray-500 text-right border-r bg-gray-50">
                    {line.leftLineNumber > 0 ? line.leftLineNumber : ""}
                  </div>
                  <div className="w-12 px-2 py-1 text-gray-500 text-right border-r bg-gray-50">
                    {line.rightLineNumber > 0 ? line.rightLineNumber : ""}
                  </div>
                </>
              )}
              <div className="flex-1 px-4 py-1 whitespace-pre-wrap">
                {line.type === "added" && (
                  <span className="text-green-700">+ {line.content}</span>
                )}
                {line.type === "removed" && (
                  <span className="text-red-700">- {line.content}</span>
                )}
                {line.type === "unchanged" && line.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderInlineView = () => {
    return (
      <ScrollArea className="h-[600px]">
        <div className="font-mono text-sm p-4">
          {differences.map((diff, index) => {
            if (diff.added) {
              return (
                <span key={index} className="bg-green-100 text-green-800">
                  {diff.value}
                </span>
              );
            } else if (diff.removed) {
              return (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 line-through"
                >
                  {diff.value}
                </span>
              );
            } else {
              return <span key={index}>{diff.value}</span>;
            }
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-white rounded-lg border shadow-sm",
          isFullscreen && "fixed inset-0 z-50",
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {documentName} - Version Comparison
              </h3>
              <p className="text-sm text-gray-600">
                Comparing version {leftVersion.versionNumber} with version{" "}
                {rightVersion.versionNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Plus className="h-3 w-3 mr-1" />
                {stats.additions} additions
              </Badge>
              <Badge variant="secondary">
                <Minus className="h-3 w-3 mr-1" />
                {stats.deletions} deletions
              </Badge>
              <Badge variant="secondary">
                <RefreshCw className="h-3 w-3 mr-1" />
                {stats.modifications} modifications
              </Badge>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <Select
                value={diffMode}
                onValueChange={(value) => setDiffMode(value as DiffMode)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">Split</SelectItem>
                  <SelectItem value="unified">Unified</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Granularity */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Compare by:</span>
              <Select
                value={diffGranularity}
                onValueChange={(value) =>
                  setDiffGranularity(value as DiffGranularity)
                }
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="char">Character</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Options */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showLineNumbers}
                  onPressedChange={setShowLineNumbers}
                  size="sm"
                  variant="outline"
                >
                  #
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Toggle line numbers</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showUnchanged}
                  onPressedChange={setShowUnchanged}
                  size="sm"
                  variant="outline"
                >
                  {showUnchanged ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                {showUnchanged ? "Hide" : "Show"} unchanged lines
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Diff
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden">
          {diffMode === "split" && renderSplitView()}
          {diffMode === "unified" && renderUnifiedView()}
          {diffMode === "inline" && renderInlineView()}
        </div>

        {/* Footer with changes summary */}
        {leftVersion.changes && rightVersion.changes && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <details className="cursor-pointer">
              <summary className="text-sm font-medium">Change Summary</summary>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">
                    Version {leftVersion.versionNumber} Changes:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    {leftVersion.changes.map((change, i) => (
                      <li key={i} key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {change.type}
                        </Badge>
                        <span>
                          {change.location.section ||
                            `Page ${change.location.page}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">
                    Version {rightVersion.versionNumber} Changes:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    {rightVersion.changes.map((change, i) => (
                      <li key={i} key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {change.type}
                        </Badge>
                        <span>
                          {change.location.section ||
                            `Page ${change.location.page}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
