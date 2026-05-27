"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Lightbulb, Calendar } from "lucide-react";
import type { FertilityResponseDto } from "../../../api/cycletracker/api";

type InsightLabels = {
  cycleInsights: string;
  ovulationTitle: string;
  expectedOn: string;
  fertileWindowTitle: string;
  nextPeriodTitle: string;
  expectedAround: string;
  safeDaysTitle: string;
  pregnancyTestTitle: string;
  bestToTestAfter: string;
  notAvailable: string;
};

type Props = {
  fertilityData: FertilityResponseDto;
  labels: InsightLabels;
  formatDate: (value?: string | null) => string;
};

export function CycleInsights({ fertilityData, labels, formatDate }: Props) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {labels.cycleInsights}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full mt-1">
            <Target className="w-4 h-4 text-blue-600" />
          </div>

          <div>
            <h4 className="font-medium text-sm">{labels.ovulationTitle}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {labels.expectedOn} {formatDate(fertilityData.ovulationDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full mt-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>

          <div>
            <h4 className="font-medium text-sm">
              {labels.fertileWindowTitle}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {formatDate(fertilityData.fertileWindowStart)} -{" "}
              {formatDate(fertilityData.fertileWindowEnd)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-full mt-1">
            <Lightbulb className="w-4 h-4 text-purple-600" />
          </div>

          <div>
            <h4 className="font-medium text-sm">{labels.nextPeriodTitle}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {labels.expectedAround}{" "}
              {formatDate(fertilityData.nextPeriodDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full mt-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          <div>
            <h4 className="font-medium text-sm">{labels.safeDaysTitle}</h4>

            <p className="text-xs text-gray-600 leading-relaxed">
              {fertilityData.safeStart1 && fertilityData.safeEnd1 ? (
                <>
                  {formatDate(fertilityData.safeStart1)} -{" "}
                  {formatDate(fertilityData.safeEnd1)}
                  <br />
                </>
              ) : (
                labels.notAvailable
              )}

              {fertilityData.safeStart2 && fertilityData.safeEnd2 ? (
                <>
                  {formatDate(fertilityData.safeStart2)} -{" "}
                  {formatDate(fertilityData.safeEnd2)}
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-100 rounded-full mt-1">
            <Calendar className="w-4 h-4 text-pink-600" />
          </div>

          <div>
            <h4 className="font-medium text-sm">
              {labels.pregnancyTestTitle}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {labels.bestToTestAfter}{" "}
              {formatDate(fertilityData.pregnancyTestDay)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}