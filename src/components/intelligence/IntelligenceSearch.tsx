"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Search,
  Loader2,
  Filter,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChatQuery, ChatResponse, SearchResult } from "@/lib/intelligence-api";

interface SearchFilters {
  namespace: "mojosolo-transcripts" | "exit-planning-documents" | "all";
  dateRange: "week" | "month" | "quarter" | "year" | "all";
  confidenceThreshold: number;
  includeInsights: boolean;
}

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  results: number;
  confidence: number;
}

interface IntelligenceSearchProps {
  onResultSelect?: (result: any) => void;
  defaultNamespace?: "mojosolo-transcripts" | "exit-planning-documents";
  showFilters?: boolean;
  className?: string;
}

export function IntelligenceSearch({
  onResultSelect,
  defaultNamespace = "exit-planning-documents",
  showFilters = true,
  className = "",
}: IntelligenceSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    namespace: defaultNamespace,
    dateRange: "all",
    confidenceThreshold: 70,
    includeInsights: true,
  });
  const [searchMode, setSearchMode] = useState<"search" | "chat">("search");
  const [showHistory, setShowHistory] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Debounced search effect
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setChatResponse(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]);

  const performSearch = useCallback(async () => {
    if (!query.trim() || query.length < 3) return;

    setIsSearching(true);
    const startTime = Date.now();

    try {
      const searchQuery: ChatQuery = {
        query: query.trim(),
        namespace:
          filters.namespace === "all"
            ? "exit-planning-documents"
            : filters.namespace,
        context_window: 10,
        include_insights: filters.includeInsights,
        filters: {
          confidence_threshold: filters.confidenceThreshold / 100,
          date_range:
            filters.dateRange !== "all" ? filters.dateRange : undefined,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_URL}/api/v1/intelligence/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key":
              process.env.NEXT_PUBLIC_ML_API_KEY || "dev-api-key-2025",
          },
          body: JSON.stringify(searchQuery),
        },
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      const processingTime = Date.now() - startTime;

      if (searchMode === "chat") {
        setChatResponse(data);
        setResults([]);
      } else {
        // Convert chat response to search results format
        const searchResults: SearchResult[] =
          data.sources?.map((source, index) => ({
            id: source.id,
            content: source.snippet,
            metadata: {
              title: source.title,
              relevance_score: source.relevance_score,
              confidence: data.confidence,
              ...source.metadata,
            },
            score: source.relevance_score,
          })) || [];

        setResults(searchResults);
        setChatResponse(null);
      }

      // Add to search history
      const historyItem: SearchHistoryItem = {
        query: query.trim(),
        timestamp: new Date(),
        results: data.sources?.length || 0,
        confidence: data.confidence,
      };

      setSearchHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 searches

      // Show success feedback
      if (processingTime < 2000) {
        toast({
          title: "Search completed",
          description: `Found ${data.sources?.length || 0} results in ${processingTime}ms`,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setResults([]);
      setChatResponse(null);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, searchMode, toast]);

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 70) return "text-blue-600 bg-blue-50";
    if (confidence >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle key={index} className="h-3 w-3" />;
    if (confidence >= 70) return <TrendingUp className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search exit planning intelligence..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-12"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowHistory(!showHistory)}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <Card className="absolute z-10 w-full mt-1">
          <CardContent className="p-2">
            <div className="text-sm font-medium mb-2">Recent Searches</div>
            {searchHistory.map((item, index) => (
              <div key={index}
                key={index}
                className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => {
                  setQuery(item.query);
                  setShowHistory(false);
                }}
              >
                <span className="text-sm truncate">{item.query}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.results} results
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getConfidenceColor(item.confidence)}`}
                  >
                    {Math.round(item.confidence)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Mode and Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={searchMode}
            onValueChange={(value) => setSearchMode(value as "search" | "chat")}
          >
            <TabsList>
              <TabsTrigger value="search">Search Results</TabsTrigger>
              <TabsTrigger value="chat">AI Analysis</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={filters.namespace}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, namespace: value as any }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="exit-planning-documents">
                Exit Planning Docs
              </SelectItem>
              <SelectItem value="mojosolo-transcripts">
                MojoSolo Transcripts
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, dateRange: value as any }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Min Confidence: {filters.confidenceThreshold}%
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {query.length >= 3 && (
        <div className="space-y-4">
          {/* Chat Response */}
          {chatResponse && searchMode === "chat" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>AI Analysis</span>
                  <Badge
                    variant="outline"
                    className={`${getConfidenceColor(chatResponse.confidence)}`}
                  >
                    {getConfidenceIcon(chatResponse.confidence)}
                    {Math.round(chatResponse.confidence)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  {chatResponse.response}
                </div>

                {chatResponse.insights && chatResponse.insights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Insights</h4>
                    {chatResponse.insights.map((insight, index) => (
                      <div key={index}
                        key={index}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{insight.title}</h5>
                          <Badge variant="outline">{insight.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                        <Progress
                          value={insight.confidence}
                          className="mt-2 h-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {chatResponse.sources && chatResponse.sources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Sources</h4>
                    <div className="grid gap-2">
                      {chatResponse.sources.map((source, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium text-sm">
                              {source.title}
                            </h6>
                            <Badge variant="secondary">
                              {Math.round(source.relevance_score * 100)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {results.length > 0 && searchMode === "search" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Search Results ({results.length})
                </h3>
                <Badge variant="outline">
                  Response time: {chatResponse?.processing_time || 0}ms
                </Badge>
              </div>

              {results.map((result, index) => (
                <Card key={index}
                  key={result.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {result.metadata.title || `Result ${index + 1}`}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${getConfidenceColor(result.metadata.confidence || 0)}`}
                      >
                        {getConfidenceIcon(result.metadata.confidence || 0)}
                        {Math.round(result.metadata.confidence || 0)}%
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {result.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <Progress
                        value={result.score * 100}
                        className="flex-1 h-1 mr-3"
                      />
                      <span className="text-xs text-muted-foreground">
                        Relevance: {Math.round(result.score * 100)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isSearching &&
            query.length >= 3 &&
            results.length === 0 &&
            !chatResponse && (
              <Card>
                <CardContent className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      )}

      {/* Empty State */}
      {query.length < 3 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">
              Search Exit Planning Intelligence
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter at least 3 characters to start searching through exit
              planning documents and insights
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
