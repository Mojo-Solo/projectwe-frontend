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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ShareRecipient {
  id?: string;
  email: string;
  name?: string;
  permission: "view" | "edit" | "admin";
  expiresAt?: Date;
}

interface DocumentShareProps {
  documentId: string;
  documentName: string;
  isOpen: boolean;
  onClose: () => void;
  currentPermissions?: ShareRecipient[];
}

export function DocumentShare({
  documentId,
  documentName,
  isOpen,
  onClose,
  currentPermissions = [],
}: DocumentShareProps) {
  const [shareMethod, setShareMethod] = useState<"email" | "link">("email");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [message, setMessage] = useState("");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [recipients, setRecipients] =
    useState<ShareRecipient[]>(currentPermissions);
  const [generatedLink, setGeneratedLink] = useState("");
  const [sending, setSending] = useState(false);
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
        permission: permission as "view" | "edit",
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
      const response = await fetch(`/api/documents/${documentId}/share-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          permission,
          expiresIn,
          isPublic: isPublicLink,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate link");

      const { link } = await response.json();
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

  const handleSendInvites = async () => {
    if (recipients.length === 0) return;

    setSending(true);
    try {
      for (const recipient of recipients) {
        await fetch(`/api/documents/${documentId}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: recipient.email,
            permission: recipient.permission,
            expiresAt: recipient.expiresAt,
            message,
          }),
        });
      }

      toast({
        title: "Invites sent",
        description: `Successfully shared with ${recipients.length} recipient${recipients.length > 1 ? "s" : ""}`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share &quot;{documentName}&quot;</DialogTitle>
          <DialogDescription>
            Share this document with others via email or a shareable link
          </DialogDescription>
        </DialogHeader>

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
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddRecipient()
                    }
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="permission">Permission</Label>
                  <Select
                    value={permission}
                    onValueChange={(v) => setPermission(v as "view" | "edit")}
                  >
                    <SelectTrigger id="permission">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddRecipient}>Add</Button>
                </div>
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
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires{" "}
                              {new Date(
                                recipient.expiresAt,
                              ).toLocaleDateString()}
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvites}
                  disabled={recipients.length === 0 || sending}
                >
                  {sending
                    ? "Sending..."
                    : `Send to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkPermission">Permission</Label>
                <Select
                  value={permission}
                  onValueChange={(v) => setPermission(v as "view" | "edit")}
                >
                  <SelectTrigger id="linkPermission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
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
                    {permission === "view" ? "view" : "edit"} the document
                    {expiresIn !== "never" && ` for ${expiresIn} days`}.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
