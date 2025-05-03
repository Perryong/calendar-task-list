
export type Task = {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
};

export type CalendarViewType = 'day' | 'week' | 'month';

export type Filter = {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  label?: string;
};
