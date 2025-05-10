
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Task, Filter } from "@/lib/types";
import { generateSampleTasks } from "@/lib/data";
import { isSameDay } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
  isLoading: boolean;
  syncStatus: 'synced' | 'syncing' | 'error';
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

// Convert Supabase database row to Task object
const dbTaskToTask = (dbTask: any): Task => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || undefined,
    date: new Date(dbTask.date),
    completed: dbTask.completed,
    priority: dbTask.priority,
    labels: dbTask.labels || []
  };
};

// Convert Task object to Supabase database record
const taskToDbTask = (task: Task) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || null,
    date: task.date.toISOString(),
    completed: task.completed,
    priority: task.priority,
    labels: task.labels || []
  };
};

interface TaskProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'todo_calendar_tasks';
const CACHE_TIMESTAMP_KEY = 'todo_calendar_cache_timestamp';

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const [filter, setFilter] = useState<Filter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  
  // Initial load from cache and then Supabase
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setSyncStatus('syncing');
      
      // First try loading from cache for immediate display
      try {
        const cachedTasksJson = localStorage.getItem(STORAGE_KEY);
        if (cachedTasksJson) {
          const cachedTasks = deserializeTasks(cachedTasksJson);
          setTasks(cachedTasks);
          console.log('Loaded tasks from cache:', cachedTasks.length);
        }
      } catch (error) {
        console.error('Failed to load tasks from cache:', error);
      }
      
      // Then fetch from Supabase
      try {
        const { data: dbTasks, error } = await supabase
          .from('tasks')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (dbTasks) {
          const transformedTasks = dbTasks.map(dbTaskToTask);
          setTasks(transformedTasks);
          
          // Update cache
          localStorage.setItem(STORAGE_KEY, serializeTasks(transformedTasks));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
          
          console.log('Loaded tasks from Supabase:', transformedTasks.length);
          setSyncStatus('synced');
        }
      } catch (error) {
        console.error('Error fetching tasks from Supabase:', error);
        setSyncStatus('error');
        
        // If Supabase fetch fails but we have no cached data, use sample tasks
        if (tasks.length === 0) {
          const sampleTasks = generateSampleTasks();
          setTasks(sampleTasks);
          toast.error('Could not connect to database, using sample tasks');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Helper function to save tasks to both Supabase and cache
  const saveTask = async (task: Task, action: 'add' | 'update' | 'delete') => {
    setSyncStatus('syncing');
    
    try {
      if (action === 'add' || action === 'update') {
        const dbTask = taskToDbTask(task);
        
        if (action === 'add') {
          const { error } = await supabase.from('tasks').insert(dbTask);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('tasks')
            .update(dbTask)
            .eq('id', task.id);
          if (error) throw error;
        }
      } else if (action === 'delete') {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task.id);
        if (error) throw error;
      }
      
      // Update cache timestamp
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
      setSyncStatus('synced');
    } catch (error) {
      console.error(`Error ${action} task in Supabase:`, error);
      setSyncStatus('error');
      toast.error(`Failed to ${action} task. Changes saved locally only.`);
    }
  };

  // Add task function
  const addTask = async (task: Omit<Task, "id">) => {
    // Use UUID v4 for proper UUID generation compatible with Supabase
    const newTask = { ...task, id: uuidv4() };
    
    // Update local state immediately
    setTasks((prev) => {
      const updated = [...prev, newTask];
      localStorage.setItem(STORAGE_KEY, serializeTasks(updated));
      return updated;
    });
    
    // Save to Supabase
    await saveTask(newTask, 'add');
    toast.success("Task added successfully");
  };

  // Update task function
  const updateTask = async (updatedTask: Task) => {
    // Update local state immediately
    setTasks((prev) => {
      const updated = prev.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      localStorage.setItem(STORAGE_KEY, serializeTasks(updated));
      return updated;
    });
    
    // Save to Supabase
    await saveTask(updatedTask, 'update');
    toast.success("Task updated successfully");
  };

  // Delete task function
  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;
    
    // Update local state immediately
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      localStorage.setItem(STORAGE_KEY, serializeTasks(updated));
      return updated;
    });
    
    // Save to Supabase
    await saveTask(taskToDelete, 'delete');
    toast.success("Task deleted successfully");
  };

  // Toggle task completion function
  const toggleTaskCompletion = async (id: string) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    
    const updatedTask = { 
      ...taskToToggle, 
      completed: !taskToToggle.completed 
    };
    
    // Update local state immediately
    setTasks((prev) => {
      const updated = prev.map((task) => 
        task.id === id ? updatedTask : task
      );
      localStorage.setItem(STORAGE_KEY, serializeTasks(updated));
      return updated;
    });
    
    // Save to Supabase
    await saveTask(updatedTask, 'update');
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
        isLoading,
        syncStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};