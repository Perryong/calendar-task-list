
import { useTaskContext } from "@/contexts/TaskContext";
import {
  format, 
  addDays, 
  startOfWeek, 
  subWeeks, 
  addWeeks,
  isSameDay
} from "date-fns";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function WeekCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();
  
  // Get start of week for the selected date
  const weekStart = startOfWeek(selectedDate);
  
  // Create an array of days for the whole week
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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
              
              <div className="space-y-2">
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
