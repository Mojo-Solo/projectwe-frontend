"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, RefreshCw, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  logs?: string[];
  className?: string;
}

export function LogViewer({ logs = [], className }: LogViewerProps) {
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filteredLogs, setFilteredLogs] = useState<string[]>(logs);

  // Simulate real-time log streaming
  const [liveLogs, setLiveLogs] = useState<string[]>(logs);

  useEffect(() => {
    // Update filtered logs when logs or filter changes
    const filtered = liveLogs.filter((log) =>
      log.toLowerCase().includes(filter.toLowerCase()),
    );
    setFilteredLogs(filtered);
  }, [liveLogs, filter]);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (autoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [filteredLogs, autoScroll]);

  useEffect(() => {
    // Update live logs when external logs change
    setLiveLogs(logs);
  }, [logs]);

  const getLogLevel = (log: string): "info" | "warn" | "error" | "success" => {
    if (log.includes("ERROR") || log.includes("FAIL")) return "error";
    if (log.includes("WARN")) return "warn";
    if (log.includes("SUCCESS") || log.includes("PASS")) return "success";
    return "info";
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const handleClearLogs = () => {
    setLiveLogs([]);
  };

  const handleExportLogs = () => {
    const logContent = liveLogs.join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // In a real implementation, this would fetch latest logs from the server
    const newLog = `[${new Date().toLocaleTimeString()}] INFO: Logs refreshed`;
    setLiveLogs((prev) => [...prev, newLog]);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAutoScroll(!autoScroll)}
          className={cn(autoScroll && "bg-primary/10")}
          title="Toggle auto-scroll"
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          title="Refresh logs"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleExportLogs}
          title="Export logs"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleClearLogs}
          title="Clear logs"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 rounded-md border bg-muted/20 p-4"
      >
        <div className="space-y-1 font-mono text-sm">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No logs to display
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const level = getLogLevel(log);
              return (
                <div
                  key={index}
                  className={cn(
                    "py-1 px-2 rounded hover:bg-muted/50 transition-colors",
                    getLogLevelColor(level),
                  )}
                >
                  <span className="select-all">{log}</span>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {filteredLogs.length} logs
          </Badge>
          {filter && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs">Connected</span>
          </div>
          {autoScroll && (
            <Badge variant="secondary" className="text-xs">
              Auto-scroll
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
