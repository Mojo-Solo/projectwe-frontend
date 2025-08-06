"use client";

import React, { useState } from "react";
import {
  Share2,
  Link2,
  Mail,
  User,
  Users,
  Globe,
  Lock,
  Calendar,
  X,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import type { DocumentPermission } from "@/types/document";

interface ShareRecipient {
  id?: string;
  email: string;
  name?: string;
  permission: "view" | "comment" | "edit" | "admin";
  expiresAt?: Date;
}

interface DocumentShareProps {
  document: any; // Should use proper Document type
  onShare: (permissions: DocumentPermission[]) => void;
  onCancel: () => void;
  workspaceId?: string;
  currentUser?: any;
}

const PERMISSION_DESCRIPTIONS = {
  view: "Can view and download the document",
  comment: "Can view, download, and add comments",
  edit: "Can view, download, comment, and make changes",
  admin: "Full access including sharing and deleting",
};

export function DocumentShareEnhanced({
  document,
  onShare,
  onCancel,
  workspaceId,
  currentUser,
}: DocumentShareProps) {
  const [shareMethod, setShareMethod] = useState<"email" | "link">("email");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<
    "view" | "comment" | "edit" | "admin"
  >("view");
  const [message, setMessage] = useState("");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [recipients, setRecipients] = useState<ShareRecipient[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [sending, setSending] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const { toast } = useToast();

  const handleAddRecipient = () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check if already added
    if (recipients.some((r) => r.email === email)) {
      toast({
        title: "Already added",
        description: "This email has already been added",
        variant: "destructive",
      });
      return;
    }

    const expiresAt =
      expiresIn !== "never"
        ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000)
        : undefined;

    setRecipients([
      ...recipients,
      {
        email,
        permission: permission as "view" | "comment" | "edit" | "admin",
        expiresAt,
      },
    ]);

    setEmail("");
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const handleGenerateLink = async () => {
    try {
      // Simulate API call
      const link = `${window.location.origin}/shared/${document.id}?token=abc123`;
      setGeneratedLink(link);

      toast({
        title: "Link generated",
        description: "Share link has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const permissions: DocumentPermission[] = recipients.map((r) => ({
      email: r.email,
      permission: r.permission,
      expiresAt: r.expiresAt?.toISOString(),
      sharedAt: new Date().toISOString(),
      sharedBy: currentUser || {
        id: "1",
        name: "Current User",
        email: "user@example.com",
      },
    }));

    onShare(permissions);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div key={index} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Share &quot;{document.name}&quot;
        </h3>
        <p className="text-sm text-gray-600">
          Share this document with team members or external parties
        </p>
      </div>

      <Tabs
        value={shareMethod}
        onValueChange={(v) => setShareMethod(v as "email" | "link")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </TabsTrigger>
          <TabsTrigger value="link" className="flex-1">
            <Link2 className="h-4 w-4 mr-2" />
            Share via Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddRecipient()}
                />
              </div>
              <div className="w-40">
                <Label htmlFor="permission">Permission</Label>
                <Select
                  value={permission}
                  onValueChange={(v) => setPermission(v as any)}
                >
                  <SelectTrigger id="permission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="comment">Can comment</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="admin">Admin access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddRecipient}>Add</Button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>
                  {permission.charAt(0).toUpperCase() + permission.slice(1)}:
                </strong>{" "}
                {PERMISSION_DESCRIPTIONS[permission]}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="expires">Access expires</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger id="expires">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recipients.length > 0 && (
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="border rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto">
                  {recipients.map((recipient, index) => (
                    <div key={index}
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{recipient.email}</span>
                        <Badge variant="secondary" className="text-xs">
                          {recipient.permission}
                        </Badge>
                        {recipient.expiresAt && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires{" "}
                            {new Date(recipient.expiresAt).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRecipient(recipient.email)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to include with the share invitation..."
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkPermission">Permission</Label>
              <Select
                value={permission}
                onValueChange={(v) => setPermission(v as any)}
              >
                <SelectTrigger id="linkPermission">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="comment">Can comment</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="linkExpires">Link expires</Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger id="linkExpires">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublicLink}
                  onCheckedChange={setIsPublicLink}
                />
                <Label htmlFor="public" className="flex items-center space-x-2">
                  {isPublicLink ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>
                    {isPublicLink
                      ? "Anyone with the link can access"
                      : "Only people you invite can access"}
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="password"
                  checked={requiresPassword}
                  onCheckedChange={setRequiresPassword}
                />
                <Label htmlFor="password">Require password</Label>
              </div>

              {requiresPassword && (
                <div>
                  <Label htmlFor="linkPassword">Password</Label>
                  <Input
                    id="linkPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password for link access"
                  />
                </div>
              )}
            </div>

            <Card className="p-4 space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Options
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="watermark">Add watermark</Label>
                  <Switch
                    id="watermark"
                    checked={watermarkEnabled}
                    onCheckedChange={setWatermarkEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="printing">Allow printing</Label>
                  <Switch
                    id="printing"
                    checked={allowPrinting}
                    onCheckedChange={setAllowPrinting}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="copying">Allow copying</Label>
                  <Switch
                    id="copying"
                    checked={allowCopying}
                    onCheckedChange={setAllowCopying}
                  />
                </div>
              </div>
            </Card>

            {!generatedLink ? (
              <Button onClick={handleGenerateLink} className="w-full">
                <Link2 className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Share link</Label>
                <div className="flex space-x-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyToClipboard}>Copy</Button>
                </div>
                <p className="text-xs text-gray-500">
                  Anyone with this link can{" "}
                  {permission === "view"
                    ? "view"
                    : permission === "comment"
                      ? "comment on"
                      : "edit"}{" "}
                  the document
                  {expiresIn !== "never" && ` for ${expiresIn} days`}.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Current Permissions */}
      {document.permissions && document.permissions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Current Access</h4>
          <div className="space-y-2">
            {document.permissions.map((perm: any, index: number) => (
              <div key={index: number}
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{perm.email}</p>
                    <p className="text-xs text-gray-500">
                      Shared {new Date(perm.sharedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{perm.permission}</Badge>
                  {perm.expiresAt && (
                    <Badge variant="secondary" className="text-xs">
                      Expires {new Date(perm.expiresAt).toLocaleDateString()}
                    </Badge>
                  )}
                  {currentUser?.email === perm.email && (
                    <Badge className="text-xs">You</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleShare}
          disabled={recipients.length === 0 && shareMethod === "email"}
        >
          {shareMethod === "email"
            ? `Share with ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`
            : "Create Share Link"}
        </Button>
      </div>
    </div>
  );
}
