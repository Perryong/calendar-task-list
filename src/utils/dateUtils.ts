import { format, startOfWeek, endOfWeek, addDays, differenceInDays } from "date-fns";

export const dateUtils = {
  formatForDisplay: (date: Date, formatString: string = "PP") => format(date, formatString),
  
  getWeekRange: (date: Date) => ({
    start: startOfWeek(date),
    end: endOfWeek(date)
  }),
  
  getWeekDays: (date: Date) => {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  },
  
  getDaysInRange: (startDate: Date, endDate: Date) => {
    const days = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  },
  
  getDaysDifference: (startDate: Date, endDate: Date) => 
    differenceInDays(endDate, startDate),
  
  getTimelinePosition: (date: Date, startDate: Date, totalDays: number) => {
    const daysDiff = differenceInDays(date, startDate);
    return (daysDiff / totalDays) * 100;
  }
};