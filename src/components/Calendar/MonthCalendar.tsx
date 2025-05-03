
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
  subMonths
} from "date-fns";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MonthCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();

  const renderHeader = () => {
    return (
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
          <Button 
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
          >
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
  };

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

  const renderCells = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let day = startDate;
    const rows = [];

    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const tasks = getTasksForDate(cloneDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        
        week.push(
          <div
            key={day.toString()}
            className={`calendar-day ${isToday ? "today" : ""} ${
              !isCurrentMonth ? "different-month" : ""
            }`}
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

  return (
    <div className="w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
