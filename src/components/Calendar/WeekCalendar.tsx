
import { useTaskContext } from "@/contexts/TaskContext";
import { useEffect } from "react";
import {
  format, 
  addDays, 
  startOfWeek, 
  subWeeks, 
  addWeeks,
  isSameDay,
  isToday
} from "date-fns";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function WeekCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();
  
  // Auto-advance to current day at midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (!isSameDay(selectedDate, now) && isToday(now)) {
        setSelectedDate(now);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [selectedDate, setSelectedDate]);
  
  // Get start of week for the selected date
  const weekStart = startOfWeek(selectedDate);
  
  // Create an array of days for the whole week
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          <span className="block sm:hidden">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <span className="hidden sm:block">
            {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </span>
        </h2>
        <div className="flex gap-2 justify-center sm:justify-end">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
            className="touch-target"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-2 text-sm"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
            className="touch-target"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toString()} 
                className={`min-w-[280px] p-3 border rounded-lg snap-center ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="text-center mb-3">
                  <p className="text-sm font-medium">{format(day, "EEEE")}</p>
                  <p className={`text-2xl font-bold ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</p>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((task) => (
                      <TaskItem key={task.id} task={task} compact />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={`p-3 border rounded-lg ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className="text-center mb-2">
                <p className="text-sm font-medium">{format(day, "EEEE")}</p>
                <p className={`text-xl font-bold ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</p>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => (
                    <TaskItem key={task.id} task={task} compact />
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}