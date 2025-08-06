"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThumbnailPanelProps {
  documentUrl: string;
  numPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  onClose?: () => void;
}

export function ThumbnailPanel({
  documentUrl,
  numPages,
  currentPage,
  onPageSelect,
  onClose,
}: ThumbnailPanelProps) {
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const thumbnailWidth = 150;

  // Load pages progressively
  useEffect(() => {
    const loadPage = (page: number) => {
      setLoadedPages((prev) => new Set(prev).add(page));
    };

    // Load current page and nearby pages first
    loadPage(currentPage);
    if (currentPage > 1) loadPage(currentPage - 1);
    if (currentPage < numPages) loadPage(currentPage + 1);

    // Load other pages progressively
    const timer = setTimeout(() => {
      for (let i = 1; i <= numPages; i++) {
        if (!loadedPages.has(i)) {
          setTimeout(() => loadPage(i), (i - 1) * 100);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPage, numPages, loadedPages]);

  return (
    <div className="w-64 bg-gray-50 border-r flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Pages</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          <Document file={documentUrl} loading={null}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <div key={index}
                  key={pageNumber}
                  className={cn(
                    "relative cursor-pointer transition-all rounded-lg overflow-hidden group",
                    "hover:shadow-md",
                    currentPage === pageNumber &&
                      "ring-2 ring-blue-500 shadow-md",
                  )}
                  onClick={() => onPageSelect(pageNumber)}
                >
                  <div className="relative bg-white">
                    {loadedPages.has(pageNumber) ? (
                      <Page
                        pageNumber={pageNumber}
                        width={thumbnailWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    ) : (
                      <div
                        className="bg-gray-100 animate-pulse"
                        style={{
                          width: thumbnailWidth,
                          height: thumbnailWidth * 1.414, // A4 aspect ratio
                        }}
                      />
                    )}
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent",
                        "text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity",
                      )}
                    >
                      Page {pageNumber}
                    </div>
                  </div>
                </div>
              ),
            )}
          </Document>
        </div>
      </ScrollArea>
    </div>
  );
}
