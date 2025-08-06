"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Move,
  Square,
  Circle,
  ArrowUpRight,
  Type,
  Pencil,
  Trash2,
  RefreshCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Annotation, AnnotationType } from "@/types/document";
import { AnnotationLayer } from "./AnnotationLayer";

interface ImageViewerProps {
  url: string;
  fileName: string;
  annotations?: Annotation[];
  onAnnotationCreate?: (annotation: Omit<Annotation, "id">) => void;
  onAnnotationUpdate?: (id: string, annotation: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  onDownload?: () => void;
  watermark?: {
    text: string;
    opacity: number;
  };
  permissions?: {
    allowAnnotations: boolean;
    allowDownload: boolean;
    allowEdit: boolean;
  };
  className?: string;
}

interface Transform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
}

export function ImageViewer({
  url,
  fileName,
  annotations = [],
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete,
  onDownload,
  watermark,
  permissions = {
    allowAnnotations: true,
    allowDownload: true,
    allowEdit: true,
  },
  className,
}: ImageViewerProps) {
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    translateX: 0,
    translateY: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AnnotationType | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image and get dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setIsLoading(false);
    };
    img.onerror = () => {
      setError("Failed to load image");
      setIsLoading(false);
    };
    img.src = url;
  }, [url]);

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
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
            fitToWindow();
            break;
          case "s":
            if (permissions.allowDownload) {
              e.preventDefault();
              handleDownload();
            }
            break;
        }
      } else {
        switch (e.key) {
          case "r":
            rotate();
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
            setSelectedTool(null);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, permissions.allowDownload]);

  // Zoom controls
  const zoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.2, 5) }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.1),
    }));
  };

  const fitToWindow = () => {
    if (
      imageSize.width &&
      imageSize.height &&
      containerSize.width &&
      containerSize.height
    ) {
      const scaleX = (containerSize.width - 100) / imageSize.width;
      const scaleY = (containerSize.height - 100) / imageSize.height;
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(scaleX, scaleY),
        translateX: 0,
        translateY: 0,
      }));
    }
  };

  const actualSize = () => {
    setTransform((prev) => ({
      ...prev,
      scale: 1,
      translateX: 0,
      translateY: 0,
    }));
  };

  // Rotation and flip
  const rotate = () => {
    setTransform((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const flipHorizontal = () => {
    setTransform((prev) => ({ ...prev, flipX: !prev.flipX }));
  };

  const flipVertical = () => {
    setTransform((prev) => ({ ...prev, flipY: !prev.flipY }));
  };

  const reset = () => {
    setTransform({
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,
      translateX: 0,
      translateY: 0,
    });
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

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - transform.translateX,
        y: e.clientY - transform.translateY,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        translateX: e.clientX - panStart.x,
        translateY: e.clientY - panStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale + delta)),
      }));
    }
  };

  // Download
  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      // Apply transformations and download
      if (canvasRef.current && imageRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imageRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.save();

        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((transform.rotation * Math.PI) / 180);
        if (transform.flipX) ctx.scale(-1, 1);
        if (transform.flipY) ctx.scale(1, -1);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(img, 0, 0);

        // Add watermark if present
        if (watermark) {
          ctx.globalAlpha = watermark.opacity;
          ctx.font = "48px Arial";
          ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
          ctx.textAlign = "center";
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.fillText(watermark.text, 0, 0);
          ctx.restore();
        }

        ctx.restore();

        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const getTransformStyle = (): React.CSSProperties => {
    return {
      transform: `
        translate(${transform.translateX}px, ${transform.translateY}px)
        scale(${transform.scale})
        rotate(${transform.rotation}deg)
        scaleX(${transform.flipX ? -1 : 1})
        scaleY(${transform.flipY ? -1 : 1})
      `,
      transformOrigin: "center center",
      transition: isPanning ? "none" : "transform 0.2s ease-out",
      cursor: isPanning ? "grabbing" : selectedTool ? "crosshair" : "grab",
    };
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col h-full bg-gray-100",
          isFullscreen && "fixed inset-0 z-50",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Toolbar */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between gap-4">
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
                value={[transform.scale * 100]}
                onValueChange={([value]) =>
                  setTransform((prev) => ({ ...prev, scale: value / 100 }))
                }
                min={10}
                max={500}
                step={10}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {Math.round(transform.scale * 100)}%
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
                <DropdownMenuItem onClick={fitToWindow}>
                  Fit to window
                </DropdownMenuItem>
                <DropdownMenuItem onClick={actualSize}>
                  Actual size (100%)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setTransform((prev) => ({ ...prev, scale: 0.5 }))
                  }
                >
                  50%
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setTransform((prev) => ({ ...prev, scale: 2 }))
                  }
                >
                  200%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Transform controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={rotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate 90° (R)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={flipHorizontal}>
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flip horizontal</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={flipVertical}>
                  <FlipVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flip vertical</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset transformations</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Annotation tools */}
          {permissions.allowAnnotations && (
            <>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "rectangle"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "rectangle" : null)
                      }
                      size="sm"
                    >
                      <Square className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Rectangle</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "ellipse"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "ellipse" : null)
                      }
                      size="sm"
                    >
                      <Circle className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Ellipse</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "arrow"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "arrow" : null)
                      }
                      size="sm"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Arrow</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "text-box"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "text-box" : null)
                      }
                      size="sm"
                    >
                      <Type className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Text</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={selectedTool === "drawing"}
                      onPressedChange={(pressed) =>
                        setSelectedTool(pressed ? "drawing" : null)
                      }
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Free draw</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            {permissions.allowDownload && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download (Ctrl+S)</TooltipContent>
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

        {/* Image container */}
        <div
          className="flex-1 overflow-hidden relative"
          onMouseDown={handleMouseDown}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading image...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <p className="text-red-600 mb-4">Failed to load image</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={getTransformStyle()}>
                <img
                  ref={imageRef}
                  src={url}
                  alt={fileName}
                  className="max-w-none shadow-lg"
                  draggable={false}
                />

                {watermark && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      opacity: watermark.opacity,
                      transform: `rotate(-45deg)`,
                    }}
                  >
                    <p className="text-6xl font-bold text-gray-400 whitespace-nowrap">
                      {watermark.text}
                    </p>
                  </div>
                )}

                {permissions.allowAnnotations && (
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `scale(${1 / transform.scale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <AnnotationLayer
                      annotations={annotations}
                      currentTool={selectedTool}
                      pageNumber={1}
                      scale={1}
                      onAnnotationCreate={onAnnotationCreate}
                      onAnnotationUpdate={onAnnotationUpdate}
                      onAnnotationDelete={onAnnotationDelete}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hidden canvas for export */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>
    </TooltipProvider>
  );
}
