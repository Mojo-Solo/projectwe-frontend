"use client";

import React from "react";
import { Bookmark, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookmarkPanelProps {
  bookmarks: Array<{ page: number; label: string }>;
  onBookmarkSelect: (page: number) => void;
  onBookmarkRemove: (page: number) => void;
  onBookmarkUpdate?: (page: number, label: string) => void;
  onClose: () => void;
}

export function BookmarkPanel({
  bookmarks,
  onBookmarkSelect,
  onBookmarkRemove,
  onBookmarkUpdate,
  onClose,
}: BookmarkPanelProps) {
  const [editingBookmark, setEditingBookmark] = React.useState<number | null>(
    null,
  );
  const [tempLabel, setTempLabel] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState<number | null>(null);

  const startEditing = (bookmark: { page: number; label: string }) => {
    setEditingBookmark(bookmark.page);
    setTempLabel(bookmark.label);
  };

  const saveEdit = (page: number) => {
    if (onBookmarkUpdate && tempLabel.trim()) {
      onBookmarkUpdate(page, tempLabel.trim());
    }
    setEditingBookmark(null);
    setTempLabel("");
  };

  const cancelEdit = () => {
    setEditingBookmark(null);
    setTempLabel("");
  };

  const confirmDelete = (page: number) => {
    onBookmarkRemove(page);
    setDeleteConfirm(null);
  };

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmarks
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {bookmarks.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {bookmarks
              .sort((a, b) => a.page - b.page)
              .map((bookmark) => (
                <div key={index}
                  key={bookmark.page}
                  className="group flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Bookmark className="h-4 w-4 text-blue-600 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    {editingBookmark === bookmark.page ? (
                      <Input
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        onBlur={() => saveEdit(bookmark.page)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(bookmark.page);
                          } else if (e.key === "Escape") {
                            cancelEdit();
                          }
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                    ) : (
                      <button
                        className="w-full text-left"
                        onClick={() => onBookmarkSelect(bookmark.page)}
                        onDoubleClick={() => startEditing(bookmark)}
                      >
                        <p className="text-sm font-medium truncate">
                          {bookmark.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Page {bookmark.page}
                        </p>
                      </button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteConfirm(bookmark.page)}
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No bookmarks yet</p>
            <p className="text-xs mt-1">Click the bookmark icon to add one</p>
          </div>
        </div>
      )}

      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this bookmark? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && confirmDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
