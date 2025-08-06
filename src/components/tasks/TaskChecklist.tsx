"use client";

import React, { useState } from "react";
import { Plus, X, GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ChecklistItem } from "@/types/task";

interface TaskChecklistProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
}

interface SortableChecklistItemProps {
  item: ChecklistItem;
  index: number;
  onToggle: (index: number) => void;
  onEdit: (index: number, title: string) => void;
  onDelete: (index: number) => void;
}

function SortableChecklistItem({
  item,
  index,
  onToggle,
  onEdit,
  onDelete,
}: SortableChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `item-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(index, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(item.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border bg-background",
        isDragging && "opacity-50 shadow-lg",
        item.completed && "bg-muted/50",
      )}
    >
      <div
        {...(attributes || {})}
        {...(listeners || {})}
        className="cursor-move text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Checkbox
        checked={item.completed}
        onCheckedChange={() => onToggle(index)}
        className="flex-shrink-0"
      />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="h-8"
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex-1 text-sm cursor-pointer",
              item.completed && "line-through text-muted-foreground",
            )}
            onClick={() => setIsEditing(true)}
          >
            {item.title}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

export default function TaskChecklist({
  checklist,
  onChange,
}: TaskChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress =
    checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onChange([
        ...checklist,
        { title: newItemTitle.trim(), completed: false },
      ]);
      setNewItemTitle("");
      setIsAddingItem(false);
    }
  };

  const handleToggle = (index: number) => {
    const updated = [...checklist];
    updated[index] = {
      ...updated[index],
      completed: !updated[index].completed,
    };
    onChange(updated);
  };

  const handleEdit = (index: number, title: string) => {
    const updated = [...checklist];
    updated[index] = { ...updated[index], title };
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    onChange(checklist.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split("-")[1]);
      const newIndex = parseInt(over.id.toString().split("-")[1]);
      onChange(arrayMove(checklist, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      {checklist.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {checklist.length} completed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Checklist Items */}
      {checklist.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={checklist.map((_, index) => `item-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <div key={index} className="space-y-2">
              {checklist.map((item, index) => (
                <div key={`item-${index}`} className="group">
                  <SortableChecklistItem
                    item={item}
                    index={index}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Item */}
      {isAddingItem ? (
        <div className="flex items-center gap-2">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddItem();
              if (e.key === "Escape") {
                setNewItemTitle("");
                setIsAddingItem(false);
              }
            }}
            placeholder="Enter checklist item"
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={handleAddItem}>
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setNewItemTitle("");
              setIsAddingItem(false);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingItem(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add item
        </Button>
      )}
    </div>
  );
}
