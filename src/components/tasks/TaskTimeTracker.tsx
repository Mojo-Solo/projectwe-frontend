"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Play, Pause, Clock, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TaskTimeTracking } from "@/types/task";

interface TaskTimeTrackerProps {
  taskId: string;
  timeEntries: TaskTimeTracking[];
  activeTimer?: TaskTimeTracking | null;
  onTimeLog: (entry: {
    started_at: string;
    ended_at: string;
    description?: string;
    is_billable?: boolean;
    hourly_rate?: number;
  }) => Promise<void>;
  onTimerStart?: () => Promise<void>;
  onTimerStop?: () => Promise<void>;
}

export default function TaskTimeTracker({
  taskId,
  timeEntries,
  activeTimer,
  onTimeLog,
  onTimerStart,
  onTimerStop,
}: TaskTimeTrackerProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentDuration, setCurrentDuration] = useState("00:00:00");
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "",
    endTime: "",
    description: "",
    isBillable: false,
    hourlyRate: 0,
  });

  // Update timer display
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeTimer && activeTimer.task_id === taskId) {
      setIsTimerRunning(true);

      const updateTimer = () => {
        const start = new Date(activeTimer.started_at);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000);

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        setCurrentDuration(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setIsTimerRunning(false);
      setCurrentDuration("00:00:00");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer, taskId]);

  const handleStartTimer = async () => {
    if (onTimerStart) {
      await onTimerStart();
    }
  };

  const handleStopTimer = async () => {
    if (onTimerStop) {
      await onTimerStop();
    }
  };

  const handleLogTime = async () => {
    const startDateTime = `${logForm.date}T${logForm.startTime}:00`;
    const endDateTime = `${logForm.date}T${logForm.endTime}:00`;

    await onTimeLog({
      started_at: startDateTime,
      ended_at: endDateTime,
      description: logForm.description || undefined,
      is_billable: logForm.isBillable,
      hourly_rate: logForm.isBillable ? logForm.hourlyRate : undefined,
    });

    setIsLogDialogOpen(false);
    setLogForm({
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      description: "",
      isBillable: false,
      hourlyRate: 0,
    });
  };

  const totalHours = timeEntries.reduce(
    (sum, entry) => sum + (entry.duration_hours || 0),
    0,
  );

  const billableHours = timeEntries
    .filter((entry) => entry.is_billable)
    .reduce((sum, entry) => sum + (entry.duration_hours || 0), 0);

  const totalBillableAmount = timeEntries
    .filter((entry) => entry.is_billable)
    .reduce((sum, entry) => sum + (entry.billable_amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Time Tracking</h3>

        {/* Timer Display */}
        <div
          className={cn(
            "text-2xl font-mono font-bold text-center py-3 rounded-lg",
            isTimerRunning ? "bg-green-50 text-green-600" : "bg-muted",
          )}
        >
          {currentDuration}
        </div>

        {/* Timer Controls */}
        <div className="flex gap-2">
          {!isTimerRunning ? (
            <Button
              onClick={handleStartTimer}
              className="flex-1"
              variant="default"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          ) : (
            <Button
              onClick={handleStopTimer}
              className="flex-1"
              variant="destructive"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
          )}
          <Button
            onClick={() => setIsLogDialogOpen(true)}
            variant="outline"
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Log Time
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span>Total</span>
            </div>
            <p className="font-medium">{totalHours.toFixed(1)}h</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              <span>Billable</span>
            </div>
            <p className="font-medium">{billableHours.toFixed(1)}h</p>
            {totalBillableAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                ${totalBillableAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Recent Entries */}
        {timeEntries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">
              Recent Entries
            </h4>
            {timeEntries.slice(0, 3).map((entry) => (
              <div key={index}
                key={entry.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium">
                    {entry.formatted_duration ||
                      `${entry.duration_hours?.toFixed(1)}h`}
                  </p>
                  {entry.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {entry.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.started_at), "MMM d")}
                  </p>
                  {entry.is_billable && (
                    <p className="text-xs font-medium text-green-600">
                      ${entry.billable_amount?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Time Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Time</DialogTitle>
            <DialogDescription>
              Manually log time spent on this task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={logForm.date}
                onChange={(e) =>
                  setLogForm({ ...logForm, date: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={logForm.startTime}
                  onChange={(e) =>
                    setLogForm({ ...logForm, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={logForm.endTime}
                  onChange={(e) =>
                    setLogForm({ ...logForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={logForm.description}
                onChange={(e) =>
                  setLogForm({ ...logForm, description: e.target.value })
                }
                placeholder="What did you work on?"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="billable" className="flex items-center gap-2">
                <Switch
                  id="billable"
                  checked={logForm.isBillable}
                  onCheckedChange={(checked) =>
                    setLogForm({ ...logForm, isBillable: checked })
                  }
                />
                Billable
              </Label>
            </div>

            {logForm.isBillable && (
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={logForm.hourlyRate}
                  onChange={(e) =>
                    setLogForm({
                      ...logForm,
                      hourlyRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLogTime}
              disabled={!logForm.startTime || !logForm.endTime}
            >
              Log Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
