import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useDragAndDrop() {
  const { updateTask } = useTaskContext();
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      id: task.id,
      title: task.title,
      priority: task.priority,
      urgency: task.urgency,
      date: task.date.toISOString()
    }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleMatrixDrop = async (e: React.DragEvent, quadrant: string, onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const taskId = dragData.id;
      
      // Map quadrant to priority/urgency
      const quadrantMapping = {
        'urgent-important': { priority: 'high' as const, urgency: 'high' as const },
        'not-urgent-important': { priority: 'high' as const, urgency: 'low' as const },
        'urgent-not-important': { priority: 'low' as const, urgency: 'high' as const },
        'not-urgent-not-important': { priority: 'low' as const, urgency: 'low' as const },
      };

      const mapping = quadrantMapping[quadrant as keyof typeof quadrantMapping];
      if (!mapping) return;

      // We'll need to get the current task from the context hook
      // This will be handled by the component calling this hook

      const updates = {
        priority: mapping.priority,
        urgency: mapping.urgency
      };

      await onUpdate(taskId, updates);
      
      toast({
        title: "Task moved",
        description: `"${dragData.title}" moved to ${quadrant.replace('-', ' & ').replace('not-', 'not ')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGanttDrop = async (e: React.DragEvent, newDate: Date, onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const taskId = dragData.id;
      
      const updates = { date: newDate };
      await onUpdate(taskId, updates);
      
      toast({
        title: "Task rescheduled",
        description: `"${dragData.title}" moved to ${newDate.toLocaleDateString()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return {
    handleDragStart,
    handleMatrixDrop,
    handleGanttDrop,
    handleDragOver
  };
}