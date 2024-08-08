import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextHalfHour(time: string): string {
  // Split the input string into hours and minutes
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr);
  let minutes = parseInt(minutesStr);

  // Determine the next half-hour time
  if (minutes < 30) {
    minutes = 30;
  } else {
    minutes = 0;
    hours = (hours + 1) % 24; // Handle wrap-around at midnight
  }

  // Format the result as HH:MM
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function getPastHalfHour(time: string): string {
  // Split the input string into hours and minutes
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr);
  let minutes = parseInt(minutesStr);

  // Determine the previous half-hour time
  if (minutes === 0) {
    minutes = 30;
    hours = (hours - 1 + 24) % 24; // Handle wrap-around at midnight
  } else {
    minutes = 0;
  }

  // Format the result as HH:MM
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function getAvailableTimes(
  startTime: string,
  endTime: string
): string[] {
  // Helper function to add minutes to a given time
  const addMinutes = (time: Date, minutes: number): Date => {
    return new Date(time.getTime() + minutes * 60000);
  };

  // Parse the input strings to get start and end times
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHours, startMinutes, 0, 0);

  const end = new Date();
  end.setHours(endHours, endMinutes, 0, 0);

  // Initialize the result array and current time
  const result: string[] = [];
  let currentTime = start;

  // Iterate from the start time to the end time in half-hour increments
  while (currentTime <= end) {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    result.push(`${hours}:${minutes}`);
    currentTime = addMinutes(currentTime, 30);
  }

  return result;
}
