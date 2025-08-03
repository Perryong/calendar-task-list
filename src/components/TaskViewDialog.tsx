
import { Task } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Pen, Check, Calendar, Trash2 } from "lucide-react";

interface TaskViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskViewDialog({ isOpen, onClose, task, onEdit, onDelete }: TaskViewDialogProps) {
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-error text-error-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            {/* Left side: Badge */}
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>

            {/* Title in center */}
            <DialogTitle className="text-center flex-1">
              {task.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(task.date, "PPPP")}</span>
            {task.completed && (
              <Badge className="ml-auto">
                <Check className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          
          {task.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}
          
          {task.labels && task.labels.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {task.labels.map(label => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-3 pt-8">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} className="px-6">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button type="button" onClick={onEdit} className="px-6">
            <Pen className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}