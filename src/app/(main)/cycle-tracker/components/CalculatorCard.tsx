"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type Props = {
  lastPeriodDate: string;
  cycleLength: number;
  onLastPeriodDateChange: (v: string) => void;
  onCycleLengthChange: (v: number) => void;
  onCalculate: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  maxDate: string;
};

export function CalculatorCard(props: Props) {
  const {
    lastPeriodDate,
    cycleLength,
    onLastPeriodDateChange,
    onCycleLengthChange,
    onCalculate,
    loading,
    error,
    success,
    maxDate,
  } = props;

  return (
    <div className="flex justify-center items-center  p-4 ">
      <Card className="bg-white/90 backdrop-blur-sm w-full max-w-md h-[450px] overflow-y-auto p-6 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Calculate Your Fertility Window</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 mt-3">
          <div>
            <Label  htmlFor="lastPeriod">Last Period Start Date</Label>
            <Input
              id="lastPeriod"
              type="date"
              value={lastPeriodDate}
              onChange={(e) => onLastPeriodDateChange(e.target.value)}
              max={maxDate}
              className="mt-3 "
            />
          </div>

          <div>
            <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
            <Input
              id="cycleLength"
              type="number"
              min="21"
              max="35"
              value={cycleLength}
              onChange={(e) => onCycleLengthChange(Number(e.target.value))}
              className="mt-2"

            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800 "  >
                Fertility window calculated successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={onCalculate}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600  mt-5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate Fertility Window"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}