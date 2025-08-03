
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
      title: "Complete project proposal",
      description: "Finalize the project proposal document",
      date: today,
      completed: false,
      priority: "high",
      labels: ["work", "urgent"],
      status: "todo",
      urgency: "high",
    },
    {
      id: createId(),
      title: "Schedule team meeting",
      description: "Set up weekly sync for project status updates",
      date: tomorrow,
      completed: false,
      priority: "medium",
      labels: ["work"],
      status: "in_progress",
      urgency: "medium",
    },
    {
      id: createId(),
      title: "Grocery shopping",
      description: "Buy fruits, vegetables, and milk",
      date: yesterday,
      completed: true,
      priority: "low",
      labels: ["personal"],
      status: "done",
      urgency: "low",
    },
    {
      id: createId(),
      title: "Morning workout",
      description: "30-minute cardio session",
      date: today,
      completed: true,
      priority: "medium",
      labels: ["health"],
      status: "done",
      urgency: "medium",
    },
    {
      id: createId(),
      title: "Call mom",
      description: "Check in and catch up",
      date: tomorrow,
      completed: false,
      priority: "medium",
      labels: ["personal"],
      status: "todo",
      urgency: "medium",
    }
  ];
};