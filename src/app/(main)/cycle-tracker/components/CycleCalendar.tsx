"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CycleDay {
  date: number;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
}

type Props = {
  displayMonth: string;
  leadingEmptyDays: number;
  days: CycleDay[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onRecalculate: () => void;
};

function getDayClassName(day: CycleDay) {
  if (day.isToday) return "bg-gray-900 text-white border-2 border-black";

  if (day.isOvulation)
    return "bg-red-600 text-white font-bold ring-2 ring-red-300";

  if (day.isPeriod)
    return "bg-red-200 text-red-900 font-semibold";

  if (day.isFertile)
    return "bg-green-200 text-green-900 font-medium";


  return "bg-gray-50 text-gray-700 hover:bg-gray-100";
}


export function CycleCalendar(props: Props) {
  const { displayMonth, leadingEmptyDays, days, onPrevMonth, onNextMonth, onRecalculate } = props;

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onPrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{displayMonth}</span>
            <Button variant="ghost" size="sm" onClick={onNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mt-4">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 p-2">
              {d}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(leadingEmptyDays)].map((_, i) => (
            <div key={i} className="p-3"></div>
          ))}

          {days.map((day) => (
            <button
              key={day.date}
              className={`p-3 text-sm rounded-lg border transition-colors ${getDayClassName(day)}`}
            >
              {day.date}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-300 rounded border"></div>
            <span className="text-gray-600">Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-300 rounded border"></div>
            <span className="text-gray-600">Fertile Window</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-700 rounded"></div>
            <span className="text-gray-600">Ovulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>

        <Button onClick={onRecalculate} className="w-full mt-4 bg-red-500 hover:bg-red-600">
          Recalculate
        </Button>
      </CardContent>
    </Card>
  );
}