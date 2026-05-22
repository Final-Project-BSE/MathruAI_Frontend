"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type CycleStats = {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number;
  fertile: number;
};

type StatsLabels = {
  currentDay: string;
  periodOfCycle: string;
  cycleLength: string;
  average: string;
  nextPeriod: string;
  daysLeft: string;
  fertileDays: string;
  remaining: string;
};

export function StatsGrid({
  stats,
  labels,
}: {
  stats: CycleStats;
  labels: StatsLabels;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-500 mb-1">
            {stats.currentDay}
          </div>
          <div className="text-sm text-gray-600">{labels.currentDay}</div>
          <div className="text-xs text-gray-500">{labels.periodOfCycle}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {stats.cycleLength}
          </div>
          <div className="text-sm text-gray-600">{labels.cycleLength}</div>
          <div className="text-xs text-gray-500">{labels.average}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {stats.nextPeriod}
          </div>
          <div className="text-sm text-gray-600">{labels.nextPeriod}</div>
          <div className="text-xs text-gray-500">{labels.daysLeft}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">
            {stats.fertile}
          </div>
          <div className="text-sm text-gray-600">{labels.fertileDays}</div>
          <div className="text-xs text-gray-500">{labels.remaining}</div>
        </CardContent>
      </Card>
    </div>
  );
}