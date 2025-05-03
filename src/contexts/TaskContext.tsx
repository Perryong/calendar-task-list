
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Task, Filter } from "@/lib/types";
import { createId, generateSampleTasks } from "@/lib/data";
import { isSameDay } from "date-fns";
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentView: 'day' | 'week' | 'month';
  setCurrentView: (view: 'day' | 'week' | 'month') => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // For now we'll use sample data, later this could be from localStorage or a backend
    return generateSampleTasks();
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const [filter, setFilter] = useState<Filter>({});

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: createId() };
    setTasks((prev) => [...prev, newTask]);
    toast.success("Task added successfully");
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success("Task deleted successfully");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksForDate = (date: Date): Task[] => {
    const filteredTasks = tasks.filter((task) => {
      // First filter by date
      const isSameDate = isSameDay(task.date, date);
      if (!isSameDate) return false;

      // Then apply additional filters
      if (filter.completed !== undefined && task.completed !== filter.completed) {
        return false;
      }
      if (filter.priority !== undefined && task.priority !== filter.priority) {
        return false;
      }
      if (filter.label !== undefined && !task.labels?.includes(filter.label)) {
        return false;
      }
      return true;
    });

    return filteredTasks;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedDate,
        setSelectedDate,
        currentView,
        setCurrentView,
        filter,
        setFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksForDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
