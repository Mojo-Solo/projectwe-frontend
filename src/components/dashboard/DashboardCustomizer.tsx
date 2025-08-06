"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
  Grid3x3,
  Columns,
  Rows,
  Eye,
  EyeOff,
  Palette,
  Layout,
} from "lucide-react";

interface DashboardCustomizerProps {
  layout: string;
  onLayoutChange: (layout: string) => void;
  onClose: () => void;
}

export function DashboardCustomizer({
  layout,
  onLayoutChange,
  onClose,
}: DashboardCustomizerProps) {
  const [widgetVisibility, setWidgetVisibility] = useState({
    exitReadiness: true,
    timeline: true,
    valuation: true,
    tasks: true,
    documents: true,
    aiInsights: true,
    marketConditions: true,
    teamActivity: true,
  });

  const [widgetSizes, setWidgetSizes] = useState({
    exitReadiness: "medium",
    timeline: "large",
    valuation: "large",
    tasks: "medium",
    documents: "medium",
    aiInsights: "medium",
    marketConditions: "medium",
    teamActivity: "large",
  });

  const [refreshInterval, setRefreshInterval] = useState(30);

  const widgets = [
    { id: "exitReadiness", name: "Exit Readiness Score" },
    { id: "timeline", name: "Timeline Progress" },
    { id: "valuation", name: "Valuation Tracker" },
    { id: "tasks", name: "Task Overview" },
    { id: "documents", name: "Document Status" },
    { id: "aiInsights", name: "AI Insights Feed" },
    { id: "marketConditions", name: "Market Conditions" },
    { id: "teamActivity", name: "Team Activity" },
  ];

  const layoutOptions = [
    { value: "default", label: "Default Layout", icon: Grid3x3 },
    { value: "focus", label: "Focus View", icon: Columns },
    { value: "compact", label: "Compact View", icon: Rows },
  ];

  const toggleWidget = (widgetId: string) => {
    setWidgetVisibility((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    // Save customization preferences
    console.log("Saving customization:", {
      layout,
      widgetVisibility,
      widgetSizes,
      refreshInterval,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
          <DialogDescription>
            Personalize your dashboard layout and widget preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="layout" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="widgets">
              <Eye className="h-4 w-4 mr-2" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Palette className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Dashboard Layout</h3>
              <RadioGroup value={layout} onValueChange={onLayoutChange}>
                <div className="grid grid-cols-3 gap-4">
                  {layoutOptions.map((option) => (
                    <motion key={index}.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Label
                        htmlFor={option.value}
                        className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="sr-only"
                        />
                        <option.icon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Preview</h3>
              <div className="h-48 border rounded-lg bg-muted/20 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Layout preview for {layout} view
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Widget Visibility</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {widgets.map((widget) => (
                  <div key={index}
                    key={widget.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {widgetVisibility[
                        widget.id as keyof typeof widgetVisibility
                      ] ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label
                        htmlFor={widget.id}
                        className="font-normal cursor-pointer"
                      >
                        {widget.name}
                      </Label>
                    </div>
                    <Switch
                      id={widget.id}
                      checked={
                        widgetVisibility[
                          widget.id as keyof typeof widgetVisibility
                        ]
                      }
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Refresh Interval</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Auto-refresh data every</Label>
                  <span className="text-sm font-medium">
                    {refreshInterval} seconds
                  </span>
                </div>
                <Slider
                  value={[refreshInterval]}
                  onValueChange={(value) => setRefreshInterval(value[0])}
                  min={10}
                  max={120}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Default View</h3>
              <RadioGroup defaultValue="overview">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overview" id="overview" />
                    <Label htmlFor="overview">Overview (All widgets)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="valuation" id="valuation-view" />
                    <Label htmlFor="valuation-view">Valuation Focus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tasks" id="tasks-view" />
                    <Label htmlFor="tasks-view">Task Management</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
