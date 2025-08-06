"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Bot,
  User,
  Loader2,
  DollarSign,
  Activity,
  FileText,
  Mic,
  Download,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAgent, AgentMessage, AVAILABLE_AGENTS } from "@/types/ai";
import WebSocketService from "@/lib/websocket";
import AIApiService from "@/lib/ai-api";
import { AIService } from "@/lib/ai/service";
import { MicroAgentOrchestrator } from "@/lib/ai/micro-agents";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface AIChatInterfaceProps {
  onInsightGenerated?: (insight: any) => void;
  initialContext?: any;
  selectedAgents?: string[];
}

export function AIChatInterface({
  onInsightGenerated,
  initialContext,
  selectedAgents = ["strategy"],
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState<string[]>(selectedAgents);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocketService | null>(null);
  const apiRef = useRef<AIApiService | null>(null);
  const aiServiceRef = useRef<AIService | null>(null);
  const microAgentsRef = useRef<MicroAgentOrchestrator | null>(null);

  useEffect(() => {
    // Initialize API service
    apiRef.current = new AIApiService();

    // Initialize AI service with both providers
    aiServiceRef.current = new AIService({
      openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
      defaultProvider: "openai",
      enableCache: true,
      cacheTimeout: 300000, // 5 minutes
      circuitBreakerOptions: {
        failureThreshold: 3,
        recoveryTimeout: 60000, // 1 minute
      },
    });

    // Initialize micro-agents
    if (aiServiceRef.current) {
      microAgentsRef.current = new MicroAgentOrchestrator(aiServiceRef.current);
    }

    // Initialize WebSocket connection
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    wsRef.current = new WebSocketService(wsUrl);

    // Set up WebSocket handlers
    const unsubscribeMessage = wsRef.current.onMessage((response) => {
      if (response.type === "message") {
        setMessages((prev) => [...prev, response.data as AgentMessage]);

        // Update cost and token tracking
        if (response.data.metadata) {
          setTotalCost((prev) => prev + (response.data.metadata.cost || 0));
          setTotalTokens((prev) => prev + (response.data.metadata.tokens || 0));
        }
      } else if (response.type === "complete") {
        setIsLoading(false);
        if (onInsightGenerated && response.data.insight) {
          onInsightGenerated(response.data.insight);
        }
      }
    });

    const unsubscribeStatus = wsRef.current.onStatus((status) => {
      setConnectionStatus(status);
    });

    const unsubscribeError = wsRef.current.onError((error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    });

    // Connect WebSocket
    wsRef.current.connect();

    // Create initial conversation
    initializeConversation();

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      unsubscribeError();
      wsRef.current?.disconnect();
    };
  }, []);

  const initializeConversation = async () => {
    try {
      const context = await apiRef.current!.createConversation(activeAgents);
      setConversationId(context.conversationId);

      // Send initial context if provided
      if (initialContext) {
        await sendMessage(
          `I need help with: ${JSON.stringify(initialContext)}`,
        );
      }
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || !conversationId) return;

    // Add user message immediately
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      agentId: "user",
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send via WebSocket for streaming
      if (wsRef.current?.isConnected) {
        wsRef.current.send({
          type: "message",
          conversationId,
          message: text,
          agents: activeAgents,
        });
      } else {
        // Fallback to HTTP API
        const response = await apiRef.current!.sendMessage(
          conversationId,
          text,
        );
        setMessages((prev) => [...prev, response]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    setActiveAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId],
    );
  };

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const exportConversation = () => {
    const data = {
      conversationId,
      messages,
      totalCost,
      totalTokens,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${conversationId}.json`;
    a.click();
  };

  const shareConversation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WE-Exit AI Conversation",
          text: "Check out this AI-powered exit planning conversation",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const getAgentIcon = (agentId: string) => {
    const agent = AVAILABLE_AGENTS.find((a) => a.id === agentId);
    return agent?.icon || "Bot";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
            <Badge
              variant={
                connectionStatus === "connected" ? "default" : "secondary"
              }
            >
              {connectionStatus}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />${totalCost.toFixed(4)}
            <Activity className="w-4 h-4 ml-2" />
            {totalTokens} tokens
          </div>
        </div>

        <Tabs defaultValue="chat" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="agents">
              Agents ({activeAgents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={index}
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role !== "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      {message.role !== "user" && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {AVAILABLE_AGENTS.find(
                            (a) => a.id === message.agentId,
                          )?.name || "AI Assistant"}
                        </div>
                      )}

                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  {...(props || {})}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...(props || {})}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {message.metadata && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {message.metadata.tokens &&
                            `${message.metadata.tokens} tokens`}
                          {message.metadata.cost &&
                            ` • $${message.metadata.cost.toFixed(4)}`}
                          {message.metadata.duration &&
                            ` • ${message.metadata.duration}ms`}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is thinking...
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                disabled={isRecording}
              >
                <Mic className={cn("w-4 h-4", isRecording && "text-red-500")} />
              </Button>

              <Input
                placeholder="Ask about exit strategies, valuations, timelines..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                disabled={isLoading}
                className="flex-1"
              />

              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={exportConversation}
                disabled={messages.length === 0}
              >
                <Download className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={shareConversation}
                disabled={messages.length === 0}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_AGENTS.map((agent) => (
                <Card key={index}
                  key={agent.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    activeAgents.includes(agent.id) && "ring-2 ring-primary",
                  )}
                  onClick={() => toggleAgent(agent.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {agent.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {agent.specialization}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
