import { Task } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Check, RotateCcw } from "lucide-react";

interface TaskActionMenuProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  mode?: "default" | "compact" | "timeline" | "matrix";
}

export function TaskActionMenu({ 
  task, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  mode = "default" 
}: TaskActionMenuProps) {
  if (mode === "compact") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
        <DropdownMenuItem onClick={() => onView(task)} className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onToggleStatus(task)} className="cursor-pointer">
          {task.completed ? (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Mark Incomplete
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Mark Complete
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(task)} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}