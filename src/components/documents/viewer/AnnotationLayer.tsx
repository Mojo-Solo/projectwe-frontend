"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Highlighter,
  MessageSquare,
  StickyNote,
  Type,
  Trash2,
  Check,
  X,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  Annotation,
  AnnotationType,
  AnnotationStyle,
  DocumentLocation,
  User,
} from "@/types/document";

interface AnnotationLayerProps {
  annotations: Annotation[];
  currentTool: AnnotationType | null;
  pageNumber: number;
  scale: number;
  onAnnotationCreate?: (annotation: Omit<Annotation, "id">) => void;
  onAnnotationUpdate?: (id: string, annotation: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  currentUser?: User;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: AnnotationType;
}

const defaultColors = [
  "#FEF3C7", // Yellow
  "#FED7AA", // Orange
  "#FECACA", // Red
  "#DDD6FE", // Purple
  "#BFDBFE", // Blue
  "#BBF7D0", // Green
  "#FEC4DD", // Pink
];

export function AnnotationLayer({
  annotations,
  currentTool,
  pageNumber,
  scale,
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete,
  currentUser = { id: "1", name: "Current User", email: "user@example.com" },
}: AnnotationLayerProps) {
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(
    null,
  );
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(
    null,
  );
  const [tempContent, setTempContent] = useState("");
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null);
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const layerRef = useRef<HTMLDivElement>(null);

  // Handle mouse events for drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentTool || !layerRef.current) return;

    const rect = layerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (
      currentTool === "highlight" ||
      currentTool === "underline" ||
      currentTool === "strikethrough"
    ) {
      // For text selection tools, we would integrate with PDF.js text layer
      // This is a simplified version
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        createTextAnnotation(currentTool, selection.toString(), x, y);
      }
    } else if (
      ["rectangle", "ellipse", "arrow", "drawing"].includes(currentTool)
    ) {
      setDrawingState({
        isDrawing: true,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        type: currentTool,
      });
    } else if (["comment", "sticky-note", "text-box"].includes(currentTool)) {
      createPointAnnotation(currentTool, x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingState || !layerRef.current) return;

    const rect = layerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setDrawingState({
      ...drawingState,
      endX: x,
      endY: y,
    });
  };

  const handleMouseUp = () => {
    if (!drawingState || !onAnnotationCreate) return;

    const { startX, startY, endX, endY, type } = drawingState;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    if (width > 5 || height > 5) {
      onAnnotationCreate({
        documentId: "", // Will be set by parent
        versionNumber: 1, // Will be set by parent
        type,
        location: {
          page: pageNumber,
          coordinates: {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width,
            height,
          },
        },
        content: "",
        author: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolved: false,
        style: {
          color: selectedColor,
          opacity: 0.3,
          lineWidth: 2,
        },
      });
    }

    setDrawingState(null);
  };

  const createTextAnnotation = (
    type: AnnotationType,
    text: string,
    x: number,
    y: number,
  ) => {
    if (!onAnnotationCreate) return;

    onAnnotationCreate({
      documentId: "",
      versionNumber: 1,
      type,
      location: {
        page: pageNumber,
        coordinates: { x, y, width: 100, height: 20 },
      },
      content: text,
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolved: false,
      style: {
        color: selectedColor,
        opacity: 0.3,
      },
    });
  };

  const createPointAnnotation = (
    type: AnnotationType,
    x: number,
    y: number,
  ) => {
    if (!onAnnotationCreate) return;

    const id = `temp-${Date.now()}`;
    onAnnotationCreate({
      documentId: "",
      versionNumber: 1,
      type,
      location: {
        page: pageNumber,
        coordinates: { x, y, width: 200, height: 100 },
      },
      content: "",
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolved: false,
      style: {
        color: selectedColor,
        backgroundColor: selectedColor,
        opacity: 0.9,
      },
    });

    // Immediately enter edit mode for new annotations
    setTimeout(() => {
      setEditingAnnotation(id);
      setTempContent("");
    }, 100);
  };

  const updateAnnotationContent = (id: string, content: string) => {
    if (!onAnnotationUpdate) return;

    onAnnotationUpdate(id, {
      content,
      updatedAt: new Date().toISOString(),
    });

    setEditingAnnotation(null);
    setTempContent("");
  };

  const deleteAnnotation = (id: string) => {
    if (!onAnnotationDelete) return;
    onAnnotationDelete(id);
    setSelectedAnnotation(null);
  };

  const resolveAnnotation = (id: string) => {
    if (!onAnnotationUpdate) return;

    const annotation = annotations.find((a) => a.id === id);
    if (!annotation) return;

    onAnnotationUpdate(id, {
      resolved: !annotation.resolved,
      resolvedBy: annotation.resolved ? undefined : currentUser,
      resolvedAt: annotation.resolved ? undefined : new Date().toISOString(),
    });
  };

  const renderAnnotation = (annotation: Annotation) => {
    const { location, style } = annotation;
    if (!location.coordinates) return null;

    const { x, y, width, height } = location.coordinates;
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: x * scale,
      top: y * scale,
      width: width * scale,
      height: height * scale,
      pointerEvents: "auto",
      cursor: "pointer",
    };

    switch (annotation.type) {
      case "highlight":
      case "underline":
      case "strikethrough":
        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              backgroundColor: style?.color || selectedColor,
              opacity: style?.opacity || 0.3,
              ...(annotation.type === "underline" && {
                height: 2,
                top: (y + height - 2) * scale,
              }),
              ...(annotation.type === "strikethrough" && {
                height: 2,
                top: (y + height / 2) * scale,
              }),
            }}
            onClick={() => setSelectedAnnotation(annotation.id)}
            className={cn(
              "transition-opacity hover:opacity-50",
              selectedAnnotation === annotation.id && "ring-2 ring-blue-500",
            )}
          />
        );

      case "comment":
      case "sticky-note":
        return (
          <Popover
            key={annotation.id}
            open={selectedAnnotation === annotation.id}
            onOpenChange={(open) =>
              setSelectedAnnotation(open ? annotation.id : null)
            }
          >
            <PopoverTrigger asChild>
              <div
                style={{
                  ...baseStyle,
                  width: 24 * scale,
                  height: 24 * scale,
                }}
                className={cn(
                  "flex items-center justify-center rounded-full shadow-md transition-all hover:scale-110",
                  annotation.type === "comment"
                    ? "bg-blue-500"
                    : "bg-yellow-400",
                  annotation.resolved && "opacity-50",
                )}
              >
                {annotation.type === "comment" ? (
                  <MessageSquare className="h-3 w-3 text-white" />
                ) : (
                  <StickyNote className="h-3 w-3 text-gray-700" />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                      {annotation.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {annotation.author.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(annotation.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => resolveAnnotation(annotation.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {annotation.resolved ? "Unresolve" : "Resolve"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteAnnotation(annotation.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {editingAnnotation === annotation.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      placeholder="Add your comment..."
                      className="min-h-[80px]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingAnnotation(null);
                          setTempContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAnnotationContent(annotation.id, tempContent)
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => {
                      setEditingAnnotation(annotation.id);
                      setTempContent(annotation.content);
                    }}
                  >
                    {annotation.content || (
                      <span className="text-gray-400 italic">
                        Click to add comment...
                      </span>
                    )}
                  </div>
                )}

                {annotation.resolved && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Resolved by {annotation.resolvedBy?.name}
                  </div>
                )}

                {annotation.replies && annotation.replies.length > 0 && (
                  <div className="border-t pt-2 space-y-2">
                    {annotation.replies.map((reply) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {reply.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">
                              {reply.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm pl-8">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        );

      case "text-box":
        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              backgroundColor: style?.backgroundColor || "white",
              border: `1px solid ${style?.color || "#000"}`,
              padding: 4 * scale,
            }}
            onClick={() => setSelectedAnnotation(annotation.id)}
            className={cn(
              "rounded shadow-sm",
              selectedAnnotation === annotation.id && "ring-2 ring-blue-500",
            )}
          >
            {editingAnnotation === annotation.id ? (
              <Input
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onBlur={() =>
                  updateAnnotationContent(annotation.id, tempContent)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateAnnotationContent(annotation.id, tempContent);
                  }
                }}
                className="border-0 p-0 h-auto"
                style={{
                  fontSize: (style?.fontSize || 14) * scale,
                  fontFamily: style?.fontFamily || "inherit",
                }}
                autoFocus
              />
            ) : (
              <div
                style={{
                  fontSize: (style?.fontSize || 14) * scale,
                  fontFamily: style?.fontFamily || "inherit",
                }}
                onDoubleClick={() => {
                  setEditingAnnotation(annotation.id);
                  setTempContent(annotation.content);
                }}
              >
                {annotation.content || "Double-click to edit"}
              </div>
            )}
          </div>
        );

      case "rectangle":
      case "ellipse":
        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              border: `${style?.lineWidth || 2}px solid ${style?.color || "#000"}`,
              backgroundColor: "transparent",
              borderRadius: annotation.type === "ellipse" ? "50%" : 0,
            }}
            onClick={() => setSelectedAnnotation(annotation.id)}
            className={cn(
              selectedAnnotation === annotation.id && "ring-2 ring-blue-500",
            )}
          />
        );

      case "arrow":
        const angle = Math.atan2(height, width) * (180 / Math.PI);
        const length = Math.sqrt(width * width + height * height);

        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              transformOrigin: "0 50%",
              transform: `rotate(${angle}deg)`,
            }}
            onClick={() => setSelectedAnnotation(annotation.id)}
          >
            <svg
              width={length * scale}
              height={20 * scale}
              className={cn(
                selectedAnnotation === annotation.id && "filter drop-shadow-lg",
              )}
            >
              <defs>
                <marker
                  id={`arrowhead-${annotation.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={style?.color || "#000"}
                  />
                </marker>
              </defs>
              <line
                x1="0"
                y1={10 * scale}
                x2={length * scale - 10}
                y2={10 * scale}
                stroke={style?.color || "#000"}
                strokeWidth={(style?.lineWidth || 2) * scale}
                markerEnd={`url(#arrowhead-${annotation.id})`}
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  // Render current drawing state
  const renderDrawingPreview = () => {
    if (!drawingState) return null;

    const { startX, startY, endX, endY, type } = drawingState;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: x * scale,
      top: y * scale,
      width: width * scale,
      height: height * scale,
      pointerEvents: "none",
    };

    switch (type) {
      case "rectangle":
        return (
          <div
            style={{
              ...baseStyle,
              border: `2px dashed ${selectedColor}`,
            }}
          />
        );

      case "ellipse":
        return (
          <div
            style={{
              ...baseStyle,
              border: `2px dashed ${selectedColor}`,
              borderRadius: "50%",
            }}
          />
        );

      case "arrow":
        const angle =
          Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        const length = Math.sqrt(width * width + height * height);

        return (
          <div
            style={{
              position: "absolute",
              left: startX * scale,
              top: startY * scale,
              transformOrigin: "0 0",
              transform: `rotate(${angle}deg)`,
              pointerEvents: "none",
            }}
          >
            <svg width={length * scale} height={20}>
              <line
                x1="0"
                y1="10"
                x2={length * scale}
                y2="10"
                stroke={selectedColor}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ cursor: currentTool ? "crosshair" : "default" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {annotations.map(renderAnnotation)}
      {renderDrawingPreview()}

      {/* Color picker */}
      {currentTool && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 pointer-events-auto">
          <div className="flex gap-1">
            {defaultColors.map((color) => (
              <button key={index}
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  selectedColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300",
                )}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
