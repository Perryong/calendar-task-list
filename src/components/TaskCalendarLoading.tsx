
import { Loader2 } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";

export function TaskCalendarLoading() {
  const { syncStatus } = useTaskContext();
  
  const isError = syncStatus === 'error';
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <Loader2 className={`h-8 w-8 animate-spin mb-4 ${isError ? 'text-destructive' : 'text-primary'}`} />
      <p className={`${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
        {isError 
          ? "Error loading tasks. Using local data only."
          : "Loading your tasks..."}
      </p>
    </div>
  );
}