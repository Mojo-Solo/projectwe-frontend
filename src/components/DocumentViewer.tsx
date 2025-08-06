"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  Eye,
  EyeOff,
  Share2,
  Mail,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Document {
  filename: string;
  content: string;
  type: string;
}

interface DocumentViewerProps {
  documents: Document[];
  clientName: string;
  onClose?: () => void;
}

export function DocumentViewer({
  documents,
  clientName,
  onClose,
}: DocumentViewerProps) {
  const [activeDoc, setActiveDoc] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(documents[activeDoc].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    documents.forEach((doc) => downloadDocument(doc));
  };

  const shareViaEmail = () => {
    const subject = `Exit Planning Documents for ${clientName}`;
    const body = `Please find attached the exit planning documents for ${clientName}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getDocumentIcon = (type: string) => {
    const colors: Record<string, string> = {
      summary: "text-blue-600",
      valuation: "text-green-600",
      timeline: "text-purple-600",
      tax: "text-orange-600",
      checklist: "text-red-600",
      succession: "text-indigo-600",
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Generated Exit Planning Documents</CardTitle>
            <CardDescription>
              {documents.length} personalized documents for {clientName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareViaEmail}>
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-1" />
              Download All
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Document List */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <button key={index}
                  key={index}
                  onClick={() => setActiveDoc(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeDoc === index
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText
                      className={`h-5 w-5 mt-0.5 ${getDocumentIcon(doc.type)}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">
                        {doc.filename.replace(/_/g, " ").replace(".md", "")}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Viewer */}
          <div className="md:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {documents[activeDoc]?.filename
                      .replace(/_/g, " ")
                      .replace(".md", "")}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setViewMode(
                          viewMode === "preview" ? "source" : "preview",
                        )
                      }
                    >
                      {viewMode === "preview" ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {viewMode === "preview" ? "Source" : "Preview"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadDocument(documents[activeDoc])}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full">
                  {viewMode === "preview" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {documents[activeDoc]?.content || ""}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {documents[activeDoc]?.content || ""}
                    </pre>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
