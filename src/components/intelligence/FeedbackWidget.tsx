"use client";

import React, { useState, useCallback } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Send,
  X,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FeedbackData {
  id: string;
  type:
    | "correction"
    | "improvement"
    | "bug_report"
    | "feature_request"
    | "general";
  rating?: number;
  content: string;
  category: string;
  context?: {
    component: string;
    data: any;
    user_action: string;
    timestamp: string;
  };
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "acknowledged" | "in_progress" | "resolved" | "dismissed";
  user_info?: {
    user_id: string;
    session_id: string;
    user_agent: string;
  };
  created_at: string;
}

interface FeedbackStats {
  total_feedback: number;
  average_rating: number;
  feedback_by_type: Record<string, number>;
  recent_feedback: FeedbackData[];
  resolution_rate: number;
}

interface FeedbackWidgetProps {
  context?: {
    component: string;
    data?: any;
    action?: string;
  };
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  showStats?: boolean;
  position?: "fixed" | "inline";
  className?: string;
}

export function FeedbackWidget({
  context,
  onFeedbackSubmit,
  showStats = false,
  position = "fixed",
  className = "",
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] =
    useState<FeedbackData["type"]>("general");
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState<FeedbackData["priority"]>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const { toast } = useToast();

  const submitFeedback = useCallback(async () => {
    if (!content.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        id: `feedback-${Date.now()}`,
        type: feedbackType,
        rating: feedbackType === "general" ? rating : undefined,
        content: content.trim(),
        category,
        priority,
        status: "pending",
        context: context
          ? {
              component: context.component,
              data: context.data,
              user_action: context.action || "unknown",
              timestamp: new Date().toISOString(),
            }
          : undefined,
        user_info: {
          user_id: "current-user", // This would come from auth context
          session_id: sessionStorage.getItem("session_id") || "anonymous",
          user_agent: navigator.userAgent,
        },
        created_at: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_URL}/api/v1/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key":
              process.env.NEXT_PUBLIC_ML_API_KEY || "dev-api-key-2025",
          },
          body: JSON.stringify(feedbackData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Call callback if provided
      if (onFeedbackSubmit) {
        onFeedbackSubmit(feedbackData);
      }

      // Show success state
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        setIsOpen(false);
        resetForm();
      }, 2000);

      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve!",
      });
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    feedbackType,
    rating,
    content,
    category,
    priority,
    context,
    onFeedbackSubmit,
    toast,
  ]);

  const resetForm = () => {
    setFeedbackType("general");
    setRating(5);
    setContent("");
    setCategory("general");
    setPriority("medium");
  };

  const getFeedbackTypeIcon = (type: FeedbackData["type"]) => {
    switch (type) {
      case "correction":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "improvement":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "bug_report":
        return <Flag className="h-4 w-4 text-red-600" />;
      case "feature_request":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFeedbackTypeDescription = (type: FeedbackData["type"]) => {
    switch (type) {
      case "correction":
        return "Report incorrect information or data";
      case "improvement":
        return "Suggest ways to make this better";
      case "bug_report":
        return "Report a technical issue or error";
      case "feature_request":
        return "Request a new feature or capability";
      default:
        return "General feedback or comments";
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={index}
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-1 rounded ${star <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/5 stars
        </span>
      </div>
    );
  };

  const FeedbackForm = () => (
    <div className="space-y-4">
      {showThankYou ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Thank you!</h3>
          <p className="text-muted-foreground">
            Your feedback has been submitted and will help us improve.
          </p>
        </div>
      ) : (
        <>
          {/* Feedback Type Selection */}
          <div>
            <Label className="text-sm font-medium">Type of Feedback</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={(value) =>
                setFeedbackType(value as FeedbackData["type"])
              }
              className="mt-2"
            >
              {(
                [
                  "correction",
                  "improvement",
                  "bug_report",
                  "feature_request",
                  "general",
                ] as const
              ).map((type) => (
                <div key={index}
                  key={type}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <RadioGroupItem value={type} id={type} className="mt-0.5" />
                  <div className="flex-1">
                    <Label
                      htmlFor={type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      {getFeedbackTypeIcon(type)}
                      <span className="font-medium capitalize">
                        {type.replace("_", " ")}
                      </span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getFeedbackTypeDescription(type)}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Rating (for general feedback) */}
          {feedbackType === "general" && (
            <div>
              <Label className="text-sm font-medium">
                How would you rate your experience?
              </Label>
              <div className="mt-2">{renderStarRating()}</div>
            </div>
          )}

          {/* Category */}
          <div>
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="search">Search & Discovery</SelectItem>
                <SelectItem value="valuation">Valuation Calculator</SelectItem>
                <SelectItem value="frameworks">Frameworks</SelectItem>
                <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                <SelectItem value="insights">Insights Dashboard</SelectItem>
                <SelectItem value="ui_ux">User Interface</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="data_accuracy">Data Accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority (for bugs and corrections) */}
          {(feedbackType === "bug_report" || feedbackType === "correction") && (
            <div>
              <Label className="text-sm font-medium">Priority Level</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as FeedbackData["priority"])
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor issue</SelectItem>
                  <SelectItem value="medium">
                    Medium - Moderate impact
                  </SelectItem>
                  <SelectItem value="high">High - Significant issue</SelectItem>
                  <SelectItem value="critical">
                    Critical - System breaking
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Feedback Content */}
          <div>
            <Label className="text-sm font-medium">
              {feedbackType === "correction"
                ? "What needs to be corrected?"
                : feedbackType === "improvement"
                  ? "How can we improve this?"
                  : feedbackType === "bug_report"
                    ? "Describe the issue"
                    : feedbackType === "feature_request"
                      ? "Describe the feature you'd like"
                      : "Your feedback"}
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                feedbackType === "correction"
                  ? "Please describe what information is incorrect and what it should be..."
                  : feedbackType === "improvement"
                    ? "Tell us how we can make this better..."
                    : feedbackType === "bug_report"
                      ? "Describe what happened and what you expected..."
                      : feedbackType === "feature_request"
                        ? "Describe the feature and how it would help..."
                        : "Share your thoughts..."
              }
              className="mt-2"
              rows={4}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {content.length}/500 characters
            </div>
          </div>

          {/* Context Information */}
          {context && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">
                Context Information
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Component: {context.component}</div>
                {context.action && <div>Action: {context.action}</div>}
                <div>Timestamp: {new Date().toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={submitFeedback}
              disabled={isSubmitting || !content.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // Quick feedback buttons
  const QuickFeedback = () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setFeedbackType("general");
          setRating(5);
          setContent("This was helpful!");
          submitFeedback();
        }}
        className="h-8 px-2"
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setFeedbackType("improvement");
          setRating(2);
          setIsOpen(true);
        }}
        className="h-8 px-2"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 px-2"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );

  if (position === "fixed") {
    return (
      <>
        {/* Fixed position feedback button */}
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share Your Feedback</DialogTitle>
              </DialogHeader>
              <FeedbackForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats panel if requested */}
        {showStats && stats && (
          <div className="fixed bottom-6 left-6 z-40">
            <Card className="w-80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Feedback Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.total_feedback}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.average_rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Rating
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Resolution Rate</span>
                    <span>{Math.round(stats.resolution_rate)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${stats.resolution_rate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  }

  // Inline widget
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Share Your Feedback</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FeedbackForm />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing your feedback on this feature.
            </p>
            <QuickFeedback />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Detailed Feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
