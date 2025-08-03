import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewContainerProps {
  title: string;
  children: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  className?: string;
  headerActions?: ReactNode;
}

export function ViewContainer({ 
  title, 
  children, 
  onPrevious, 
  onNext, 
  onToday,
  className,
  headerActions 
}: ViewContainerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          {title}
        </h2>
        
        <div className="flex items-center gap-2 justify-center sm:justify-end">
          {headerActions}
          
          {(onPrevious || onNext || onToday) && (
            <div className="flex gap-2">
              {onPrevious && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onPrevious}
                  className="touch-target"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
              
              {onToday && (
                <Button 
                  variant="outline"
                  onClick={onToday}
                  className="px-3 py-2 text-sm"
                >
                  Today
                </Button>
              )}
              
              {onNext && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onNext}
                  className="touch-target"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {children}
    </div>
  );
}