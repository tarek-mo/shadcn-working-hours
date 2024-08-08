# Shadcn working hours

## Overview
[Shadcn](https://ui.shadcn.com/) week working hours component

## Demo
View [live demo](https://shadcn-working-hours.vercel.app/)

[Shadcn working hours.webm](https://github.com/user-attachments/assets/d2c1816b-7a29-482e-b069-549f2c0b549f)

## Features
- Uses [Shadcn](https://ui.shadcn.com/) components 💠
- Mobile responsive 📱
- Supports light/dark mode 🌙

## Usage

1) Install necessary shadcn components first (`select`, `button`, `scroll-area`):
```
npx shadcn-ui@latest add select
```
```
npx shadcn-ui@latest add button
```
```
npx shadcn-ui@latest add scroll-area
```

2) Install `uuid`

```
npm i uuid
```
```
npm i --save @types/uuid
```

3) Create `/lib/utils.ts` file and add these functions:
```ts
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

```

4) Create `day-working-hours.tsx` file inside `/src/components` folder

```tsx
"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAvailableTimes,
  getNextHalfHour,
  getPastHalfHour,
} from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type DayWorkingHoursProps = {
  day: {
    name: string;
    workingHours: {
      id: string;
      start: string;
      end: string;
    }[];
  };
  weekWorkingHours: {
    name: string;
    workingHours: {
      id: string;
      start: string;
      end: string;
    }[];
  }[];
  onDeleteWorkingHours: (id: string, dayName: string) => void;
  onAddWorkingHours: (dayName: string) => void;
  onUpdateOpeningHour: (
    id: string,
    dayName: string,
    newStartTime: string
  ) => void;
  onUpdateClosingHour: (
    id: string,
    dayName: string,
    newStartTime: string
  ) => void;
};
const DayWorkingHours = ({
  day,
  onDeleteWorkingHours,
  onAddWorkingHours,
  onUpdateOpeningHour,
  onUpdateClosingHour,
  weekWorkingHours,
}: DayWorkingHoursProps) => {
  console.log(weekWorkingHours);

  return (
    <div className="grid gap-3 grid-cols-12">
      <div className="flex items-center justify-between col-span-12 md:col-span-3 lg:col-span-2 flex-wrap gap-1">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {day.name}
        </h4>
        <Button
          onClick={() => onAddWorkingHours(day.name)}
          variant="outline"
          size="icon"
          disabled={
            day.workingHours[day.workingHours.length - 1]?.end === "23:30" ||
            day.workingHours[day.workingHours.length - 1]?.end === "23:00"
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {day.workingHours.length > 0 ? (
        <ScrollArea className="whitespace-nowrap rounded-md col-span-12 md:col-span-9 lg:col-span-10 border p-1">
          <div className="  flex flex-col md:flex-row gap-2 flex-wrap md:flex-nowrap ">
            {day.workingHours.map((workingHour, index) => (
              <div
                key={workingHour.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:justify-between p-1 grow"
              >
                <div className="flex items-center gap-3 justify-between grow">
                  <Select
                    onValueChange={(time) =>
                      onUpdateOpeningHour(workingHour.id, day.name, time)
                    }
                    value={workingHour.start}
                  >
                    <SelectTrigger className="grow">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimes(
                        index === 0
                          ? "00:00"
                          : getNextHalfHour(day.workingHours[index - 1].end),
                        getPastHalfHour(workingHour.end)
                      ).map((time, index) => (
                        <SelectItem key={`${index} ${day.name}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <ChevronRight size={50} />
                  <Select
                    onValueChange={(time) => {
                      console.log("new time", time);

                      onUpdateClosingHour(workingHour.id, day.name, time);
                    }}
                    value={workingHour.end}
                  >
                    <SelectTrigger className="grow">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value={workingHour.end}>
                      {workingHour.end}
                    </SelectItem> */}
                      {getAvailableTimes(
                        getNextHalfHour(workingHour.start),
                        index === day.workingHours.length - 1
                          ? "23:30"
                          : getPastHalfHour(day.workingHours[index + 1].start)
                      ).map((time, index) => (
                        <SelectItem key={`${index} ${day.name}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full md:w-auto"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteWorkingHours(workingHour.id, day.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="col-span-12 md:col-span-9 inline-flex items-center gap-2 text-center md:text-left justify-center md:justify-start">
          <p className="text-destructive">Closed</p>
          <p className="text-sm text-muted-foreground">
            (click + button to add a time range)
          </p>
        </div>
      )}
    </div>
  );
};

export default DayWorkingHours;

```

5) Create `week-working-hours.tsx` file inside `/src/components` folder

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getNextHalfHour } from "@/lib/utils";
import DayWorkingHours from "./day-working-hours";

const WeekWorkingHours = () => {
  const initialWeekWorkingHours = [
    {
      name: "Monday",
      workingHours: [
        {
          id: uuidv4(),
          start: "10:00",
          end: "20:00",
        },
        {
          id: uuidv4(),
          start: "21:30",
          end: "23:30",
        },
      ],
    },
    {
      name: "Tuesday",
      workingHours: [
        {
          id: uuidv4(),
          start: "08:00",
          end: "23:30",
        },
      ],
    },
    { name: "Wednesday", workingHours: [] },
    {
      name: "Thursday",
      workingHours: [
        {
          id: uuidv4(),
          start: "08:00",
          end: "23:30",
        },
      ],
    },
    {
      name: "Friday",
      workingHours: [
        {
          id: uuidv4(),
          start: "08:00",
          end: "23:30",
        },
      ],
    },
    {
      name: "Saturday",
      workingHours: [],
    },
    {
      name: "Sunday",
      workingHours: [],
    },
  ];
  const [weekWorkingHours, setWeekWorkingHours] = useState(
    initialWeekWorkingHours
  );
  const deleteWorkingHours = (id: string, dayName: string) => {
    const updatedWeekWorkingHours = weekWorkingHours.map((day) => {
      if (day.name !== dayName) return day;
      day.workingHours = day.workingHours.filter(
        (workingHour) => workingHour.id !== id
      );
      return day;
    });
    setWeekWorkingHours(updatedWeekWorkingHours);
  };

  useEffect(() => {
    console.log(weekWorkingHours[0].workingHours);
  }, [weekWorkingHours]);

  const addWorkingHours = (dayName: string) => {
    const updatedWeekWorkingHours = weekWorkingHours.map((day) => {
      if (day.name !== dayName) return day;
      const nexHalfHour =
        day.workingHours.length > 0
          ? getNextHalfHour(day.workingHours[day.workingHours.length - 1].end)
          : "08:00";
      console.log("next half hour", nexHalfHour);

      day.workingHours.push({
        id: uuidv4(),
        start: nexHalfHour,
        end: "23:30",
      });
      return day;
    });
    setWeekWorkingHours(updatedWeekWorkingHours);
  };

  const updateOpeningHour = (
    id: string,
    dayName: string,
    newStartTime: string
  ) => {
    const updatedWeekWorkingHours = weekWorkingHours.map((day) => {
      if (day.name !== dayName) return day;
      day.workingHours = day.workingHours.map((workingHour) => {
        if (workingHour.id !== id) return workingHour;
        workingHour.start = newStartTime;
        return workingHour;
      });

      return day;
    });
    setWeekWorkingHours(updatedWeekWorkingHours);
  };
  const updateClosingHour = (
    id: string,
    dayName: string,
    newEndTime: string
  ) => {
    const updatedWeekWorkingHours = weekWorkingHours.map((day) => {
      if (day.name !== dayName) return day;
      day.workingHours = day.workingHours.map((workingHour) => {
        if (workingHour.id !== id) return workingHour;
        workingHour.end = newEndTime;
        return workingHour;
      });

      return day;
    });
    setWeekWorkingHours(updatedWeekWorkingHours);
  };
  return (
    <div className="flex flex-col gap-4">
      {weekWorkingHours.map((day) => (
        <DayWorkingHours
          key={day.name}
          day={day}
          weekWorkingHours={weekWorkingHours}
          onDeleteWorkingHours={deleteWorkingHours}
          onAddWorkingHours={addWorkingHours}
          onUpdateOpeningHour={updateOpeningHour}
          onUpdateClosingHour={updateClosingHour}
        />
      ))}
    </div>
  );
};

export default WeekWorkingHours;

```

6) Render the `week-working-hours.tsx` component inside your page 🎉

```tsx
import WeekWorkingHours from "@/components/week-working-hours";

export default function Home() {
  return (
    <main className="container max-w-7xl pb-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-6 mb-4">
        Shadcn working hours
      </h1>
      <div className="border-border rounded-md border p-3">
        <WeekWorkingHours />
      </div>
    </main>
  );
}

```
