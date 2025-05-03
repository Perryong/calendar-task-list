
import { useState } from "react";
import { TaskProvider } from "@/contexts/TaskContext";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskFilter } from "@/components/TaskFilter";
import { CalendarViewSelector } from "@/components/CalendarViewSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  return (
    <TaskProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Todo Calendar</h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowAddTaskDialog(true)}
                className="hidden sm:flex"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Task
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddTaskDialog(true)}
                className="sm:hidden"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <CalendarViewSelector />
            <TaskFilter />
          </div>
          
          <TaskCalendar />
        </main>
        
        <Footer />
        
        {showAddTaskDialog && (
          <TaskFormDialog 
            isOpen={showAddTaskDialog}
            onClose={() => setShowAddTaskDialog(false)}
            mode="add"
          />
        )}
      </div>
    </TaskProvider>
  );
};

export default Index;
