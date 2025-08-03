-- Add new columns to tasks table for enhanced functionality
ALTER TABLE public.tasks 
ADD COLUMN status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
ADD COLUMN estimated_duration integer, -- in minutes
ADD COLUMN actual_duration integer, -- in minutes  
ADD COLUMN started_at timestamp with time zone,
ADD COLUMN completed_at timestamp with time zone,
ADD COLUMN urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high'));

-- Create task_sessions table for detailed time tracking
CREATE TABLE public.task_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  duration_minutes integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on task_sessions
ALTER TABLE public.task_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for task_sessions (public access for now, matching tasks table)
CREATE POLICY "Enable full access to all users" 
ON public.task_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create analytics_events table for tracking user interactions
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  event_data jsonb,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_events
CREATE POLICY "Enable full access to all users" 
ON public.analytics_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for task_sessions updated_at
CREATE TRIGGER update_task_sessions_updated_at
  BEFORE UPDATE ON public.task_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_task_sessions_task_id ON public.task_sessions(task_id);
CREATE INDEX idx_task_sessions_started_at ON public.task_sessions(started_at);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_urgency ON public.tasks(urgency);