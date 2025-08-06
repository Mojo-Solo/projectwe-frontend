"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIResponse {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    tokens?: number;
    cost?: number;
  };
}

interface FeedbackData {
  responseId: string;
  rating: "positive" | "negative" | "neutral";
  score?: number; // 1-5 stars
  categories: string[];
  comment?: string;
  improvement_suggestions?: string;
  timestamp: Date;
}

interface FeedbackRatingSystemProps {
  response: AIResponse;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  className?: string;
}

const FEEDBACK_CATEGORIES = [
  { id: "accuracy", label: "Accuracy", icon: CheckCircle },
  { id: "relevance", label: "Relevance", icon: TrendingUp },
  { id: "clarity", label: "Clarity", icon: MessageSquare },
  { id: "completeness", label: "Completeness", icon: Star },
  { id: "actionability", label: "Actionable", icon: CheckCircle },
  { id: "timeliness", label: "Timely", icon: TrendingUp },
];

export function FeedbackRatingSystem({
  response,
  onFeedbackSubmit,
  className,
}: FeedbackRatingSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<
    "positive" | "negative" | "neutral" | null
  >(null);
  const [starRating, setStarRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [improvements, setImprovements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickRating = (quickRating: "positive" | "negative") => {
    if (quickRating === rating) {
      // If same rating clicked, submit immediately with basic feedback
      handleSubmit(quickRating);
    } else {
      setRating(quickRating);
      setIsOpen(true);
    }
  };

  const handleStarClick = (star: number) => {
    setStarRating(star);
    if (star >= 4) {
      setRating("positive");
    } else if (star <= 2) {
      setRating("negative");
    } else {
      setRating("neutral");
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = async (quickRating?: "positive" | "negative") => {
    const finalRating = quickRating || rating;
    if (!finalRating) return;

    setIsSubmitting(true);

    const feedback: FeedbackData = {
      responseId: response.id,
      rating: finalRating,
      score:
        starRating ||
        (finalRating === "positive" ? 5 : finalRating === "negative" ? 2 : 3),
      categories: selectedCategories,
      comment: comment.trim() || undefined,
      improvement_suggestions: improvements.trim() || undefined,
      timestamp: new Date(),
    };

    try {
      await onFeedbackSubmit(feedback);

      // Reset form
      setRating(null);
      setStarRating(0);
      setSelectedCategories([]);
      setComment("");
      setImprovements("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Rating Buttons */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Was this helpful?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickRating("positive")}
          className={cn(
            "h-8 w-8 p-0",
            rating === "positive" && "bg-green-100 text-green-600",
          )}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickRating("negative")}
          className={cn(
            "h-8 w-8 p-0",
            rating === "negative" && "bg-red-100 text-red-600",
          )}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-xs"
        >
          Detailed feedback
        </Button>
      </div>

      {/* Detailed Feedback Form */}
      {isOpen && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rate this AI response</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Overall Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button key={index}
                    key={star}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStarClick(star)}
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        star <= starRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  </Button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {starRating > 0 && `${starRating}/5`}
                </span>
              </div>
            </div>

            {/* Category Feedback */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What worked well?</label>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <Button key={index}
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                      className="h-8"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional comments</label>
              <Textarea
                placeholder="What did you think about this response? Any specific insights or concerns?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[60px]"
              />
            </div>

            {/* Improvement Suggestions */}
            {rating === "negative" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  How could this be improved?
                </label>
                <Textarea
                  placeholder="What specific improvements would make this response more helpful?"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            )}

            {/* AI Response Metadata */}
            {response.metadata && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-600">
                  Response Details
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  {response.metadata.confidence && (
                    <span>
                      Confidence:{" "}
                      {Math.round(response.metadata.confidence * 100)}%
                    </span>
                  )}
                  {response.metadata.tokens && (
                    <span>Tokens: {response.metadata.tokens}</span>
                  )}
                  {response.metadata.cost && (
                    <span>Cost: ${response.metadata.cost.toFixed(4)}</span>
                  )}
                  {response.metadata.sources && (
                    <span>Sources: {response.metadata.sources.length}</span>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={!rating || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Confirmation */}
      {rating && !isOpen && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Thank you for your feedback!</span>
        </div>
      )}
    </div>
  );
}

// Usage tracking and analytics component
export function FeedbackAnalytics({
  feedbackData,
}: {
  feedbackData: FeedbackData[];
}) {
  const totalFeedback = feedbackData.length;
  const positiveFeedback = feedbackData.filter(
    (f) => f.rating === "positive",
  ).length;
  const negativeFeedback = feedbackData.filter(
    (f) => f.rating === "negative",
  ).length;
  const averageScore =
    feedbackData.reduce((sum, f) => sum + (f.score || 0), 0) / totalFeedback;

  const categoryStats = FEEDBACK_CATEGORIES.map((category) => ({
    ...category,
    count: feedbackData.reduce(
      (sum, f) => sum + (f.categories.includes(category.id) ? 1 : 0),
      0,
    ),
  }));

  return (
    <Card key={index}>
      <CardHeader>
        <CardTitle>AI Response Feedback Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalFeedback}</div>
            <div className="text-sm text-muted-foreground">Total Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {positiveFeedback}
            </div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {negativeFeedback}
            </div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Top Feedback Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categoryStats
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.label} ({category.count})
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
