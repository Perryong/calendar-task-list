
import { Task } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Pen, Check, Calendar } from "lucide-react";

interface TaskViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
}

export function TaskViewDialog({ isOpen, onClose, task, onEdit }: TaskViewDialogProps) {
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
    <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
        <div className="flex items-start">
            <DialogTitle className="text-xl pr-6">{task.title}</DialogTitle>
            {/* Move the badge further left */}
            <div className="ml-0 mr-4">
            <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
            </Badge>
            </div>
        </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(task.date, "PPP")}</span>
            {task.completed && (
              <Badge className="ml-2 bg-primary text-primary-foreground">
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          
          {task.description && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm">{task.description}</p>
            </div>
          )}
          
          {task.labels && task.labels.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Labels</h3>
              <div className="flex flex-wrap gap-1">
                {task.labels.map(label => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={onEdit}>
            <Pen className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}