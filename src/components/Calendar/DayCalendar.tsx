
import { useTaskContext } from "@/contexts/TaskContext";
import { format, addDays, subDays } from "date-fns";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DayCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();
  const tasks = getTasksForDate(selectedDate);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          <span className="block sm:hidden">{format(selectedDate, "EEE, MMM d, yyyy")}</span>
          <span className="hidden sm:block">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
        </h2>
        <div className="flex gap-2 justify-center sm:justify-end">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
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
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="touch-target"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-card rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
          Tasks for {format(selectedDate, "PP")}
        </h3>
        
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks for today</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}