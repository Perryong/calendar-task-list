
import { useTaskContext } from "@/contexts/TaskContext";
import { DayCalendar } from "./Calendar/DayCalendar";
import { WeekCalendar } from "./Calendar/WeekCalendar";
import { MonthCalendar } from "./Calendar/MonthCalendar";
import { KanbanBoard } from "./Calendar/KanbanBoard";
import { MatrixView } from "./Calendar/MatrixView";
import { GanttView } from "./Calendar/GanttView";
import { FitnessView } from "./Calendar/FitnessView";
import { TaskCalendarLoading } from "./TaskCalendarLoading";

export function TaskCalendar() {
  const { currentView, isLoading } = useTaskContext();

  if (isLoading) {
    return <TaskCalendarLoading />;
  }

  return (
    <div className="w-full overflow-x-auto">
      {currentView === "day" && <DayCalendar />}
      {currentView === "week" && <WeekCalendar />}
      {currentView === "month" && <MonthCalendar />}
      {currentView === "kanban" && <KanbanBoard />}
      {currentView === "matrix" && <MatrixView />}
      {currentView === "gantt" && <GanttView />}
      {currentView === "fitness" && <FitnessView />}
      {currentView === "timeline" && (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Timeline view coming soon...
        </div>
      )}
    </div>
  );
}