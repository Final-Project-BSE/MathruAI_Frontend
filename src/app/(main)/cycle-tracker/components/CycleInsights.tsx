"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Lightbulb, Calendar } from "lucide-react";
import type { FertilityResponseDto } from "../../../api/cycletracker/api";

export function CycleInsights({ fertilityData }: { fertilityData: FertilityResponseDto }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cycle Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full mt-1">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Ovulation</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Expected on {new Date(fertilityData.ovulationDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full mt-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Fertile Window</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {new Date(fertilityData.fertileWindowStart).toLocaleDateString()} -{" "}
              {new Date(fertilityData.fertileWindowEnd).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-full mt-1">
            <Lightbulb className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Next Period</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Expected around {new Date(fertilityData.nextPeriodDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-100 rounded-full mt-1">
            <Calendar className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Pregnancy Test</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Best to test after {new Date(fertilityData.pregnancyTestDay).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
