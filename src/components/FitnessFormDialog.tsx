import { useState, useEffect } from "react";
import { FitnessActivity, FitnessActivityType } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface FitnessFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: FitnessActivity) => void;
  activity?: FitnessActivity;
}

const activityTypes: { value: FitnessActivityType; label: string }[] = [
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength Training" },
  { value: "flexibility", label: "Flexibility" },
  { value: "yoga", label: "Yoga" },
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "swimming", label: "Swimming" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];

const intensityLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function FitnessFormDialog({ isOpen, onClose, onSave, activity }: FitnessFormDialogProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<FitnessActivityType>("cardio");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setType(activity.type);
      setDuration(activity.duration?.toString() || "");
      setIntensity(activity.intensity || "medium");
      setCalories(activity.calories?.toString() || "");
      setNotes(activity.notes || "");
      setDate(activity.date);
    } else {
      // Reset form for new activity
      setTitle("");
      setType("cardio");
      setDuration("");
      setIntensity("medium");
      setCalories("");
      setNotes("");
      setDate(new Date());
    }
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    const activityData: FitnessActivity = {
      id: activity?.id || uuidv4(),
      title: title.trim(),
      type,
      duration: duration ? parseInt(duration) : undefined,
      intensity,
      calories: calories ? parseInt(calories) : undefined,
      notes: notes.trim() || undefined,
      date,
      completed: activity?.completed || false,
      created_at: activity?.created_at || new Date(),
      updated_at: new Date(),
    };

    onSave(activityData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Edit Fitness Activity" : "Add Fitness Activity"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Run, Gym Workout"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Activity Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as FitnessActivityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((activityType) => (
                    <SelectItem key={activityType.value} value={activityType.value}>
                      {activityType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensity">Intensity</Label>
              <Select value={intensity} onValueChange={(value) => setIntensity(value as "low" | "medium" | "high")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intensityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="200"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about your workout..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {activity ? "Update Activity" : "Add Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}