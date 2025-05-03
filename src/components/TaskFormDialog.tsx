
import { useState } from "react";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  mode: "add" | "edit";
}

export function TaskFormDialog({ isOpen, onClose, task, mode }: TaskFormDialogProps) {
  const { addTask, updateTask } = useTaskContext();
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: Date;
    priority: "low" | "medium" | "high";
    labels: string;
  }>({
    title: task?.title || "",
    description: task?.description || "",
    date: task?.date || new Date(),
    priority: task?.priority || "medium",
    labels: task?.labels?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Omit<Task, "id"> = {
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      priority: formData.priority,
      completed: task?.completed || false,
      labels: formData.labels ? formData.labels.split(",").map(l => l.trim()).filter(Boolean) : undefined,
    };
    
    if (mode === "add") {
      addTask(taskData);
    } else if (mode === "edit" && task) {
      updateTask({ ...taskData, id: task.id });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Task title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({...formData, date})}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Priority</Label>
            <RadioGroup 
              value={formData.priority}
              onValueChange={(value) => setFormData({...formData, priority: value as "low" | "medium" | "high"})}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-success">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-warning">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-error">High</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="labels">Labels (comma separated)</Label>
            <Input
              id="labels"
              value={formData.labels}
              onChange={(e) => setFormData({...formData, labels: e.target.value})}
              placeholder="work, personal, urgent"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Add Task" : "Update Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
