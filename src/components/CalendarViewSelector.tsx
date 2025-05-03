
import { useTaskContext } from "@/contexts/TaskContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, CalendarDays, CalendarIcon } from "lucide-react";

export function CalendarViewSelector() {
  const { currentView, setCurrentView } = useTaskContext();
  
  return (
    <div className="mb-6">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && setCurrentView(value as any)}>
        <ToggleGroupItem value="day" aria-label="View day">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only md:inline">Day</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="View week">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only md:inline">Week</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="View month">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only md:inline">Month</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
