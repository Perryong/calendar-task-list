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
import { MonthEventChip } from "./MonthEventChip";
import { DayTaskDrawer } from "./DayTaskDrawer";
import { TaskFormDialog } from "../TaskFormDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

export function MonthCalendar() {
  const { selectedDate, setSelectedDate, getTasksForDate } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormDate, setTaskFormDate] = useState<Date | null>(null);

  const renderHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          {format(selectedDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2 justify-center sm:justify-end">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
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
            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            className="touch-target"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const mobileDays = ["S", "M", "T", "W", "T", "F", "S"];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, index) => (
          <div key={day} className="text-center font-medium text-sm p-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{mobileDays[index]}</span>
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
        
        const sortedTasks = tasks.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        week.push(
          <div
            key={day.toString()}
            className={`
              min-h-[80px] sm:min-h-[100px] md:min-h-[120px] p-2 transition-colors
              ${isToday ? "bg-primary/5 ring-1 ring-primary/20 rounded-lg" : ""}
              ${!isCurrentMonth ? "opacity-50" : "hover:bg-accent/20 rounded-lg"}
            `}
          >
            <DayTaskDrawer
              date={cloneDay}
              tasks={sortedTasks}
              onAddTask={() => {
                setTaskFormDate(cloneDay);
                setShowTaskForm(true);
              }}
              trigger={
                <div className="w-full h-full cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div 
                      className={`
                        text-sm font-semibold px-2 py-1 rounded-full transition-colors
                        ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                      `}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {sortedTasks.slice(0, 3).map((task) => (
                      <MonthEventChip key={task.id} task={task} />
                    ))}
                    {sortedTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground px-2 py-1 hover:text-foreground transition-colors">
                        +{sortedTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              }
            />
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
    <div className="w-full relative">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      {/* Floating Add Button */}
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg md:hidden"
        size="icon"
        onClick={() => {
          setTaskFormDate(selectedDate);
          setShowTaskForm(true);
        }}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <TaskFormDialog
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        mode="add"
        defaultDate={taskFormDate || undefined}
      />
    </div>
  );
}