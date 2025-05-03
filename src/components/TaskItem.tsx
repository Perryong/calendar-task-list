
import { useState } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pen, Trash } from "lucide-react";
import { format } from "date-fns";
import { TaskFormDialog } from "./TaskFormDialog";

interface TaskItemProps {
  task: Task;
  compact?: boolean;
}

export function TaskItem({ task, compact = false }: TaskItemProps) {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();
  const [showEditDialog, setShowEditDialog] = useState(false);

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

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-1 hover:bg-muted/30 rounded-md transition-colors group">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => toggleTaskCompletion(task.id)} 
          className="data-[state=checked]:bg-primary"
        />
        <span 
          className={`text-sm flex-grow truncate ${task.completed ? "task-completed" : ""}`}
        >
          {task.title}
        </span>
        <Badge className={`${getPriorityColor(task.priority)} text-[10px] px-1 py-0`}>
          {task.priority}
        </Badge>
      </div>
    );
  }

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={() => toggleTaskCompletion(task.id)} 
                className="data-[state=checked]:bg-primary"
              />
              <CardTitle className={`text-lg ${task.completed ? "task-completed" : ""}`}>
                {task.title}
              </CardTitle>
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {format(task.date, "PPP")}
          </CardDescription>
        </CardHeader>
        {task.description && (
          <CardContent className="pb-2 pt-0">
            <p className="text-sm">{task.description}</p>
          </CardContent>
        )}
        {task.labels && task.labels.length > 0 && (
          <CardContent className="flex flex-wrap gap-1 pb-2 pt-0">
            {task.labels.map(label => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </CardContent>
        )}
        <CardFooter className="pt-0">
          <div className="flex justify-end gap-2 w-full">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowEditDialog(true)}
            >
              <Pen className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {showEditDialog && (
        <TaskFormDialog 
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          task={task}
          mode="edit"
        />
      )}
    </>
  );
}
