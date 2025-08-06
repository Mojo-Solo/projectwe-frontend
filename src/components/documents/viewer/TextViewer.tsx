"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Copy,
  Search,
  ZoomIn,
  ZoomOut,
  Printer,
  Maximize2,
  FileText,
  Code,
  Hash,
  WrapText,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
  coldarkCold,
  coldarkDark,
  atomDark,
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface TextViewerProps {
  content: string;
  fileName: string;
  language?: string;
  onDownload?: () => void;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rb: "ruby",
  java: "java",
  cpp: "cpp",
  c: "c",
  cs: "csharp",
  php: "php",
  go: "go",
  rs: "rust",
  swift: "swift",
  kt: "kotlin",
  scala: "scala",
  r: "r",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  ps1: "powershell",
  json: "json",
  xml: "xml",
  html: "html",
  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  ini: "ini",
  md: "markdown",
  markdown: "markdown",
  txt: "text",
  log: "log",
  csv: "csv",
};

const themes = {
  light: {
    vs: vs,
    oneLight: oneLight,
    coldarkCold: coldarkCold,
  },
  dark: {
    oneDark: oneDark,
    vscDarkPlus: vscDarkPlus,
    atomDark: atomDark,
    coldarkDark: coldarkDark,
  },
};

export function TextViewer({
  content,
  fileName,
  language,
  onDownload,
  readOnly = true,
  showLineNumbers: initialShowLineNumbers = true,
  theme = "light",
  className,
}: TextViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = useState(
    initialShowLineNumbers,
  );
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [selectedTheme, setSelectedTheme] = useState(
    theme === "light" ? "vs" : "oneDark",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ line: number; column: number; match: string }>
  >([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Detect language from file extension
  const detectedLanguage =
    language ||
    languageMap[fileName.split(".").pop()?.toLowerCase() || ""] ||
    "text";

  // Calculate line count
  const lines = content.split("\n");
  const lineCount = lines.length;

  // Search functionality
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const results: typeof searchResults = [];
    const regex = new RegExp(searchQuery, "gi");

    lines.forEach((line, lineIndex) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        results.push({
          line: lineIndex + 1,
          column: match.index + 1,
          match: match[0],
        });
      }
    });

    setSearchResults(results);
    setCurrentSearchIndex(0);
  }, [searchQuery, content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "f":
            e.preventDefault();
            document.getElementById("search-input")?.focus();
            break;
          case "c":
            if (!window.getSelection()?.toString()) {
              e.preventDefault();
              handleCopy();
            }
            break;
          case "+":
          case "=":
            e.preventDefault();
            setFontSize((prev) => Math.min(prev + 2, 32));
            break;
          case "-":
            e.preventDefault();
            setFontSize((prev) => Math.max(prev - 2, 10));
            break;
          case "s":
            e.preventDefault();
            handleDownload();
            break;
        }
      } else if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; }
              .line-number { color: #999; margin-right: 1em; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateSearch = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return;

    if (direction === "next") {
      setCurrentSearchIndex((prev) => (prev + 1) % searchResults.length);
    } else {
      setCurrentSearchIndex(
        (prev) => (prev - 1 + searchResults.length) % searchResults.length,
      );
    }
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const getWordCount = () => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCurrentThemeStyle = () => {
    const themeGroup = theme === "light" ? themes.light : themes.dark;
    return (
      themeGroup[selectedTheme as keyof typeof themeGroup] ||
      (theme === "light" ? vs : oneDark)
    );
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col h-full bg-white",
          isFullscreen && "fixed inset-0 z-50",
          className,
        )}
      >
        {/* Toolbar */}
        <div className="border-b px-4 py-2 flex items-center justify-between gap-4">
          {/* File info */}
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">{fileName}</h3>
              <p className="text-xs text-gray-500">
                {lineCount} lines • {getWordCount()} words •{" "}
                {getCharacterCount()} characters
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-20 h-8 w-64"
              />
              {searchResults.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {currentSearchIndex + 1}/{searchResults.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigateSearch("prev")}
                  >
                    <ChevronDown className="h-3 w-3 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigateSearch("next")}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View options */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showLineNumbers}
                  onPressedChange={setShowLineNumbers}
                  size="sm"
                  variant="outline"
                >
                  <Hash className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Toggle line numbers</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={wordWrap}
                  onPressedChange={setWordWrap}
                  size="sm"
                  variant="outline"
                >
                  <WrapText className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Toggle word wrap</TooltipContent>
            </Tooltip>

            {/* Font size */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFontSize((prev) => Math.max(prev - 2, 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-10 text-center">{fontSize}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFontSize((prev) => Math.min(prev + 2, 32))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Theme selector */}
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs">VS</SelectItem>
                <SelectItem value="oneLight">One Light</SelectItem>
                <SelectItem value="coldarkCold">Coldark Cold</SelectItem>
                <SelectItem value="oneDark">One Dark</SelectItem>
                <SelectItem value="vscDarkPlus">VS Code Dark</SelectItem>
                <SelectItem value="atomDark">Atom Dark</SelectItem>
                <SelectItem value="coldarkDark">Coldark Dark</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied!" : "Copy all"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div
            className={cn(
              "min-h-full",
              wordWrap ? "whitespace-pre-wrap" : "whitespace-pre",
            )}
          >
            {detectedLanguage !== "text" ? (
              <SyntaxHighlighter
                language={detectedLanguage}
                style={getCurrentThemeStyle()}
                showLineNumbers={showLineNumbers}
                lineNumberStyle={{ minWidth: "3em" }}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  fontSize: `${fontSize}px`,
                  background: "transparent",
                }}
                wrapLines={wordWrap}
                wrapLongLines={wordWrap}
              >
                {content}
              </SyntaxHighlighter>
            ) : (
              <div
                className="p-4 font-mono"
                style={{ fontSize: `${fontSize}px` }}
              >
                {showLineNumbers ? (
                  <div className="flex">
                    <div className="text-gray-500 select-none pr-4 text-right">
                      {lines.map((_, index) => (
                        <div key={index}>{index + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1">
                      {lines.map((line, index) => (
                        <div key={index}>{line || "\n"}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  content
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
