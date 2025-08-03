
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskUrgency = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
  status: TaskStatus;
  urgency: TaskUrgency;
  estimated_duration?: number; // in minutes
  actual_duration?: number; // in minutes
  started_at?: Date;
  completed_at?: Date;
};

export type TaskSession = {
  id: string;
  task_id: string;
  started_at: Date;
  ended_at?: Date;
  duration_minutes?: number;
  created_at: Date;
  updated_at: Date;
};

export type AnalyticsEvent = {
  id: string;
  event_type: string;
  event_data?: Record<string, any>;
  task_id?: string;
  created_at: Date;
};

export type CalendarViewType = 'day' | 'week' | 'month' | 'kanban' | 'timeline' | 'matrix' | 'gantt' | 'fitness';

export type FitnessActivityType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'yoga' | 'running' | 'cycling' | 'swimming' | 'other';

export type FitnessActivity = {
  id: string;
  title: string;
  type: FitnessActivityType;
  duration?: number; // in minutes
  intensity?: 'low' | 'medium' | 'high';
  calories?: number;
  notes?: string;
  date: Date;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Filter = {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  label?: string;
};