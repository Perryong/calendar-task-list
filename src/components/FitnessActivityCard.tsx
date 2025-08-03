import { FitnessActivity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { FitnessActionMenu } from "./shared/FitnessActionMenu";
import { Clock, Flame, Dumbbell, Heart, Bike, Car, Waves, Target } from "lucide-react";

interface FitnessActivityCardProps {
  activity: FitnessActivity;
  onEdit: (activity: FitnessActivity) => void;
  onDelete: (activityId: string) => void;
  compact?: boolean;
}

export function FitnessActivityCard({ activity, onEdit, onDelete, compact = false }: FitnessActivityCardProps) {
  const getActivityIcon = (type: FitnessActivity["type"]) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "cardio":
        return <Heart className={iconClass} />;
      case "strength":
        return <Dumbbell className={iconClass} />;
      case "flexibility":
        return <Target className={iconClass} />;
      case "running":
        return <Car className={iconClass} />;
      case "cycling":
        return <Bike className={iconClass} />;
      case "swimming":
        return <Waves className={iconClass} />;
      default:
        return <Dumbbell className={iconClass} />;
    }
  };

  const getIntensityColor = (intensity?: FitnessActivity["intensity"]) => {
    switch (intensity) {
      case "high":
        return "bg-error text-error-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActivityTypeColor = (type: FitnessActivity["type"]) => {
    switch (type) {
      case "cardio":
        return "bg-error/10 text-error border-error/20";
      case "strength":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "flexibility":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "yoga":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "running":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "cycling":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      case "swimming":
        return "bg-blue-400/10 text-blue-500 border-blue-400/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div
      className={`group border rounded-lg p-3 hover:shadow-md transition-all duration-200
        ${activity ? "" : ""} 
        ${activity.completed ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`p-1.5 rounded-md ${getActivityTypeColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-medium truncate ${compact ? "text-xs" : "text-sm"} ${
                activity.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {activity.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                {activity.type}
              </Badge>
              {activity.intensity && (
                <Badge className={`text-xs ${getIntensityColor(activity.intensity)}`}>
                  {activity.intensity}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Always visible action menu */}
        <div className="opacity-100">
          <FitnessActionMenu
            activity={activity}
            onEdit={() => onEdit(activity)}
            onDelete={() => onDelete(activity.id)}
          />
        </div>
      </div>

      {/* Activity details */}
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        {activity.duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{activity.duration}m</span>
          </div>
        )}
        {activity.calories && (
          <div className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            <span>{activity.calories} cal</span>
          </div>
        )}
      </div>

      {activity.notes && !compact && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{activity.notes}</p>
      )}
    </div>
  );
}
