import { useState } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { useToast } from "@/hooks/use-toast";

export function useTaskActions() {
  const { updateTask, deleteTask } = useTaskContext();
  const { toast } = useToast();
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      const newCompleted = !task.completed;
      const updatedTask = { 
        ...task, 
        completed: newCompleted,
        status: newCompleted ? 'done' as const : 'todo' as const,
        completed_at: newCompleted ? new Date() : undefined
      };
      await updateTask(updatedTask);
      toast({
        title: task.completed ? "Task reopened" : "Task completed",
        description: `"${task.title}" marked as ${task.completed ? 'incomplete' : 'complete'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeDialogs = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedTask(undefined);
  };

  return {
    selectedTask,
    isViewDialogOpen,
    isEditDialogOpen,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleToggleStatus,
    closeDialogs,
    setIsEditDialogOpen
  };
}