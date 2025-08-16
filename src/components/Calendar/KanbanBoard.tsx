import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task, TaskStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  todo: {
    title: "To Do",
    icon: AlertCircle,
    className: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
  },
  in_progress: {
    title: "In Progress", 
    icon: Play,
    className: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
  },
  done: {
    title: "Done",
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
  }
};

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const urgencyColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  high: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
};

interface KanbanCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
  isTimerRunning: boolean;
}

function KanbanCard({ task, onStatusChange, onStartTimer, onStopTimer, isTimerRunning }: KanbanCardProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <Card className="mb-2 sm:mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs sm:text-sm font-medium leading-tight flex-1 min-w-0">
            {task.title}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
            <Badge variant="outline" className={cn("text-[10px] sm:text-xs", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] sm:text-xs", urgencyColors[task.urgency])}>
              {task.urgency}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
        {task.description && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-xs text-muted-foreground mb-2 gap-1">
          <span>{task.date.toLocaleDateString()}</span>
          {task.estimated_duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{formatDuration(task.estimated_duration)}</span>
            </div>
          )}
        </div>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label, index) => (
              <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-1 sm:justify-between">
          <div className="flex flex-wrap gap-1">
            {task.status !== 'todo' && (
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2"
                onClick={() => handleStatusChange('todo')}
              >
                To Do
              </Button>
            )}
            {task.status !== 'in_progress' && (
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2"
                onClick={() => handleStatusChange('in_progress')}
              >
                Progress
              </Button>
            )}
            {task.status !== 'done' && (
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2"
                onClick={() => handleStatusChange('done')}
              >
                Done
              </Button>
            )}
          </div>
          
          {task.status === 'in_progress' && (
            <Button
              size="sm"
              variant={isTimerRunning ? "destructive" : "default"}
              className="text-xs h-5 sm:h-6 px-1.5 sm:px-2 mt-1 sm:mt-0"
              onClick={() => isTimerRunning ? onStopTimer(task.id) : onStartTimer(task.id)}
            >
              {isTimerRunning ? <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
  runningTimers: Set<string>;
}

function KanbanColumn({ status, tasks, onStatusChange, onStartTimer, onStopTimer, runningTimers }: KanbanColumnProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex-1 min-w-0 min-w-[280px] sm:min-w-[320px] max-w-full">
      <div className={cn("rounded-lg border-2 border-dashed p-3 sm:p-4 min-h-[400px] sm:min-h-[600px] touch-manipulation", config.className)}>
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="font-semibold text-sm sm:text-base truncate">{config.title}</h3>
          <Badge variant="secondary" className="ml-auto text-xs flex-shrink-0">
            {tasks.length}
          </Badge>
        </div>
        
        <div className="space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onStartTimer={onStartTimer}
                onStopTimer={onStopTimer}
                isTimerRunning={runningTimers.has(task.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">No tasks</p>
                <p className="text-xs mt-1">Add tasks to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, updateTask } = useTaskContext();
  const [runningTimers, setRunningTimers] = useState<Set<string>>(new Set());

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { 
      ...task, 
      status: newStatus,
      completed: newStatus === 'done',
      started_at: newStatus === 'in_progress' && !task.started_at ? new Date() : task.started_at,
      completed_at: newStatus === 'done' ? new Date() : undefined
    };

    await updateTask(updatedTask);
  };

  const handleStartTimer = (taskId: string) => {
    setRunningTimers(prev => new Set([...prev, taskId]));
    // TODO: Implement actual time tracking
  };

  const handleStopTimer = (taskId: string) => {
    setRunningTimers(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    // TODO: Implement actual time tracking
  };

  // Filter out all completed tasks from Kanban board
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  const tasksByStatus = {
    todo: incompleteTasks.filter(task => task.status === 'todo'),
    in_progress: incompleteTasks.filter(task => task.status === 'in_progress'),
    done: incompleteTasks.filter(task => task.status === 'done')
  };

  return (
    <div className="w-full p-2 sm:p-4">
      {/* Mobile: Horizontal scroll with snap */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
          {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
            <div key={status} className="flex-none w-80 snap-start">
              <KanbanColumn
                status={status}
                tasks={tasksByStatus[status]}
                onStatusChange={handleStatusChange}
                onStartTimer={handleStartTimer}
                onStopTimer={handleStopTimer}
                runningTimers={runningTimers}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Flex layout */}
      <div className="hidden sm:flex gap-6 overflow-x-auto pb-4">
        {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onStatusChange={handleStatusChange}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            runningTimers={runningTimers}
          />
        ))}
      </div>
    </div>
  );
}