"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Palette,
  Save,
  Upload,
  Download,
  RotateCcw,
  Building2,
  Users,
  Globe,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  border: string;
}

interface ClientBrand {
  id: string;
  name: string;
  theme: Theme;
  industry: string;
  logoUrl?: string;
}

const industryThemes = {
  default: {
    name: "ProjectWE Default",
    primary: "349 100% 55.5%",
    secondary: "210 40% 96.1%",
    accent: "210 40% 96.1%",
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    muted: "210 40% 96.1%",
    card: "0 0% 100%",
    border: "214.3 31.8% 91.4%",
  },
  finance: {
    name: "Financial Services",
    primary: "215 90% 30%",
    secondary: "215 30% 95%",
    accent: "30 100% 50%",
    background: "0 0% 100%",
    foreground: "215 90% 10%",
    muted: "215 20% 95%",
    card: "0 0% 100%",
    border: "215 20% 85%",
  },
  healthcare: {
    name: "Healthcare",
    primary: "190 90% 35%",
    secondary: "190 30% 95%",
    accent: "150 70% 45%",
    background: "0 0% 100%",
    foreground: "190 80% 10%",
    muted: "190 20% 95%",
    card: "0 0% 100%",
    border: "190 20% 85%",
  },
  tech: {
    name: "Technology",
    primary: "250 100% 60%",
    secondary: "250 30% 95%",
    accent: "280 80% 60%",
    background: "0 0% 100%",
    foreground: "250 90% 10%",
    muted: "250 20% 95%",
    card: "0 0% 100%",
    border: "250 20% 85%",
  },
  manufacturing: {
    name: "Manufacturing",
    primary: "25 95% 53%",
    secondary: "25 30% 95%",
    accent: "195 70% 35%",
    background: "0 0% 100%",
    foreground: "25 80% 10%",
    muted: "25 20% 95%",
    card: "0 0% 100%",
    border: "25 20% 85%",
  },
  retail: {
    name: "Retail",
    primary: "0 85% 60%",
    secondary: "0 30% 95%",
    accent: "340 65% 55%",
    background: "0 0% 100%",
    foreground: "0 75% 10%",
    muted: "0 20% 95%",
    card: "0 0% 100%",
    border: "0 20% 85%",
  },
};

const mockClients: ClientBrand[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    theme: industryThemes.tech as unknown as Theme,
    industry: "Technology",
  },
  {
    id: "2",
    name: "Wellness Medical Group",
    theme: industryThemes.healthcare as unknown as Theme,
    industry: "Healthcare",
  },
  {
    id: "3",
    name: "Industrial Manufacturing Co",
    theme: industryThemes.manufacturing as unknown as Theme,
    industry: "Manufacturing",
  },
];

export default function ThemeStudioPage() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<ClientBrand>(
    mockClients[0],
  );
  const [colors, setColors] = useState<Theme>(selectedClient.theme);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setColors(selectedClient.theme);
    setHasChanges(false);
  }, [selectedClient]);

  const updateColor = (colorKey: keyof Theme, hslValues: string) => {
    const newColors = { ...colors, [colorKey]: hslValues };
    setColors(newColors);
    setHasChanges(true);

    // Update CSS variables for live preview
    const root = document.documentElement;
    root.style.setProperty(`--${colorKey}`, hslValues);
  };

  const applyTheme = (theme: typeof industryThemes.default) => {
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== "name") {
        const root = document.documentElement;
        root.style.setProperty(`--${key}`, value);
      }
    });
    setColors(theme as unknown as Theme);
    setHasChanges(true);
  };

  const saveTheme = () => {
    // In a real app, this would save to a database
    const updatedClient = {
      ...selectedClient,
      theme: colors,
    };

    // Update the mock data
    const clientIndex = mockClients.findIndex(
      (c) => c.id === selectedClient.id,
    );
    if (clientIndex >= 0) {
      mockClients[clientIndex] = updatedClient;
    }

    localStorage.setItem(`theme-${selectedClient.id}`, JSON.stringify(colors));
    setHasChanges(false);

    toast({
      title: "Brand theme saved",
      description: `Theme for ${selectedClient.name} has been updated successfully.`,
    });
  };

  const resetTheme = () => {
    const defaultTheme =
      industryThemes[
        selectedClient.industry.toLowerCase() as keyof typeof industryThemes
      ] || industryThemes.default;
    applyTheme(defaultTheme);
    setSelectedPreset(selectedClient.industry.toLowerCase());
  };

  const exportTheme = () => {
    const themeData = {
      clientName: selectedClient.name,
      clientId: selectedClient.id,
      industry: selectedClient.industry,
      theme: colors,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClient.name.replace(/\s+/g, "-").toLowerCase()}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.theme) {
          setColors(themeData.theme);
          applyTheme(themeData.theme);
          setHasChanges(true);
          toast({
            title: "Theme imported",
            description: "Theme has been imported successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description:
            "Failed to import theme file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const ColorControl = ({
    label,
    colorKey,
  }: {
    label: string;
    colorKey: keyof Theme;
  }) => {
    const hslValues = colors[colorKey].split(" ");
    const h = parseInt(hslValues[0]);
    const s = parseInt(hslValues[1]);
    const l = parseInt(hslValues[2]);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: `hsl(${h}, ${s}%, ${l}%)` }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs w-20">Hue</Label>
            <Slider
              value={[h]}
              onValueChange={([value]) =>
                updateColor(colorKey, `${value} ${s}% ${l}%`)
              }
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="text-xs w-10">{h}°</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs w-20">Saturation</Label>
            <Slider
              value={[s]}
              onValueChange={([value]) =>
                updateColor(colorKey, `${h} ${value}% ${l}%`)
              }
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs w-10">{s}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs w-20">Lightness</Label>
            <Slider
              value={[l]}
              onValueChange={([value]) =>
                updateColor(colorKey, `${h} ${s}% ${value}%`)
              }
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs w-10">{l}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            Client Brand Management
          </h1>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved changes
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Customize the platform appearance for each of your clients to match
          their brand identity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Client Selection and Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Client Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Select Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedClient.id}
                onValueChange={(value) => {
                  const client = mockClients.find((c) => c.id === value);
                  if (client) setSelectedClient(client);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {client.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline">{selectedClient.industry}</Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Industry Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Industry Presets
              </CardTitle>
              <CardDescription>
                Quick-start with industry-specific color schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {Object.entries(industryThemes).map(([key, theme]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        applyTheme(theme);
                        setSelectedPreset(key);
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex gap-1">
                          {["primary", "secondary", "accent"].map((color) => (
                            <div key={index}
                              key={color}
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: `hsl(${theme[color as keyof typeof theme]})`,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{theme.name}</span>
                      </div>
                      {selectedPreset === key && <Check className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={saveTheme}
                disabled={!hasChanges}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Theme
              </Button>
              <Button variant="outline" className="w-full" onClick={resetTheme}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Industry Default
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={exportTheme}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Theme
              </Button>
              <Label htmlFor="import-theme" className="cursor-pointer">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Theme
                  </span>
                </Button>
              </Label>
              <Input
                id="import-theme"
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importTheme}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Color Controls and Preview */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="colors">Color Customization</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>
                    Adjust the color scheme to match {selectedClient.name}
                    &apos;s brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ColorControl label="Primary Color" colorKey="primary" />
                  <ColorControl label="Secondary Color" colorKey="secondary" />
                  <ColorControl label="Accent Color" colorKey="accent" />
                  <ColorControl label="Background" colorKey="background" />
                  <ColorControl label="Foreground" colorKey="foreground" />
                  <ColorControl label="Muted" colorKey="muted" />
                  <ColorControl label="Card Background" colorKey="card" />
                  <ColorControl label="Border" colorKey="border" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    See how {selectedClient.name}&apos;s brand colors will
                    appear across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Preview Components */}
                    <div className="p-6 rounded-lg border bg-card">
                      <h3 className="text-lg font-semibold mb-2">
                        Dashboard Card
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        This is how content cards will appear with the current
                        theme.
                      </p>
                      <div className="flex gap-2">
                        <Button>Primary Action</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary text-primary-foreground rounded">
                        <h4 className="font-semibold">Primary</h4>
                        <p className="text-sm opacity-90">Brand identity</p>
                      </div>
                      <div className="p-4 bg-secondary text-secondary-foreground rounded">
                        <h4 className="font-semibold">Secondary</h4>
                        <p className="text-sm opacity-90">
                          Supporting elements
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-accent text-accent-foreground rounded">
                      <h4 className="font-semibold">Accent Color</h4>
                      <p className="text-sm opacity-90">Highlights and CTAs</p>
                    </div>

                    <div className="p-4 bg-muted text-muted-foreground rounded">
                      <h4 className="font-semibold">Muted Background</h4>
                      <p className="text-sm">Used for subtle backgrounds</p>
                    </div>

                    <div className="space-y-2">
                      <Badge>Default Badge</Badge>
                      <Badge variant="secondary">Secondary Badge</Badge>
                      <Badge variant="outline">Outline Badge</Badge>
                      <Badge variant="destructive">Destructive Badge</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
