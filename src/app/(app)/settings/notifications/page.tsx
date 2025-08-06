"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  Save,
  Trash2,
  Volume2,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface NotificationPreference {
  type: string;
  enabled: boolean;
  channels: string[];
  settings: Record<string, any>;
}

interface DndSchedule {
  id?: string;
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  timezone: string;
  is_active: boolean;
  allowed_types: string[];
}

const notificationTypes = [
  {
    type: "task.assigned",
    name: "Task Assigned",
    description: "When someone assigns you a task",
    icon: "CheckSquare",
  },
  {
    type: "task.completed",
    name: "Task Completed",
    description: "When a task you created is completed",
    icon: "CheckCircle",
  },
  {
    type: "document.shared",
    name: "Document Shared",
    description: "When someone shares a document with you",
    icon: "FileText",
  },
  {
    type: "document.commented",
    name: "Document Commented",
    description: "When someone comments on your document",
    icon: "MessageSquare",
  },
  {
    type: "ai.completed",
    name: "AI Task Completed",
    description: "When an AI agent completes a task",
    icon: "Bot",
  },
  {
    type: "milestone.achieved",
    name: "Milestone Achieved",
    description: "When a project milestone is reached",
    icon: "Trophy",
  },
  {
    type: "system.alert",
    name: "System Alerts",
    description: "Important system notifications",
    icon: "AlertTriangle",
  },
  {
    type: "team.mention",
    name: "Team Mentions",
    description: "When someone mentions you",
    icon: "AtSign",
  },
  {
    type: "deadline.reminder",
    name: "Deadline Reminders",
    description: "Reminders for upcoming deadlines",
    icon: "Clock",
  },
  {
    type: "market.alert",
    name: "Market Alerts",
    description: "Market condition notifications",
    icon: "TrendingUp",
  },
];

const daysOfWeek = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export default function NotificationSettingsPage() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<
    Record<string, NotificationPreference>
  >({});
  const [dndSchedules, setDndSchedules] = useState<DndSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopEnabled, setDesktopEnabled] = useState(false);

  // Load preferences
  useEffect(() => {
    loadPreferences();
    loadDndSchedules();

    // Load local settings
    setSoundEnabled(localStorage.getItem("notification_sound") !== "false");
    setDesktopEnabled(localStorage.getItem("desktop_notifications") === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPreferences = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch("/api/notifications/preferences", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load preferences");

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const loadDndSchedules = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch("/api/notifications/dnd", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load DND schedules");

      const data = await response.json();
      setDndSchedules(data.schedules);
    } catch (error) {
      console.error("Error loading DND schedules:", error);
    }
  };

  const savePreferences = async () => {
    if (!session?.user) return;

    setSaving(true);
    try {
      const preferencesArray = Object.entries(preferences).map(
        ([notificationType, pref]) => ({
          ...pref,
          type: notificationType,
        }),
      );

      const response = await fetch("/api/notifications/preferences/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: preferencesArray }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      toast.success("Notification preferences saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const toggleChannel = (type: string, channel: string) => {
    setPreferences((prev) => {
      const pref = prev[type];
      const channels = pref.channels.includes(channel)
        ? pref.channels.filter((c) => c !== channel)
        : [...pref.channels, channel];

      return {
        ...prev,
        [type]: {
          ...pref,
          channels,
        },
      };
    });
  };

  const toggleEnabled = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled,
      },
    }));
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("notification_sound", enabled.toString());
  };

  const handleDesktopToggle = async (enabled: boolean) => {
    if (enabled) {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setDesktopEnabled(true);
        localStorage.setItem("desktop_notifications", "true");
        toast.success("Desktop notifications enabled");
      } else {
        toast.error("Desktop notification permission denied");
      }
    } else {
      setDesktopEnabled(false);
      localStorage.setItem("desktop_notifications", "false");
    }
  };

  const addDndSchedule = () => {
    const newSchedule: DndSchedule = {
      name: "New Schedule",
      start_time: "22:00",
      end_time: "08:00",
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_active: false,
      allowed_types: ["system.alert"],
    };
    setDndSchedules([...dndSchedules, newSchedule]);
  };

  const updateDndSchedule = (index: number, updates: Partial<DndSchedule>) => {
    setDndSchedules((prev) =>
      prev.map((schedule, i) =>
        i === index ? { ...schedule, ...updates } : schedule,
      ),
    );
  };

  const deleteDndSchedule = async (index: number) => {
    const schedule = dndSchedules[index];
    if (schedule.id && session?.user) {
      try {
        await fetch(`/api/notifications/dnd/${schedule.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error deleting DND schedule:", error);
      }
    }
    setDndSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage how and when you receive notifications
          </p>
        </div>
        <Button onClick={savePreferences} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="dnd">Do Not Disturb</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationTypes.map((notifType) => {
                const pref = preferences[notifType.type];
                if (!pref) return null;

                return (
                  <div
                    key={notifType.type}
                    className="flex items-start justify-between space-x-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={notifType.type} className="text-base">
                          {notifType.name}
                        </Label>
                        {pref.enabled && (
                          <div className="flex gap-1">
                            {pref.channels.includes("in-app") && (
                              <Badge variant="secondary" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                In-app
                              </Badge>
                            )}
                            {pref.channels.includes("email") && (
                              <Badge variant="secondary" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {pref.channels.includes("sms") && (
                              <Badge variant="secondary" className="text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                SMS
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notifType.description}
                      </p>
                    </div>
                    <Switch
                      id={notifType.type}
                      checked={pref.enabled}
                      onCheckedChange={() => toggleEnabled(notifType.type)}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general notification behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className="text-base">
                    Notification Sound
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play a sound for new notifications
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop" className="text-base">
                    Desktop Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show browser notifications
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    id="desktop"
                    checked={desktopEnabled}
                    onCheckedChange={handleDesktopToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Channel Configuration</CardTitle>
              <CardDescription>
                Set up delivery channels for each notification type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationTypes.map((notifType) => {
                  const pref = preferences[notifType.type];
                  if (!pref || !pref.enabled) return null;

                  return (
                    <div key={notifType.type} className="space-y-3">
                      <Label className="text-base">{notifType.name}</Label>
                      <div className="flex gap-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={pref.channels.includes("in-app")}
                            onChange={() =>
                              toggleChannel(notifType.type, "in-app")
                            }
                            className="rounded"
                          />
                          <span className="text-sm">In-app</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={pref.channels.includes("email")}
                            onChange={() =>
                              toggleChannel(notifType.type, "email")
                            }
                            className="rounded"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        {notifType.type === "system.alert" && (
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={pref.channels.includes("sms")}
                              onChange={() =>
                                toggleChannel(notifType.type, "sms")
                              }
                              className="rounded"
                            />
                            <span className="text-sm">SMS</span>
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dnd" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Do Not Disturb Schedules</CardTitle>
              <CardDescription>
                Set quiet hours when you don&apos;t want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dndSchedules.map((schedule, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Input
                          value={schedule.name}
                          onChange={(e) =>
                            updateDndSchedule(index, { name: e.target.value })
                          }
                          className="max-w-xs"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={schedule.is_active}
                            onCheckedChange={(checked) =>
                              updateDndSchedule(index, { is_active: checked })
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDndSchedule(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={schedule.start_time}
                            onChange={(e) =>
                              updateDndSchedule(index, {
                                start_time: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={schedule.end_time}
                            onChange={(e) =>
                              updateDndSchedule(index, {
                                end_time: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Days</Label>
                        <div className="flex gap-2 mt-2">
                          {daysOfWeek.map((day) => (
                            <label
                              key={day.value}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                checked={schedule.days_of_week.includes(
                                  day.value,
                                )}
                                onChange={(e) => {
                                  const days = e.target.checked
                                    ? [...schedule.days_of_week, day.value]
                                    : schedule.days_of_week.filter(
                                        (d) => d !== day.value,
                                      );
                                  updateDndSchedule(index, {
                                    days_of_week: days,
                                  });
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`px-3 py-1 rounded-md cursor-pointer text-sm ${
                                  schedule.days_of_week.includes(day.value)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary"
                                }`}
                              >
                                {day.label}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={addDndSchedule}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
