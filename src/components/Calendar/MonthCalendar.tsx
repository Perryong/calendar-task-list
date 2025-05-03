import { useTaskContext } from "@/contexts/TaskContext";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MonthCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();

  /* ---------- HEADER ---------- */
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{format(selectedDate, "MMMM yyyy")}</h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  /* ---------- WEEKDAY LABELS ---------- */
  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>
    );
  };

  /* ---------- MONTH GRID ---------- */
  const renderCells = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let day = startDate;
    const rows: JSX.Element[] = [];

    while (day <= endDate) {
      const week: JSX.Element[] = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const tasks = getTasksForDate(cloneDay);

        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);

        week.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={`calendar-day cursor-pointer transition-colors ${(isToday || isSelected) ? "border-2" : ""} ${
              isSelected
                ? "border-primary bg-primary/5"
                : isToday
                ? "border-blue-500 bg-primary/5" /* Changed from border-primary to border-blue-500 */
                : "border-gray-300"
            } ${!isCurrentMonth ? "different-month" : ""}`}
          >
            <div className="text-right text-sm mb-1">{format(day, "d")}</div>
            <div className="overflow-auto max-h-[75px] space-y-1">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} compact />
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {week}
        </div>
      );
    }

    return <div className="space-y-1">{rows}</div>;
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
