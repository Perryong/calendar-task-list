import { Task, TaskUrgency } from "@/lib/types";

export const taskUtils = {
  groupByStatus: (tasks: Task[]) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  },
  
  groupByPriority: (tasks: Task[]) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.priority]) acc[task.priority] = [];
      acc[task.priority].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  },
  
  categorizeByMatrix: (tasks: Task[]) => {
    return tasks.reduce((acc, task) => {
      const isUrgent = task.urgency === 'high';
      const isImportant = task.priority === 'high';
      
      let quadrant: string;
      if (isUrgent && isImportant) quadrant = 'urgent-important';
      else if (!isUrgent && isImportant) quadrant = 'not-urgent-important';
      else if (isUrgent && !isImportant) quadrant = 'urgent-not-important';
      else quadrant = 'not-urgent-not-important';
      
      if (!acc[quadrant]) acc[quadrant] = [];
      acc[quadrant].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  },
  
  sortByDate: (tasks: Task[]) => 
    [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime()),
  
  sortByPriority: (tasks: Task[]) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  },
  
  getTaskDuration: (task: Task) => 
    task.estimated_duration || 60, // Default 60 minutes
  
  calculateProgress: (task: Task) => {
    if (task.completed) return 100;
    if (task.status === 'in_progress') return 50;
    return 0;
  }
};