import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TaskActionMenu } from "./TaskActionMenu";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { TaskViewDialog } from "@/components/TaskViewDialog";

interface TaskCardProps {
  task: Task;
  mode?: "default" | "compact" | "timeline" | "matrix";
  className?: string;
}

export function TaskCard({ 
  task, 
  mode = "default", 
  className 
}: TaskCardProps) {
  const {
    selectedTask,
    isViewDialogOpen,
    isEditDialogOpen,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleToggleStatus,
    closeDialogs,
    setIsEditDialogOpen
  } = useTaskActions();

  const { handleDragStart } = useDragAndDrop();
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800 border-gray-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    done: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <>
      <div
        draggable={mode === "matrix" || mode === "timeline"}
        onDragStart={(e) => handleDragStart(e, task)}
        className={cn(
          "bg-card border rounded-lg p-3 transition-all hover:shadow-md",
          mode === "compact" && "p-2",
          mode === "timeline" && "min-h-[60px] cursor-move",
          mode === "matrix" && "cursor-grab active:cursor-grabbing",
          task.completed && "opacity-60",
          className
        )}
      >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm truncate",
            mode === "compact" ? "text-xs" : "text-sm",
            task.completed && "line-through"
          )}>
            {task.title}
          </h4>
          
          {mode !== "compact" && task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn("text-xs", priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
            
            <Badge 
              variant="outline" 
              className={cn("text-xs", statusColors[task.status])}
            >
              {task.status.replace('_', ' ')}
            </Badge>
            
            {task.estimated_duration && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {task.estimated_duration}m
              </div>
            )}
            
            {mode !== "compact" && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(task.date, "MMM d")}
              </div>
            )}
          </div>
        </div>
        
        {mode !== "compact" && (
          <TaskActionMenu
            task={task}
            onView={handleViewTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            mode={mode}
          />
        )}
      </div>
      </div>

      {/* Dialogs */}
      {selectedTask && (
        <>
          <TaskViewDialog
            isOpen={isViewDialogOpen}
            onClose={closeDialogs}
            task={selectedTask}
            onEdit={() => {
              closeDialogs();
              setIsEditDialogOpen(true);
            }}
            onDelete={() => {
              closeDialogs();
              handleDeleteTask(selectedTask);
            }}
          />
          
          <TaskFormDialog
            isOpen={isEditDialogOpen}
            onClose={closeDialogs}
            task={selectedTask}
            mode="edit"
          />
        </>
      )}
    </>
  );
}