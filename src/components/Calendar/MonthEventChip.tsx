import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MonthEventChipProps {
  task: Task;
  onClick?: () => void;
}

export function MonthEventChip({ task, onClick }: MonthEventChipProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100';
      case 'low':
        return 'border-l-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100';
      default:
        return 'border-l-muted-foreground bg-muted text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        "text-xs px-2 py-1 rounded border-l-2 cursor-pointer truncate transition-colors hover:bg-accent",
        getPriorityColor(task.priority)
      )}
      onClick={onClick}
      title={task.title}
    >
      {task.title}
    </div>
  );
}