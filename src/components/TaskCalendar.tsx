
import { useTaskContext } from "@/contexts/TaskContext";
import { DayCalendar } from "./Calendar/DayCalendar";
import { WeekCalendar } from "./Calendar/WeekCalendar";
import { MonthCalendar } from "./Calendar/MonthCalendar";

export function TaskCalendar() {
  const { currentView } = useTaskContext();

  return (
    <div className="w-full overflow-x-auto">
      {currentView === "day" && <DayCalendar />}
      {currentView === "week" && <WeekCalendar />}
      {currentView === "month" && <MonthCalendar />}
    </div>
  );
}
