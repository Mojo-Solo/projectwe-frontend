"use client";

import React, { useRef, useEffect } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/types/document";

interface SearchPanelProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  onResultSelect: (index: number) => void;
  onClose: () => void;
}

export function SearchPanel({
  searchQuery,
  onSearchQueryChange,
  searchResults,
  currentSearchIndex,
  onResultSelect,
  onClose,
}: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, current, focus]);

  // Scroll to current result
  useEffect(() => {
    if (resultsRef.current && searchResults.length > 0) {
      const currentElement = resultsRef.current.children[
        currentSearchIndex
      ] as HTMLElement;
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentSearchIndex, searchResults.length]);

  const navigateToPrevious = () => {
    if (searchResults.length === 0) return;
    const newIndex =
      currentSearchIndex > 0
        ? currentSearchIndex - 1
        : searchResults.length - 1;
    onResultSelect(newIndex);
  };

  const navigateToNext = () => {
    if (searchResults.length === 0) return;
    const newIndex =
      currentSearchIndex < searchResults.length - 1
        ? currentSearchIndex + 1
        : 0;
    onResultSelect(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        navigateToPrevious();
      } else {
        navigateToNext();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 text-black px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search in Document
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Find in document..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-20"
          />
          <div className="absolute right-1 top-1 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={navigateToPrevious}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={navigateToNext}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-600">
            {searchResults.length > 0 ? (
              <span>
                {currentSearchIndex + 1} of {searchResults.length} results
              </span>
            ) : (
              <span>No results found</span>
            )}
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <ScrollArea className="flex-1">
          <div ref={resultsRef} className="p-2 space-y-2">
            {searchResults.map((result, index) => (
              <button key={index}
                key={index}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentSearchIndex
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={() => onResultSelect(index)}
              >
                <div className="flex items-start justify-between mb-1">
                  <Badge variant="secondary" className="text-xs">
                    Page {result.page}
                  </Badge>
                  {index === currentSearchIndex && (
                    <Badge className="text-xs">Current</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  ...{highlightMatch(result.context, searchQuery)}...
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No matches found</p>
            <p className="text-xs mt-1">Try different keywords</p>
          </div>
        </div>
      )}

      {!searchQuery && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Enter keywords to search</p>
            <p className="text-xs mt-2 text-gray-400">
              Press Enter to go to next result
            </p>
            <p className="text-xs text-gray-400">
              Press Shift+Enter for previous
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
