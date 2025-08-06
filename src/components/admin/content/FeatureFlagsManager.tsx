"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Users, Percent, Calendar } from "lucide-react";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutType: "all" | "percentage" | "user_list" | "date_based";
  rolloutValue?: number | string[] | Date;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export default function FeatureFlagsManager() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: "1",
      name: "AI Exit Strategy Generator",
      key: "ai_exit_generator",
      description: "Enable AI-powered exit strategy generation for all users",
      enabled: true,
      rolloutType: "all",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      updatedBy: "admin@weexit.ai",
    },
    {
      id: "2",
      name: "Advanced Analytics Dashboard",
      key: "advanced_analytics",
      description: "Show advanced analytics features in the dashboard",
      enabled: true,
      rolloutType: "percentage",
      rolloutValue: 75,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-25"),
      updatedBy: "admin@weexit.ai",
    },
    {
      id: "3",
      name: "Collaborative Workspaces",
      key: "collaborative_workspaces",
      description: "Enable real-time collaboration features",
      enabled: false,
      rolloutType: "user_list",
      rolloutValue: ["beta-users"],
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-28"),
      updatedBy: "admin@weexit.ai",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);

  const toggleFlag = (flagId: string) => {
    setFlags(
      flags.map((flag) =>
        flag.id === flagId
          ? { ...flag, enabled: !flag.enabled, updatedAt: new Date() }
          : flag,
      ),
    );
  };

  const getRolloutBadge = (flag: FeatureFlag) => {
    switch (flag.rolloutType) {
      case "all":
        return <Badge key={index} variant="secondary">All Users</Badge>;
      case "percentage":
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Percent className="h-3 w-3" />
            <span>{String(flag.rolloutValue)}% Rollout</span>
          </Badge>
        );
      case "user_list":
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>User List</span>
          </Badge>
        );
      case "date_based":
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Date Based</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Manage feature availability across the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Feature Flag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>
                Add a new feature flag to control feature availability
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="flag-name">Flag Name</Label>
                <Input
                  id="flag-name"
                  placeholder="e.g., AI Exit Strategy Generator"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="flag-key">Flag Key</Label>
                <Input
                  id="flag-key"
                  placeholder="e.g., ai_exit_generator"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="flag-description">Description</Label>
                <textarea
                  id="flag-description"
                  className="w-full mt-1 px-3 py-2 border rounded-md resize-none"
                  rows={3}
                  placeholder="Describe what this feature flag controls..."
                />
              </div>
              <div>
                <Label htmlFor="rollout-type">Rollout Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="percentage">
                      Percentage Rollout
                    </SelectItem>
                    <SelectItem value="user_list">Specific Users</SelectItem>
                    <SelectItem value="date_based">Date Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Flag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feature Flags List */}
      <div className="space-y-3">
        {flags.map((flag) => (
          <Card key={flag.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => toggleFlag(flag.id)}
                    />
                    <div>
                      <h3 className="font-medium">{flag.name}</h3>
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {flag.key}
                      </code>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-12">
                    {flag.description}
                  </p>
                  <div className="flex items-center space-x-4 ml-12 text-sm text-gray-500">
                    {getRolloutBadge(flag)}
                    <span>
                      Updated {new Date(flag.updatedAt).toLocaleDateString()}
                    </span>
                    <span>by {flag.updatedBy}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingFlag(flag)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {flags.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No feature flags created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Flag
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
