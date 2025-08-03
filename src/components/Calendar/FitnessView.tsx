import { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { format, addDays, startOfWeek, subWeeks, addWeeks, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { FitnessActivityCard } from "../FitnessActivityCard";
import { FitnessFormDialog } from "../FitnessFormDialog";
import { FitnessActivity } from "@/lib/types";

const STORAGE_KEY = 'fitness_activities';

const serializeActivities = (activities: FitnessActivity[]): string => {
  return JSON.stringify(activities, (key, value) => {
    if ((key === 'date' || key === 'created_at' || key === 'updated_at') && value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

const deserializeActivities = (activitiesJson: string): FitnessActivity[] => {
  return JSON.parse(activitiesJson, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

export function FitnessView() {
  const { selectedDate, setSelectedDate } = useTaskContext();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<FitnessActivity | undefined>();
  const [initialDialogDate, setInitialDialogDate] = useState<Date | undefined>();
  const [fitnessActivities, setFitnessActivities] = useState<FitnessActivity[]>([]);

  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(STORAGE_KEY);
      if (storedActivities) {
        const activities = deserializeActivities(storedActivities);
        setFitnessActivities(activities);
      }
    } catch (error) {
      console.error('Failed to load fitness activities from localStorage:', error);
    }
  }, []);

  const saveActivitiesToStorage = (activities: FitnessActivity[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeActivities(activities));
    } catch (error) {
      console.error('Failed to save fitness activities to localStorage:', error);
    }
  };

  const weekStart = startOfWeek(selectedDate);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getActivitiesForDate = (date: Date) => {
    return fitnessActivities.filter(activity => isSameDay(activity.date, date));
  };

  const handleAddActivity = (day?: Date) => {
    setSelectedActivity(undefined);
    setInitialDialogDate(day ?? selectedDate);
    setIsFormDialogOpen(true);
  };

  const handleEditActivity = (activity: FitnessActivity) => {
    setSelectedActivity(activity);
    setIsFormDialogOpen(true);
  };

  const handleSaveActivity = (activity: FitnessActivity) => {
    let updatedActivities: FitnessActivity[];

    if (selectedActivity) {
      updatedActivities = fitnessActivities.map(a => a.id === activity.id ? activity : a);
    } else {
      updatedActivities = [...fitnessActivities, activity];
    }

    setFitnessActivities(updatedActivities);
    saveActivitiesToStorage(updatedActivities);

    // Reset dialog and clear highlight
    setIsFormDialogOpen(false);
    setSelectedActivity(undefined);
    setInitialDialogDate(undefined);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = fitnessActivities.filter(a => a.id !== activityId);
    setFitnessActivities(updatedActivities);
    saveActivitiesToStorage(updatedActivities);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          <span className="block sm:hidden">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <span className="hidden sm:block">
            Fitness Week: {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </span>
        </h2>
        <div className="flex gap-2 justify-center sm:justify-end">
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}>
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button onClick={() => handleAddActivity()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:grid md:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayActivities = getActivitiesForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-[250px] p-3 border rounded-lg flex flex-col ${isToday ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <div className="text-center mb-2">
                <p className="text-sm font-medium">{format(day, "EEEE")}</p>
                <p className={`text-xl font-bold ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-2 max-h-[300px] overflow-y-auto">
                {dayActivities.length > 0 ? (
                  <>
                    {dayActivities.map((activity) => (
                      <FitnessActivityCard
                        key={activity.id}
                        activity={activity}
                        onEdit={handleEditActivity}
                        onDelete={handleDeleteActivity}
                        compact
                      />
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => handleAddActivity(day)}>
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={() => handleAddActivity(day)}>
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Add activity</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form dialog */}
      <FitnessFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setSelectedActivity(undefined);
          setInitialDialogDate(undefined);
        }}
        onSave={handleSaveActivity}
        activity={selectedActivity}
      />
    </div>
  );
}
