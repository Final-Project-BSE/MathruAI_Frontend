"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type CycleStats = {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number; // days left
  fertile: number; // days remaining
};

export function StatsGrid({ stats }: { stats: CycleStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-500 mb-1">{stats.currentDay}</div>
          <div className="text-sm text-gray-600">Current Day</div>
          <div className="text-xs text-gray-500">Period of cycle</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-500 mb-1">{stats.cycleLength}</div>
          <div className="text-sm text-gray-600">Cycle Length</div>
          <div className="text-xs text-gray-500">Average</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{stats.nextPeriod}</div>
          <div className="text-sm text-gray-600">Next Period</div>
          <div className="text-xs text-gray-500">Days left</div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">{stats.fertile}</div>
          <div className="text-sm text-gray-600">Fertile Days</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </CardContent>
      </Card>
    </div>
  );
}
