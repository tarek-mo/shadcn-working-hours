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
