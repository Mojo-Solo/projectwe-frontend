"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Send, Reply, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskComment } from "@/types/task";

interface TaskCommentSectionProps {
  taskId: string;
  comments: TaskComment[];
  onCommentAdd: (content: string, parentId?: string) => Promise<void>;
  onCommentEdit?: (commentId: string, content: string) => Promise<void>;
  onCommentDelete?: (commentId: string) => Promise<void>;
}

export default function TaskCommentSection({
  taskId,
  comments,
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
}: TaskCommentSectionProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onCommentAdd(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onCommentAdd(content, parentId);
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || !onCommentEdit) return;

    setIsSubmitting(true);
    try {
      await onCommentEdit(commentId, editContent);
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onCommentDelete) return;

    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await onCommentDelete(commentId);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const renderComment = (comment: TaskComment, isReply = false) => {
    const isEditing = editingComment === comment.id;
    const canEdit = comment.user_id === currentUserId && !comment.is_system;
    const canDelete =
      canEdit ||
      session?.user?.role === "admin" ||
      session?.user?.role === "owner";

    return (
      <div
        key={comment.id}
        className={cn("flex gap-3", isReply && "ml-12 mt-3")}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar} />
          <AvatarFallback>
            {comment.user?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
            {comment.is_edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
            {comment.is_system && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEditComment(comment.id)}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center gap-2 mt-2">
                {!comment.is_system && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {(canEdit || canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {canEdit && (
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                        >
                          <Edit3 className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    className="min-h-[80px]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitReply(comment.id, e.currentTarget.value);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const textarea = e.currentTarget
                          .closest("div")
                          ?.querySelector("textarea");
                        if (textarea) {
                          handleSubmitReply(comment.id, textarea.value);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingTo(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div key={index} className="space-y-4">
      {/* New Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleSubmitComment();
            }
          }}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Press ⌘+Enter to submit
          </p>
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments
            .filter((comment) => !comment.parent_comment_id)
            .map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
