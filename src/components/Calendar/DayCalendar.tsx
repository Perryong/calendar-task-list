
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
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
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-card rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Tasks for {format(selectedDate, "PP")}</h3>
        
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks for today</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
