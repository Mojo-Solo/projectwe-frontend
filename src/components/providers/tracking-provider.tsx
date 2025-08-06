"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  useEventTracking,
  useDocumentTracking,
  useAITracking,
} from "@/hooks/useEventTracking";

interface TrackingContextType {
  // User behavior tracking
  trackClick: (elementId: string, elementType: string) => Promise<void>;
  trackFormSubmit: (
    formId: string,
    formData: Record<string, any>,
  ) => Promise<void>;
  trackSearch: (query: string, resultCount: number) => Promise<void>;
  trackScroll: (scrollDepth: number) => Promise<void>;
  trackTimeSpent: (pageSection: string, timeSpentMs: number) => Promise<void>;

  // Document tracking
  trackDocumentView: (
    documentId: string,
    metadata: DocumentMetadata,
  ) => Promise<void>;
  trackDocumentDownload: (
    documentId: string,
    metadata: DocumentMetadata,
  ) => Promise<void>;
  trackDocumentShare: (
    documentId: string,
    metadata: DocumentMetadata,
    shareMethod: string,
  ) => Promise<void>;

  // AI interaction tracking
  trackAIChat: (
    message: string,
    response: string,
    confidence: number,
    processingTime: number,
  ) => Promise<void>;
  trackAIFeedback: (
    interactionId: string,
    rating: number,
    helpful: boolean,
    comment?: string,
  ) => Promise<void>;

  // Business metrics tracking
  trackValuationView: (companyData: any, valuationResult: any) => Promise<void>;
  trackReportGeneration: (reportType: string, reportData: any) => Promise<void>;

  // Session management
  sessionId: string;
  userId: string | null;
}

interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType:
    | "FINANCIAL"
    | "LEGAL"
    | "OPERATIONAL"
    | "STRATEGIC"
    | "COMPLIANCE"
    | "OTHER";
  tags?: string[];
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within TrackingProvider");
  }
  return context;
};

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sessionId] = useState(() => uuidv4());
  const userId = session?.user?.id || "anonymous";

  // Initialize tracking hooks
  const {
    trackClick: baseTrackClick,
    trackFormSubmit: baseTrackFormSubmit,
    trackSearch: baseTrackSearch,
  } = useEventTracking({ userId, sessionId });
  const { trackDocumentEvent } = useDocumentTracking({ userId, sessionId });
  const { trackAIInteraction, trackAIFeedback: baseTrackAIFeedback } =
    useAITracking({ userId, sessionId });

  // Page timing tracking
  const pageLoadTime = useRef<number>(Date.now());
  const sectionTimers = useRef<Map<string, number>>(new Map());

  // Track page time on route change
  useEffect(() => {
    const pageStartTime = Date.now();

    return () => {
      const timeSpent = Date.now() - pageStartTime;
      // Send page time spent event
      if (timeSpent > 1000) {
        // Only track if spent more than 1 second
        console.log("Page time spent:", pathname, timeSpent);
        // This would be sent to Kafka
      }
    };
  }, [pathname]);

  // Scroll tracking
  useEffect(() => {
    let maxScrollDepth = 0;
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimer);

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100,
      );

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }

      // Debounce scroll tracking
      scrollTimer = setTimeout(() => {
        trackScroll(maxScrollDepth);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [pathname]);

  // Enhanced tracking methods
  const trackClick = useCallback(
    async (elementId: string, elementType: string) => {
      await baseTrackClick(elementId, elementType);
    },
    [baseTrackClick],
  );

  const trackFormSubmit = useCallback(
    async (formId: string, formData: Record<string, any>) => {
      // Sanitize form data before tracking
      const sanitizedData = Object.keys(formData).reduce(
        (acc, key) => {
          if (!["password", "creditCard", "ssn"].includes(key.toLowerCase())) {
            acc[key] =
              typeof formData[key] === "string"
                ? formData[key].substring(0, 100)
                : formData[key];
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      await baseTrackFormSubmit(formId, sanitizedData);
    },
    [baseTrackFormSubmit],
  );

  const trackSearch = useCallback(
    async (query: string, resultCount: number) => {
      await baseTrackSearch(query, resultCount);
    },
    [baseTrackSearch],
  );

  const trackScroll = useCallback(async (scrollDepth: number) => {
    // Custom scroll tracking implementation
    console.log("Scroll depth:", scrollDepth);
  }, []);

  const trackTimeSpent = useCallback(
    async (pageSection: string, timeSpentMs: number) => {
      console.log("Time spent in section:", pageSection, timeSpentMs);
    },
    [],
  );

  // Document tracking methods
  const trackDocumentView = useCallback(
    async (documentId: string, metadata: DocumentMetadata) => {
      await trackDocumentEvent("VIEWED", documentId, metadata);
    },
    [trackDocumentEvent],
  );

  const trackDocumentDownload = useCallback(
    async (documentId: string, metadata: DocumentMetadata) => {
      await trackDocumentEvent("DOWNLOADED", documentId, metadata);
    },
    [trackDocumentEvent],
  );

  const trackDocumentShare = useCallback(
    async (
      documentId: string,
      metadata: DocumentMetadata,
      shareMethod: string,
    ) => {
      await trackDocumentEvent("SHARED", documentId, metadata, {
        additionalData: { shareMethod },
      });
    },
    [trackDocumentEvent],
  );

  // AI tracking methods
  const trackAIChat = useCallback(
    async (
      message: string,
      response: string,
      confidence: number,
      processingTime: number,
    ) => {
      await trackAIInteraction(
        "CHAT",
        { prompt: message },
        { content: response, confidence, processingTimeMs: processingTime },
        { modelName: "gpt-4", modelVersion: "1.0", provider: "openai" },
      );
    },
    [trackAIInteraction],
  );

  const trackAIFeedback = useCallback(
    async (
      interactionId: string,
      rating: number,
      helpful: boolean,
      comment?: string,
    ) => {
      await baseTrackAIFeedback(interactionId, { rating, helpful, comment });
    },
    [baseTrackAIFeedback],
  );

  // Business metrics tracking
  const trackValuationView = useCallback(
    async (companyData: any, valuationResult: any) => {
      console.log("Valuation viewed:", { companyData, valuationResult });
      // Send to Kafka
    },
    [],
  );

  const trackReportGeneration = useCallback(
    async (reportType: string, reportData: any) => {
      console.log("Report generated:", { reportType, reportData });
      // Send to Kafka
    },
    [],
  );

  const value: TrackingContextType = {
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackScroll,
    trackTimeSpent,
    trackDocumentView,
    trackDocumentDownload,
    trackDocumentShare,
    trackAIChat,
    trackAIFeedback,
    trackValuationView,
    trackReportGeneration,
    sessionId,
    userId,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}
