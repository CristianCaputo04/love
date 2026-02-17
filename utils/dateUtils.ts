import { DurationBreakdown } from '../types';

export const calculateDuration = (startDateStr: string): DurationBreakdown => {
  const start = new Date(startDateStr);
  const now = new Date();

  // Reset hours to ensure we count full days
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Calculate total days
  const diffTime = Math.abs(currentDay.getTime() - startDay.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate precise breakdown (Years, Months, Days)
  let years = currentDay.getFullYear() - startDay.getFullYear();
  let months = currentDay.getMonth() - startDay.getMonth();
  let days = currentDay.getDate() - startDay.getDate();

  // Adjust if day difference is negative
  if (days < 0) {
    months--;
    // Get days in the previous month relative to current date
    // new Date(year, month, 0) gets the last day of the previous month
    const prevMonthLastDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  // Adjust if month difference is negative
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays,
  };
};

export const getDefaultStartDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 2);
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
};
