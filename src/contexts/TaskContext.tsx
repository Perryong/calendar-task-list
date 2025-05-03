
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

// Helper function to serialize and deserialize dates in tasks
const serializeTasks = (tasks: Task[]): string => {
  return JSON.stringify(tasks, (key, value) => {
    if (key === 'date' && value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

const deserializeTasks = (tasksJson: string): Task[] => {
  return JSON.parse(tasksJson, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

interface TaskProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'todo_calendar_tasks';

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load tasks from localStorage first
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        return deserializeTasks(savedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
        // Fallback to sample tasks if parsing fails
        return generateSampleTasks();
      }
    } else {
      // No saved tasks found, use sample data
      return generateSampleTasks();
    }
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const [filter, setFilter] = useState<Filter>({});

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeTasks(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

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
