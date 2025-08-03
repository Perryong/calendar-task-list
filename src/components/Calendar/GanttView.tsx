import { useTaskContext } from "@/contexts/TaskContext";
import { addDays, startOfWeek, format, differenceInDays } from "date-fns";
import { ViewContainer } from "../shared/ViewContainer";
import { TaskCard } from "../shared/TaskCard";
import { taskUtils } from "@/utils/taskUtils";
import { useTaskFiltering } from "@/hooks/useTaskFiltering";
import { Progress } from "@/components/ui/progress";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Task } from "@/lib/types";

export function GanttView() {
  const { selectedDate, setSelectedDate, tasks, filter, updateTask } = useTaskContext();
  const filteredTasks = useTaskFiltering(tasks, filter);
  const { handleGanttDrop, handleDragOver } = useDragAndDrop();

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      await updateTask({ ...currentTask, ...updates });
    }
  };
  
  // Get Gantt range (4 weeks)
  const ganttStart = startOfWeek(selectedDate);
  const ganttEnd = addDays(ganttStart, 27); // 4 weeks
  const totalDays = 28;
  
  // Sort tasks by date and filter within range
  const ganttTasks = taskUtils.sortByDate(filteredTasks).filter(task => 
    task.date >= ganttStart && task.date <= ganttEnd
  );

  const handlePrevious = () => setSelectedDate(addDays(selectedDate, -28));
  const handleNext = () => setSelectedDate(addDays(selectedDate, 28));
  const handleToday = () => setSelectedDate(new Date());

  return (
    <ViewContainer
      title={`Gantt Chart: ${format(ganttStart, "MMM d")} - ${format(ganttEnd, "MMM d, yyyy")}`}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onToday={handleToday}
    >
      {/* Desktop Gantt Chart */}
      <div className="hidden md:block">
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Gantt Header */}
          <div className="grid grid-cols-[300px_1fr] border-b">
            <div className="p-3 font-semibold border-r bg-muted">Task</div>
            <div className="grid grid-cols-28 gap-px bg-muted">
              {Array.from({ length: 28 }).map((_, i) => {
                const day = addDays(ganttStart, i);
                return (
                  <div key={i} className="p-1 text-center text-xs bg-card">
                    <div className="font-medium">{format(day, "EEE")}</div>
                    <div>{format(day, "d")}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Gantt Tasks */}
          <div className="max-h-[500px] overflow-y-auto">
            {ganttTasks.length > 0 ? (
              ganttTasks.map((task) => {
                const taskStart = differenceInDays(task.date, ganttStart);
                const duration = Math.max(taskUtils.getTaskDuration(task) / (24 * 60), 0.5); // Minimum 0.5 days
                const progress = taskUtils.calculateProgress(task);
                
                return (
                  <div key={task.id} className="grid grid-cols-[300px_1fr] border-b hover:bg-muted/50">
                    {/* Task Info */}
                    <div className="p-3 border-r">
                      <TaskCard task={task} mode="compact" />
                    </div>
                    
                    {/* Gantt Bar */}
                    <div 
                      className="relative p-2 flex items-center"
                      onDrop={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const dayIndex = Math.floor((x / rect.width) * totalDays);
                        const newDate = addDays(ganttStart, dayIndex);
                        handleGanttDrop(e, newDate, handleTaskUpdate);
                      }}
                      onDragOver={handleDragOver}
                    >
                      <div 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", JSON.stringify({
                            id: task.id,
                            title: task.title,
                            date: task.date.toISOString()
                          }));
                        }}
                        className="h-6 bg-primary/20 border border-primary/40 rounded relative overflow-hidden cursor-move hover:bg-primary/30 transition-colors"
                        style={{
                          marginLeft: `${(taskStart / totalDays) * 100}%`,
                          width: `${(duration / totalDays) * 100}%`,
                          minWidth: '20px'
                        }}
                      >
                        {/* Progress Bar */}
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                        
                        {/* Task Title in Bar */}
                        <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-primary-foreground pointer-events-none">
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No tasks in the selected time range</p>
                <p className="text-sm mt-1">Select a different time period or add tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Gantt - Enhanced Timeline View */}
      <div className="md:hidden">
        {ganttTasks.length > 0 ? (
          <div className="space-y-4">
            {/* Mobile Timeline Header */}
            <div className="bg-card border rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Timeline</h3>
                <div className="text-xs text-muted-foreground">
                  {format(ganttStart, "MMM d")} - {format(ganttEnd, "MMM d")}
                </div>
              </div>
              
              {/* Mini timeline indicator */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-full"></div>
                <div className="absolute right-0 top-0 h-full w-1 bg-primary rounded-full"></div>
              </div>
            </div>

            {/* Mobile Task Cards with Timeline Info */}
            {ganttTasks.map((task) => {
              const progress = taskUtils.calculateProgress(task);
              const duration = taskUtils.getTaskDuration(task);
              const daysFromStart = differenceInDays(task.date, ganttStart);
              const timelinePercent = (daysFromStart / totalDays) * 100;
              
              return (
                <div key={task.id} className="bg-card border rounded-lg p-3 touch-manipulation">
                  <TaskCard task={task} mode="default" />
                  
                  <div className="mt-3 space-y-3">
                    {/* Timeline Position */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Timeline Position</span>
                        <span>Day {daysFromStart + 1} of {totalDays}</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 h-full w-3 bg-primary rounded-full transition-all duration-300"
                          style={{ left: `${Math.max(0, Math.min(timelinePercent, 97))}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {/* Task Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium">Duration</div>
                        <div>{Math.round(duration / 60)}h {duration % 60}m</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium">Due Date</div>
                        <div>{format(task.date, "MMM d, EEE")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
            <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
              <div className="w-6 h-1 bg-muted-foreground/30 rounded"></div>
            </div>
            <p className="font-medium">No tasks in timeline</p>
            <p className="text-xs mt-1">Select a different time period or add tasks</p>
          </div>
        )}
      </div>
    </ViewContainer>
  );
}