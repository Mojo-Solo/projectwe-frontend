"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  insights?: Insight[];
  timestamp: Date;
}

interface Insight {
  type: "risk" | "opportunity" | "pattern" | "action";
  title: string;
  description: string;
  confidence: number;
  metadata?: Record<string, any>;
}

interface NLPChatInterfaceProps {
  namespace?: "mojosolo-transcripts" | "exit-planning-documents";
  apiEndpoint?: string;
  onInsightFound?: (insight: Insight) => void;
}

export function NLPChatInterface({
  namespace = "mojosolo-transcripts",
  apiEndpoint = "http://localhost:8000/api/v1/intelligence/query",
  onInsightFound,
}: NLPChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Example queries for user guidance
  const exampleQueries =
    namespace === "exit-planning-documents"
      ? [
          "How do I value my business for exit?",
          "What are succession planning best practices?",
          "Show me exit planning frameworks",
          "What increases business valuation?",
          "How long does exit planning take?",
        ]
      : [
          "Which clients are at risk of churning?",
          "Show me all brief clarity issues",
          "Find high-value opportunities",
          "What are the main client concerns?",
          "Analyze sentiment trends",
        ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "dev-api-key-2025",
        },
        body: JSON.stringify({
          query: input,
          namespaces: [namespace],
          context_window: 10,
          include_insights: true,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        insights: data.insights,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Notify parent component of insights
      data.insights?.forEach((insight: Insight) => {
        onInsightFound?.(insight);
      });
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInsight = (insight: Insight) => {
    const icons = {
      risk: <AlertTriangle className="h-4 w-4" />,
      opportunity: <TrendingUp className="h-4 w-4" />,
      pattern: <Sparkles className="h-4 w-4" />,
      action: <Users className="h-4 w-4" />,
    };

    const colors = {
      risk: "destructive",
      opportunity: "default",
      pattern: "secondary",
      action: "outline",
    } as const;

    return (
      <Card key={insight.title} className="mt-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icons[insight.type]}
              <CardTitle className="text-sm">{insight.title}</CardTitle>
            </div>
            <Badge variant={colors[insight.type]}>
              {Math.round(insight.confidence * 100)}% confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          {insight.metadata && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(insight.metadata).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold">
          {namespace === "exit-planning-documents"
            ? "Exit Planning Expert"
            : "MojoSolo Intelligence"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {namespace === "mojosolo-transcripts"
            ? "Analyzing 1,691 meeting transcripts for client insights"
            : "Expert knowledge from 103 Julie Keyes documents"}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                {namespace === "exit-planning-documents"
                  ? "Ask questions about exit planning, valuation, and succession strategies. Try these:"
                  : "Ask questions to uncover insights from your meeting data. Try these examples:"}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              {exampleQueries.map((query) => (
                <Button key={index}
                  key={query}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => setInput(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={index}
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.insights && message.insights.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.insights.map(renderInsight)}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
