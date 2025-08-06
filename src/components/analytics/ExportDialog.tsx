"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import {
  analyticsExportService,
  ExportFormat,
  ExportOptions,
} from "@/lib/analytics/export-service";
import { AggregatedMetrics } from "@/lib/analytics/data-aggregation";

interface ExportDialogProps {
  data: AggregatedMetrics;
  timeRange?: string;
  organizationName?: string;
  onExport?: (format: ExportFormat) => void;
}

export function ExportDialog({
  data,
  timeRange,
  organizationName,
  onExport,
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "userEngagement",
    "documentUsage",
    "aiInteractions",
    "businessMetrics",
    "exitPlanning",
  ]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const sections = [
    {
      id: "userEngagement",
      label: "User Engagement Metrics",
      description: "Sessions, page views, bounce rates",
    },
    {
      id: "documentUsage",
      label: "Document Usage Analytics",
      description: "Document types, processing times, activity",
    },
    {
      id: "aiInteractions",
      label: "AI Interaction Stats",
      description: "Queries, response times, satisfaction",
    },
    {
      id: "businessMetrics",
      label: "Business Performance",
      description: "Valuations, conversions, funnel data",
    },
    {
      id: "exitPlanning",
      label: "Exit Planning Progress",
      description: "Projects, strategies, timelines",
    },
  ];

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSections((prev) => [...prev, sectionId]);
    } else {
      setSelectedSections((prev) => prev.filter((id) => id !== sectionId));
    }
  };

  const handleExport = async () => {
    if (selectedSections.length === 0) {
      alert("Please select at least one section to export.");
      return;
    }

    setIsExporting(true);

    try {
      const options: ExportOptions = {
        format: exportFormat,
        includeCharts: includeCharts && exportFormat === "pdf",
        timeRange,
        sections: selectedSections,
        organizationName,
      };

      // Get chart elements if including charts
      let chartElements: HTMLElement[] = [];
      if (options.includeCharts) {
        chartElements = Array.from(document.querySelectorAll("canvas"))
          .map((canvas) => canvas.closest(".recharts-wrapper") as HTMLElement)
          .filter(Boolean);
      }

      if (exportFormat === "pdf") {
        await analyticsExportService.downloadPDF(data, options, chartElements);
      } else if (exportFormat === "csv") {
        analyticsExportService.downloadCSV(data, options);
      }

      onExport?.(exportFormat);
      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText key={index} className="h-4 w-4" />;
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getEstimatedSize = () => {
    const preview = analyticsExportService.getExportPreview(data, exportFormat);
    return preview?.estimatedSize || "Unknown";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Analytics Report</DialogTitle>
          <DialogDescription>
            Generate a comprehensive analytics report with your selected data
            and format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="pdf" id="pdf" />
                <div className="flex items-center space-x-2 flex-1">
                  <FileText className="h-4 w-4 text-red-600" />
                  <div>
                    <Label htmlFor="pdf" className="font-medium">
                      PDF Report
                    </Label>
                    <p className="text-sm text-gray-600">
                      Professional report with charts and detailed analysis
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="csv" id="csv" />
                <div className="flex items-center space-x-2 flex-1">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <div>
                    <Label htmlFor="csv" className="font-medium">
                      CSV Data
                    </Label>
                    <p className="text-sm text-gray-600">
                      Raw data in spreadsheet format for analysis
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* PDF Options */}
          {exportFormat === "pdf" && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={(checked) =>
                    setIncludeCharts(checked as boolean)
                  }
                />
                <Label htmlFor="includeCharts" className="font-medium">
                  Include Charts and Graphs
                </Label>
              </div>
              <p className="text-sm text-gray-600">
                Add visual charts to the PDF report (increases file size)
              </p>
            </div>
          )}

          {/* Section Selection */}
          <div>
            <Label className="text-base font-medium">Include Sections</Label>
            <div className="mt-2 space-y-2">
              {sections.map((section) => (
                <div key={index}
                  key={section.id}
                  className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50"
                >
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={(checked) =>
                      handleSectionToggle(section.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={section.id} className="font-medium">
                      {section.label}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Export Summary</span>
              <span className="text-sm text-gray-600">
                Estimated size: {getEstimatedSize()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Format: {exportFormat.toUpperCase()}</p>
              <p>
                Sections: {selectedSections.length} of {sections.length}{" "}
                selected
              </p>
              <p>Time Range: {timeRange || "All time"}</p>
              {exportFormat === "pdf" && (
                <p>Charts: {includeCharts ? "Included" : "Not included"}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedSections.length === 0}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  {getFormatIcon(exportFormat)}
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
