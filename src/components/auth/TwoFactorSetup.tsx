"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Shield, Copy, Check } from "lucide-react";
import Image from "next/image";

interface TwoFactorSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TwoFactorSetup({
  onSuccess,
  onCancel,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Start 2FA setup
  const startSetup = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/user/two-factor-authentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to enable two-factor authentication");
      }

      // Get QR code
      const qrResponse = await fetch(`${API_URL}/api/user/two-factor-qr-code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!qrResponse.ok) {
        throw new Error("Failed to get QR code");
      }

      const qrData = await qrResponse.json();
      setQrCodeUrl(qrData.svg);
      setSecret(qrData.secret);

      // Get recovery codes
      const recoveryResponse = await fetch(
        `${API_URL}/api/user/two-factor-recovery-codes`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!recoveryResponse.ok) {
        throw new Error("Failed to get recovery codes");
      }

      const recoveryData = await recoveryResponse.json();
      setRecoveryCodes(recoveryData);

      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Failed to setup two-factor authentication");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 2FA setup
  const verifySetup = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/user/confirmed-two-factor-authentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ code: verificationCode }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid verification code");
      }

      setShowRecoveryCodes(true);
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const downloadRecoveryCodes = () => {
    const content = `ProjectWE® Two-Factor Authentication Recovery Codes\n\nSave these codes in a secure location. Each code can only be used once.\n\n${recoveryCodes.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projectwe-2fa-recovery-codes.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (showRecoveryCodes) {
    return (
      <Dialog open={showRecoveryCodes} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save your recovery codes</DialogTitle>
            <DialogDescription>
              Store these codes in a safe place. You can use them to access your
              account if you lose your device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
              {recoveryCodes.map((code, index) => (
                <div key={index}>{code}</div>
              ))}
            </div>
            <Alert>
              <AlertDescription>
                Each recovery code can only be used once. When you use a code,
                it will be replaced with a new one.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={downloadRecoveryCodes}>
              Download codes
            </Button>
            <Button
              onClick={() => {
                setShowRecoveryCodes(false);
                onSuccess?.();
              }}
            >
              I&apos;ve saved my codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Set up two-factor authentication</CardTitle>
        </div>
        <CardDescription>
          {step === "setup"
            ? "Add an extra layer of security to your account"
            : "Scan the QR code with your authenticator app"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "setup" ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You&apos;ll need an authenticator app like Google Authenticator,
              Authy, or 1Password.
            </p>
            <Button
              onClick={startSetup}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue setup
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {qrCodeUrl && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: qrCodeUrl }} />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Can&apos;t scan? Enter this code manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                  {secret}
                </code>
                <Button size="sm" variant="outline" onClick={copySecret}>
                  {copiedSecret ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Enter verification code:</p>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={verifySetup}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify and enable
            </Button>
          </div>
        )}
      </CardContent>
      {onCancel && (
        <CardFooter>
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
