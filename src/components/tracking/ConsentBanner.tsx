"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] =
    useState<ConsentPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already given consent
    const consentData = localStorage.getItem("tracking-consent");
    if (!consentData) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consentData);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };

    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };

    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem("tracking-consent", JSON.stringify(prefs));
    localStorage.setItem("tracking-consent-date", new Date().toISOString());

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: prefs }));

    setShowBanner(false);
    setShowDetails(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm">
      <Card className="max-w-6xl mx-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              Privacy & Cookie Preferences
            </h3>
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to enhance your
              experience, analyze usage, and deliver personalized content. Your
              privacy is important to us.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="ml-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {showDetails ? (
          <div className="space-y-4 mb-6">
            <div className="grid gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Necessary Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Essential for the website to function properly. Cannot be
                    disabled.
                  </p>
                </div>
                <Checkbox
                  checked={preferences.necessary}
                  disabled
                  className="mt-1"
                />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website to
                    improve user experience.
                  </p>
                </div>
                <Checkbox
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      analytics: checked as boolean,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver relevant advertisements and track campaign
                    performance.
                  </p>
                </div>
                <Checkbox
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      marketing: checked as boolean,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Personalization Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable personalized content and recommendations based on
                    your interests.
                  </p>
                </div>
                <Checkbox
                  checked={preferences.personalization}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      personalization: checked as boolean,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 justify-end">
          {!showDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Manage Preferences
            </Button>
          )}

          {showDetails && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            </>
          )}

          <Button variant="outline" size="sm" onClick={handleRejectAll}>
            Reject All
          </Button>

          <Button size="sm" onClick={handleAcceptAll}>
            Accept All
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook to check consent status
export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    const loadConsent = () => {
      const consentData = localStorage.getItem("tracking-consent");
      if (consentData) {
        setConsent(JSON.parse(consentData));
      }
    };

    loadConsent();

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      setConsent(event.detail);
    };

    window.addEventListener("consent-updated" as any, handleConsentUpdate);

    return () => {
      window.removeEventListener("consent-updated" as any, handleConsentUpdate);
    };
  }, []);

  return consent;
}
