import { useMemo } from "react";
import { Task, Filter } from "@/lib/types";

export function useTaskFiltering(tasks: Task[], filter: Filter) {
  return useMemo(() => {
    return tasks.filter(task => {
      if (filter.completed !== undefined && task.completed !== filter.completed) {
        return false;
      }
      
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      
      if (filter.label && (!task.labels || !task.labels.includes(filter.label))) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filter]);
}