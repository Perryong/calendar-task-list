
import { useTaskContext } from "@/contexts/TaskContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function TaskFilter() {
  const { filter, setFilter, tasks } = useTaskContext();
  
  // Extract unique labels from all tasks
  const uniqueLabels = Array.from(
    new Set(tasks.flatMap(task => task.labels || []))
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6">
      <div className="grid gap-2 min-w-[150px]">
        <Label htmlFor="show-completed">Show Completed</Label>
        <div className="flex items-center gap-2">
          <Switch 
            id="show-completed" 
            checked={filter.completed !== false} 
            onCheckedChange={(checked) => 
              setFilter({ ...filter, completed: checked ? undefined : false })
            } 
          />
          <span className="text-sm">
            {filter.completed !== false ? "All tasks" : "Hide completed"}
          </span>
        </div>
      </div>

      <div className="grid gap-2 min-w-[150px]">
        <Label htmlFor="priority-filter">Priority</Label>
        <Select 
          value={filter.priority || "all"} 
          onValueChange={(value) =>
            setFilter({ ...filter, priority: value === "all" ? undefined : (value as "low" | "medium" | "high") })
          }
        >
          <SelectTrigger id="priority-filter">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {uniqueLabels.length > 0 && (
        <div className="grid gap-2 min-w-[150px]">
          <Label htmlFor="label-filter">Label</Label>
          <Select 
            value={filter.label || "all"} 
            onValueChange={(value) =>
              setFilter({ ...filter, label: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger id="label-filter">
              <SelectValue placeholder="Filter by label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All labels</SelectItem>
              {uniqueLabels.map(label => (
                <SelectItem key={label} value={label}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
