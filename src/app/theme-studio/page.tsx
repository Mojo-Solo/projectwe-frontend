
interface ThemeStudioPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  RotateCcw,
  Download,
  Upload,
  Palette,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const dynamic = 'force-dynamic';

// Preset themes for different industries
const presetThemes = {
  default: {
    name: "ProjectWE Default",
    primary: "349 100% 55.5%",
    secondary: "210 40% 96.1%",
    accent: "210 40% 96.1%",
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
  },
  finance: {
    name: "Financial Services",
    primary: "215 90% 30%", // Deep navy blue
    secondary: "45 100% 50%", // Gold
    accent: "215 50% 23%", // Darker navy
    background: "0 0% 100%",
    foreground: "215 50% 15%",
    muted: "215 20% 95%",
    mutedForeground: "215 20% 45%",
  },
  healthcare: {
    name: "Healthcare",
    primary: "190 90% 35%", // Medical teal
    secondary: "150 50% 95%", // Light mint
    accent: "150 60% 45%", // Healing green
    background: "0 0% 100%",
    foreground: "190 50% 15%",
    muted: "190 20% 95%",
    mutedForeground: "190 20% 45%",
  },
  tech: {
    name: "Technology",
    primary: "250 100% 60%", // Electric blue
    secondary: "280 100% 65%", // Purple
    accent: "200 100% 50%", // Cyan
    background: "0 0% 100%",
    foreground: "220 20% 20%",
    muted: "220 20% 96%",
    mutedForeground: "220 20% 50%",
  },
  manufacturing: {
    name: "Manufacturing",
    primary: "25 95% 53%", // Industrial orange
    secondary: "210 60% 40%", // Steel blue
    accent: "30 100% 50%", // Safety yellow
    background: "0 0% 100%",
    foreground: "210 30% 20%",
    muted: "210 20% 95%",
    mutedForeground: "210 20% 45%",
  },
};

export default function ThemeStudioPage() {
  const [colors, setColors] = useState(presetThemes.default);
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);

  // Parse HSL string to components
  const parseHSL = (hsl: string) => {
    const parts = hsl.split(" ");
    return {
      h: parseInt(parts[0]),
      s: parseInt(parts[1]),
      l: parseInt(parts[2]),
    };
  };

  // Convert HSL components back to string
  const formatHSL = (h: number, s: number, l: number) => {
    return `${h} ${s}% ${l}%`;
  };

  // Update a specific color
  const updateColor = (
    colorName: string,
    component: "h" | "s" | "l",
    value: number,
  ) => {
    const current = parseHSL(
      colors[colorName as keyof typeof colors] as string,
    );
    current[component] = value;
    setColors({
      ...colors,
      [colorName]: formatHSL(current.h, current.s, current.l),
    });
    setHasChanges(true);
    setSaved(false);
  };

  // Apply theme to CSS variables
  const applyTheme = () => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      if (key !== "name") {
        root.style.setProperty(`--${key}`, value);
      }
    });
    setSaved(true);
    setHasChanges(false);

    // Save to localStorage
    localStorage.setItem("customTheme", JSON.stringify(colors));
  };

  // Load preset theme
  const loadPreset = (presetKey: string) => {
    const preset = presetThemes[presetKey as keyof typeof presetThemes];
    setColors(preset);
    setSelectedPreset(presetKey);
    setHasChanges(true);
    setSaved(false);
  };

  // Reset to saved theme or default
  const resetTheme = () => {
    const saved = localStorage.getItem("customTheme");
    if (saved) {
      setColors(JSON.parse(saved));
    } else {
      setColors(presetThemes.default);
    }
    applyTheme();
  };

  // Export theme as JSON
  const exportTheme = () => {
    const dataStr = JSON.stringify(colors, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `theme-${Date.now()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Load theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("customTheme");
    if (saved) {
      const savedColors = JSON.parse(saved);
      setColors(savedColors);
      applyTheme();
    }
  }, []);

  const ColorControl = ({ name, label }: { name: string; label: string }) => {
    const hsl = parseHSL(colors[name as keyof typeof colors] as string);

    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">{label}</Label>
          <div
            className="w-12 h-12 rounded-md border shadow-sm"
            style={{
              backgroundColor: `hsl(${colors[name as keyof typeof colors]})`,
            }}
          />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-sm">Hue</Label>
              <span className="text-xs text-muted-foreground">{hsl.h}°</span>
            </div>
            <Slider
              value={[hsl.h]}
              onValueChange={([value]) => updateColor(name, "h", value)}
              max={360}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-sm">Saturation</Label>
              <span className="text-xs text-muted-foreground">{hsl.s}%</span>
            </div>
            <Slider
              value={[hsl.s]}
              onValueChange={([value]) => updateColor(name, "s", value)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-sm">Lightness</Label>
              <span className="text-xs text-muted-foreground">{hsl.l}%</span>
            </div>
            <Slider
              value={[hsl.l]}
              onValueChange={([value]) => updateColor(name, "l", value)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Theme Studio</h1>
            <p className="text-muted-foreground mt-1">
              Customize your platform&apos;s visual identity to match your brand
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3" />
                Saved
              </Badge>
            )}
            {hasChanges && !saved && (
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        <Alert>
          <Palette className="h-4 w-4" />
          <AlertDescription>
            Changes are previewed in real-time. Click &quot;Apply Theme&quot; to
            save your customizations.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preset Themes</CardTitle>
                <CardDescription>
                  Start with an industry-specific theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(presetThemes).map(([key, theme]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      onClick={() => loadPreset(key)}
                      className="justify-start"
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: `hsl(${theme.primary})` }}
                      />
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Customization</CardTitle>
                <CardDescription>
                  Fine-tune individual colors using HSL values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="main">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="main">Main Colors</TabsTrigger>
                    <TabsTrigger value="semantic">Semantic Colors</TabsTrigger>
                  </TabsList>
                  <TabsContent value="main" className="space-y-4">
                    <ColorControl name="primary" label="Primary" />
                    <ColorControl name="secondary" label="Secondary" />
                    <ColorControl name="accent" label="Accent" />
                  </TabsContent>
                  <TabsContent value="semantic" className="space-y-4">
                    <ColorControl name="background" label="Background" />
                    <ColorControl name="foreground" label="Foreground" />
                    <ColorControl name="muted" label="Muted" />
                    <ColorControl
                      name="mutedForeground"
                      label="Muted Foreground"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={applyTheme}
                className="flex-1"
                disabled={!hasChanges}
              >
                Apply Theme
              </Button>
              <Button onClick={resetTheme} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={exportTheme} variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your colors look in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buttons */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Buttons
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Cards & Content
                  </Label>
                  <div className="grid gap-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Exit Readiness Score
                        </CardTitle>
                        <CardDescription>
                          Your business is 85% ready for exit
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Badge>High Priority</Badge>
                          <Badge variant="secondary">In Progress</Badge>
                          <Badge variant="outline">Planned</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Typography
                  </Label>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      Strategic Exit Planning
                    </h3>
                    <p className="text-muted-foreground">
                      Transform your business value with our AI-powered platform
                    </p>
                    <p className="text-sm">
                      Regular text appears in the foreground color, providing
                      excellent readability across all theme variations.
                    </p>
                  </div>
                </div>

                {/* Alerts */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Alerts & Notifications
                  </Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your custom theme enhances brand recognition and user
                      trust.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
