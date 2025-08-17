import { Task } from "@/lib/types";
import { TaskItem } from "../TaskItem";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";

interface DayTaskDrawerProps {
  date: Date;
  tasks: Task[];
  trigger: React.ReactNode;
  onAddTask?: () => void;
}

export function DayTaskDrawer({ date, tasks, trigger, onAddTask }: DayTaskDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {format(date, "EEEE, MMMM d")}
          </SheetTitle>
        </SheetHeader>
        
        {onAddTask && (
          <div className="mt-4">
            <Button 
              size="sm" 
              onClick={() => {
                onAddTask();
                setOpen(false);
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tasks for this day
            </p>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}