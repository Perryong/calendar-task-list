import { useTaskContext } from "@/contexts/TaskContext";
import { ViewContainer } from "../shared/ViewContainer";
import { TaskCard } from "../shared/TaskCard";
import { taskUtils } from "@/utils/taskUtils";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";
import { Badge } from "@/components/ui/badge";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types";

export function MatrixView() {
  const { tasks, filter, updateTask } = useTaskContext();
  const filteredTasks = useTaskFiltering(tasks, filter);
  const { handleMatrixDrop, handleDragOver } = useDragAndDrop();

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      await updateTask({ ...currentTask, ...updates });
    }
  };
  
  // Filter out completed tasks for matrix view
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const matrixTasks = taskUtils.categorizeByMatrix(incompleteTasks);
  
  const quadrants = [
    {
      key: 'urgent-important',
      title: 'Urgent & Important',
      subtitle: 'Do First',
      color: 'border-red-300 bg-red-50',
      headerColor: 'bg-red-100 text-red-800',
      tasks: matrixTasks['urgent-important'] || []
    },
    {
      key: 'not-urgent-important',
      title: 'Not Urgent & Important',
      subtitle: 'Schedule',
      color: 'border-yellow-300 bg-yellow-50',
      headerColor: 'bg-yellow-100 text-yellow-800',
      tasks: matrixTasks['not-urgent-important'] || []
    },
    {
      key: 'urgent-not-important',
      title: 'Urgent & Not Important',
      subtitle: 'Delegate',
      color: 'border-blue-300 bg-blue-50',
      headerColor: 'bg-blue-100 text-blue-800',
      tasks: matrixTasks['urgent-not-important'] || []
    },
    {
      key: 'not-urgent-not-important',
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate',
      color: 'border-gray-300 bg-gray-50',
      headerColor: 'bg-gray-100 text-gray-800',
      tasks: matrixTasks['not-urgent-not-important'] || []
    }
  ];

  return (
    <ViewContainer title="Eisenhower Matrix">
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
          {quadrants.map((quadrant) => (
            <div key={quadrant.key} className="flex-none w-72 snap-start">
              <div
                onDrop={(e) => handleMatrixDrop(e, quadrant.key, handleTaskUpdate)}
                onDragOver={handleDragOver}
                className={cn(
                  `border-2 rounded-lg ${quadrant.color} min-h-[350px] flex flex-col transition-colors touch-manipulation`,
                  "hover:border-primary/50 [&.drag-over]:border-primary [&.drag-over]:bg-primary/5"
                )}
              >
                {/* Quadrant Header */}
                <div className={`p-3 rounded-t-lg ${quadrant.headerColor} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{quadrant.title}</h3>
                      <p className="text-xs opacity-75">{quadrant.subtitle}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                      {quadrant.tasks.length}
                    </Badge>
                  </div>
                </div>
                
                {/* Quadrant Content */}
                <div className="flex-1 p-3 overflow-y-auto min-h-[250px]">
                  {quadrant.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {quadrant.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          mode="matrix"
                          className="transition-transform active:scale-95"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <p className="text-sm">No tasks</p>
                        <p className="text-xs mt-1">Drag tasks here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.key}
            onDrop={(e) => handleMatrixDrop(e, quadrant.key, handleTaskUpdate)}
            onDragOver={handleDragOver}
            className={cn(
              `border-2 rounded-lg ${quadrant.color} min-h-[300px] flex flex-col transition-colors`,
              "hover:border-primary/50 [&.drag-over]:border-primary [&.drag-over]:bg-primary/5"
            )}
          >
            {/* Quadrant Header */}
            <div className={`p-3 rounded-t-lg ${quadrant.headerColor} border-b`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{quadrant.title}</h3>
                  <p className="text-xs opacity-75">{quadrant.subtitle}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {quadrant.tasks.length}
                </Badge>
              </div>
            </div>
            
            {/* Quadrant Content */}
            <div className="flex-1 p-3 overflow-y-auto min-h-[200px]">
              {quadrant.tasks.length > 0 ? (
                <div className="space-y-2">
                  {quadrant.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      mode="matrix"
                      className="transition-transform hover:scale-105"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm">No tasks in this quadrant</p>
                    <p className="text-xs mt-1">Drag tasks here to categorize</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Matrix Legend */}
      <div className="mt-6 p-3 sm:p-4 bg-muted rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Eisenhower Matrix Guide</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs">
          <div className="p-2 rounded bg-background/50">
            <span className="font-medium text-red-700">Do First:</span> Critical and urgent tasks
          </div>
          <div className="p-2 rounded bg-background/50">
            <span className="font-medium text-yellow-700">Schedule:</span> Important but not urgent
          </div>
          <div className="p-2 rounded bg-background/50">
            <span className="font-medium text-blue-700">Delegate:</span> Urgent but not important
          </div>
          <div className="p-2 rounded bg-background/50">
            <span className="font-medium text-gray-700">Eliminate:</span> Neither urgent nor important
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}