"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getNextHalfHour } from "@/lib/utils";
import DayWorkingHours from "./day-working-hours";
import { Button } from "./ui/button";

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

  const addWorkingHours = (dayName: string) => {
    const updatedWeekWorkingHours = weekWorkingHours.map((day) => {
      if (day.name !== dayName) return day;
      const nexHalfHour =
        day.workingHours.length > 0
          ? getNextHalfHour(day.workingHours[day.workingHours.length - 1].end)
          : "08:00";

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

  const handleSubmit = () => {
    console.log("weekWorkingHours", weekWorkingHours);
    // Do something here
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        {weekWorkingHours.map((day) => (
          <DayWorkingHours
            key={day.name}
            day={day}
            onDeleteWorkingHours={deleteWorkingHours}
            onAddWorkingHours={addWorkingHours}
            onUpdateOpeningHour={updateOpeningHour}
            onUpdateClosingHour={updateClosingHour}
          />
        ))}
      </div>
      <Button className="block ms-auto mt-4" size={"lg"} onClick={handleSubmit}>
        Save
      </Button>
    </>
  );
};

export default WeekWorkingHours;
