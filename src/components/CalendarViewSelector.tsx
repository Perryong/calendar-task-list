
import { useTaskContext } from "@/contexts/TaskContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, CalendarDays, CalendarIcon, Grid, BarChart, TrendingUp, Clock, Trello, Dumbbell } from "lucide-react";
import { CalendarViewType } from "@/lib/types";

const viewOptions: { value: CalendarViewType; label: string; icon: any }[] = [
  { value: "day", label: "Day", icon: CalendarIcon },
  { value: "week", label: "Week", icon: Calendar },
  { value: "month", label: "Month", icon: CalendarDays },
  { value: "kanban", label: "Kanban", icon: Trello },
  { value: "matrix", label: "Matrix", icon: Grid },
  { value: "gantt", label: "Gantt", icon: BarChart },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
];

export function CalendarViewSelector() {
  const { currentView, setCurrentView } = useTaskContext();
  
  return (
    <div className="mb-6">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && setCurrentView(value as CalendarViewType)}>
        {viewOptions.map((option) => {
          const Icon = option.icon;
          return (
            <ToggleGroupItem key={option.value} value={option.value} aria-label={`View ${option.label.toLowerCase()}`}>
              <Icon className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline">{option.label}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}