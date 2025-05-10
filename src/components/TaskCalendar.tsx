
import { useTaskContext } from "@/contexts/TaskContext";
import { DayCalendar } from "./Calendar/DayCalendar";
import { WeekCalendar } from "./Calendar/WeekCalendar";
import { MonthCalendar } from "./Calendar/MonthCalendar";
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
    </div>
  );
}