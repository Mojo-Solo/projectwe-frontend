"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCw,
  Search,
  Download,
  Printer,
  Maximize2,
  Grid,
  FileText,
  Highlighter,
  MessageSquare,
  StickyNote,
  PenTool,
  Type,
  Square,
  Circle,
  ArrowUpRight,
  Bookmark,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  Annotation,
  AnnotationType,
  ViewMode,
  SearchResult,
  DocumentLocation,
} from "@/types/document";
import { AnnotationLayer } from "./AnnotationLayer";
import { ThumbnailPanel } from "./ThumbnailPanel";
import { SearchPanel } from "./SearchPanel";
import { BookmarkPanel } from "./BookmarkPanel";
import "react-pdf/src/Page/AnnotationLayer.css";
import "react-pdf/src/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  fileName: string;
  annotations?: Annotation[];
  onAnnotationCreate?: (annotation: Omit<Annotation, "id">) => void;
  onAnnotationUpdate?: (id: string, annotation: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  watermark?: {
    text: string;
    opacity: number;
  };
  permissions?: {
    allowPrinting: boolean;
    allowCopying: boolean;
    allowAnnotations: boolean;
  };
  initialPage?: number;
  initialScale?: number;
  className?: string;
}

export function PDFViewer({
  url,
  fileName,
  annotations = [],
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete,
  onPageChange,
  onDownload,
  onPrint,
  watermark,
  permissions = {
    allowPrinting: true,
    allowCopying: true,
    allowAnnotations: true,
  },
  initialPage = 1,
  initialScale = 1.0,
  className,
}: PDFViewerProps) {
  // State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("single-page");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<AnnotationType | null>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [bookmarks, setBookmarks] = useState<
    Array<{ page: number; label: string }>
  >([]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<any>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "f":
            e.preventDefault();
            setShowSearch(true);
            break;
          case "p":
            if (permissions.allowPrinting) {
              e.preventDefault();
              handlePrint();
            }
            break;
          case "s":
            e.preventDefault();
            handleDownload();
            break;
          case "+":
          case "=":
            e.preventDefault();
            zoomIn();
            break;
          case "-":
            e.preventDefault();
            zoomOut();
            break;
          case "0":
            e.preventDefault();
            setScale(1.0);
            break;
        }
      } else {
        switch (e.key) {
          case "ArrowLeft":
            previousPage();
            break;
          case "ArrowRight":
            nextPage();
            break;
          case "Home":
            setPageNumber(1);
            break;
          case "End":
            if (numPages) setPageNumber(numPages);
            break;
          case "f":
            if (e.shiftKey) {
              toggleFullscreen();
            }
            break;
          case "Escape":
            if (isFullscreen) {
              toggleFullscreen();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, isFullscreen, permissions.allowPrinting]);

  // Page navigation
  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  const goToPage = (page: number) => {
    setPageNumber(Math.max(1, Math.min(page, numPages || 1)));
  };

  // Zoom controls
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const fitToWidth = () => {
    if (containerRef.current && pageSize.width) {
      const containerWidth = containerRef.current.clientWidth;
      const padding = showThumbnails ? 280 : 80; // Account for sidebars
      setScale((containerWidth - padding) / pageSize.width);
    }
  };

  const fitToPage = () => {
    if (containerRef.current && pageSize.width && pageSize.height) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const padding = showThumbnails ? 280 : 80;
      const widthScale = (containerWidth - padding) / pageSize.width;
      const heightScale = (containerHeight - 120) / pageSize.height; // Account for toolbar
      setScale(Math.min(widthScale, heightScale));
    }
  };

  // Rotation
  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Download and print
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Search functionality
  const performSearch = useCallback(
    async (query: string) => {
      if (!query || !documentRef.current) {
        setSearchResults([]);
        return;
      }

      const results: SearchResult[] = [];
      const pdf = documentRef.current;

      for (let i = 1; i <= numPages!; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .toLowerCase();

        const regex = new RegExp(query.toLowerCase(), "gi");
        let match;

        while ((match = regex.exec(text)) !== null) {
          results.push({
            page: i,
            text: match[0],
            location: {
              page: i,
              paragraph: 0, // Would need more complex logic for exact positioning
            } as DocumentLocation,
            context: text.substring(
              Math.max(0, match.index - 50),
              Math.min(text.length, match.index + query.length + 50),
            ),
          });
        }
      }

      setSearchResults(results);
      if (results.length > 0) {
        setCurrentSearchIndex(0);
        goToPage(results[0].page);
      }
    },
    [numPages],
  );

  // Bookmark management
  const addBookmark = (page: number, label: string) => {
    setBookmarks((prev) => [...prev, { page, label }]);
  };

  const removeBookmark = (page: number) => {
    setBookmarks((prev) => prev.filter((b) => b.page !== page));
  };

  const isBookmarked = (page: number) => {
    return bookmarks.some((b) => b.page === page);
  };

  // Document callbacks
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  const onPageLoadSuccess = (page: any) => {
    setPageSize({
      width: page.width,
      height: page.height,
    });
  };

  // Effect for page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  }, [pageNumber, onPageChange]);

  // Effect for search
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  return (
    <TooltipProvider key={index}>
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col h-full bg-gray-100",
          isFullscreen && "fixed inset-0 z-50",
          className,
        )}
      >
        {/* Toolbar */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goToPage(1)}
                  disabled={pageNumber === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First page</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page (←)</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-center"
              />
              <span className="text-sm text-gray-600">
                of {numPages || "-"}
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextPage}
                  disabled={pageNumber >= (numPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page (→)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goToPage(numPages || 1)}
                  disabled={pageNumber === numPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last page</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out (Ctrl+-)</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 w-32">
              <Slider
                value={[scale * 100]}
                onValueChange={([value]) => setScale(value / 100)}
                min={50}
                max={300}
                step={10}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in (Ctrl++)</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Fit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={fitToPage}>
                  Fit to page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={fitToWidth}>
                  Fit to width
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScale(0.5)}>
                  50%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScale(0.75)}>
                  75%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScale(1.0)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScale(2.0)}>
                  200%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showThumbnails}
                  onPressedChange={setShowThumbnails}
                  size="sm"
                >
                  <Grid className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Toggle thumbnails</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={rotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode("single-page")}>
                  Single page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("continuous")}>
                  Continuous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("two-page")}>
                  Two page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("presentation")}>
                  Presentation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Annotation tools */}
          {permissions.allowAnnotations && (
            <>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "highlight"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "highlight" : null)
                      }
                      size="sm"
                    >
                      <Highlighter className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Highlight text</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "comment"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "comment" : null)
                      }
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Add comment</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "sticky-note"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "sticky-note" : null)
                      }
                      size="sm"
                    >
                      <StickyNote className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Add sticky note</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <PenTool className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedTool("drawing")}
                    >
                      Free draw
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedTool("text-box")}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Text box
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedTool("arrow")}>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Arrow
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedTool("rectangle")}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Rectangle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedTool("ellipse")}
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Ellipse
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isBookmarked(pageNumber)) {
                      removeBookmark(pageNumber);
                    } else {
                      addBookmark(pageNumber, `Page ${pageNumber}`);
                    }
                  }}
                >
                  {isBookmarked(pageNumber) ? (
                    <Bookmark className="h-4 w-4 fill-current" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked(pageNumber) ? "Remove bookmark" : "Add bookmark"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showBookmarks}
                  onPressedChange={setShowBookmarks}
                  size="sm"
                >
                  <Bookmark className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Show bookmarks</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={showSearch}
                  onPressedChange={setShowSearch}
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Search (Ctrl+F)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download (Ctrl+S)</TooltipContent>
            </Tooltip>

            {permissions.allowPrinting && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print (Ctrl+P)</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen (Shift+F)</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thumbnails panel */}
          {showThumbnails && (
            <ThumbnailPanel
              documentUrl={url}
              numPages={numPages || 0}
              currentPage={pageNumber}
              onPageSelect={goToPage}
            />
          )}

          {/* Document viewer */}
          <div className="flex-1 overflow-auto bg-gray-200 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Failed to load PDF</p>
                  <p className="text-sm text-gray-600">{error.message}</p>
                </div>
              </div>
            )}

            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className={cn(
                "flex justify-center",
                viewMode === "continuous" && "flex-col items-center gap-4 py-4",
              )}
              inputRef={documentRef}
            >
              {viewMode === "single-page" && (
                <div className="relative">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    renderTextLayer={permissions.allowCopying}
                    renderAnnotationLayer={true}
                    onLoadSuccess={onPageLoadSuccess}
                    className="shadow-lg"
                  />
                  {watermark && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{
                        opacity: watermark.opacity,
                        transform: `rotate(-45deg)`,
                      }}
                    >
                      <p className="text-6xl font-bold text-gray-400">
                        {watermark.text}
                      </p>
                    </div>
                  )}
                  {permissions.allowAnnotations && (
                    <AnnotationLayer
                      annotations={annotations.filter(
                        (a) => a.location.page === pageNumber,
                      )}
                      currentTool={selectedTool}
                      pageNumber={pageNumber}
                      scale={scale}
                      onAnnotationCreate={onAnnotationCreate}
                      onAnnotationUpdate={onAnnotationUpdate}
                      onAnnotationDelete={onAnnotationDelete}
                    />
                  )}
                </div>
              )}

              {viewMode === "continuous" && numPages && (
                <>
                  {Array.from({ length: numPages }, (_, i) => i + 1).map(
                    (page) => (
                      <div key={page} className="relative">
                        <Page
                          pageNumber={page}
                          scale={scale}
                          rotate={rotation}
                          renderTextLayer={permissions.allowCopying}
                          renderAnnotationLayer={true}
                          className="shadow-lg"
                        />
                        {watermark && (
                          <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{
                              opacity: watermark.opacity,
                              transform: `rotate(-45deg)`,
                            }}
                          >
                            <p className="text-6xl font-bold text-gray-400">
                              {watermark.text}
                            </p>
                          </div>
                        )}
                        {permissions.allowAnnotations && (
                          <AnnotationLayer
                            annotations={annotations.filter(
                              (a) => a.location.page === page,
                            )}
                            currentTool={selectedTool}
                            pageNumber={page}
                            scale={scale}
                            onAnnotationCreate={onAnnotationCreate}
                            onAnnotationUpdate={onAnnotationUpdate}
                            onAnnotationDelete={onAnnotationDelete}
                          />
                        )}
                      </div>
                    ),
                  )}
                </>
              )}

              {viewMode === "two-page" && numPages && (
                <div className="flex gap-4">
                  {pageNumber % 2 === 0 && pageNumber > 1 && (
                    <div className="relative">
                      <Page
                        pageNumber={pageNumber - 1}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={permissions.allowCopying}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                      />
                      {permissions.allowAnnotations && (
                        <AnnotationLayer
                          annotations={annotations.filter(
                            (a) => a.location.page === pageNumber - 1,
                          )}
                          currentTool={selectedTool}
                          pageNumber={pageNumber - 1}
                          scale={scale}
                          onAnnotationCreate={onAnnotationCreate}
                          onAnnotationUpdate={onAnnotationUpdate}
                          onAnnotationDelete={onAnnotationDelete}
                        />
                      )}
                    </div>
                  )}
                  <div className="relative">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      renderTextLayer={permissions.allowCopying}
                      renderAnnotationLayer={true}
                      className="shadow-lg"
                    />
                    {permissions.allowAnnotations && (
                      <AnnotationLayer
                        annotations={annotations.filter(
                          (a) => a.location.page === pageNumber,
                        )}
                        currentTool={selectedTool}
                        pageNumber={pageNumber}
                        scale={scale}
                        onAnnotationCreate={onAnnotationCreate}
                        onAnnotationUpdate={onAnnotationUpdate}
                        onAnnotationDelete={onAnnotationDelete}
                      />
                    )}
                  </div>
                  {pageNumber < numPages && (
                    <div className="relative">
                      <Page
                        pageNumber={pageNumber + 1}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={permissions.allowCopying}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                      />
                      {permissions.allowAnnotations && (
                        <AnnotationLayer
                          annotations={annotations.filter(
                            (a) => a.location.page === pageNumber + 1,
                          )}
                          currentTool={selectedTool}
                          pageNumber={pageNumber + 1}
                          scale={scale}
                          onAnnotationCreate={onAnnotationCreate}
                          onAnnotationUpdate={onAnnotationUpdate}
                          onAnnotationDelete={onAnnotationDelete}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </Document>
          </div>

          {/* Side panels */}
          {showSearch && (
            <SearchPanel
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              searchResults={searchResults}
              currentSearchIndex={currentSearchIndex}
              onResultSelect={(index) => {
                setCurrentSearchIndex(index);
                goToPage(searchResults[index].page);
              }}
              onClose={() => setShowSearch(false)}
            />
          )}

          {showBookmarks && (
            <BookmarkPanel
              bookmarks={bookmarks}
              onBookmarkSelect={(page) => goToPage(page)}
              onBookmarkRemove={removeBookmark}
              onClose={() => setShowBookmarks(false)}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
