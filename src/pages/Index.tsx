import { useState, useEffect } from "react";
import { TaskProvider } from "@/contexts/TaskContext";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskFilter } from "@/components/TaskFilter";
import { CalendarViewSelector } from "@/components/CalendarViewSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus, CloudOff, RefreshCw, Cloud } from "lucide-react";
import { format } from "date-fns";
import { useTaskContext } from "@/contexts/TaskContext";

/* ────────────────────────────────────────────────────── */
/*  Sync-status pill                                         */
/* ────────────────────────────────────────────────────── */
const SyncStatusIndicator = () => {
  const { syncStatus } = useTaskContext();

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {syncStatus === "synced" && (
        <>
          <Cloud className="h-3 w-3" />
          <span>Synced</span>
        </>
      )}
      {syncStatus === "syncing" && (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Syncing…</span>
        </>
      )}
      {syncStatus === "error" && (
        <>
          <CloudOff className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Sync error</span>
        </>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────── */
/*  Main page content                                        */
/* ────────────────────────────────────────────────────── */
const IndexContent = () => {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  /* Update clock every minute */
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <img
        src="/goku.jpg"
        alt="Goku background"
        className="fixed inset-0 -z-10 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h1 className="text-2xl font-bold text-primary">Todo Calendar</h1>
            <span className="text-sm text-muted-foreground">
              {format(currentDateTime, "EEEE, MMMM d, yyyy • h:mm a")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatusIndicator />
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

      {/* Main */}
      <main className="container mx-auto px-4 py-8 flex-1 bg-background/70 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <CalendarViewSelector />
          <TaskFilter />
        </div>
        <TaskCalendar />
      </main>

      {/* Footer */}
      <Footer />

      {/* Add-task dialog */}
      {showAddTaskDialog && (
        <TaskFormDialog
          isOpen={showAddTaskDialog}
          onClose={() => setShowAddTaskDialog(false)}
          mode="add"
        />
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────── */
/*  Provider wrapper                                         */
/* ────────────────────────────────────────────────────── */
const Index = () => (
  <TaskProvider>
    <IndexContent />
  </TaskProvider>
);

export default Index;
