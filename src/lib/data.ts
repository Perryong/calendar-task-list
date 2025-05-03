
import { Task } from "./types";
import { addDays, subDays } from "date-fns";

// Helper to create a unique ID
export const createId = (): string => Math.random().toString(36).substring(2, 9);

// Sample tasks data for initial state
export const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(today, 1);
  
  return [
    {
      id: createId(),
      title: "Morning workout",
      description: "30-minute cardio session",
      date: today,
      completed: true,
      priority: "medium",
      labels: ["health"]
    },

  ];
};
