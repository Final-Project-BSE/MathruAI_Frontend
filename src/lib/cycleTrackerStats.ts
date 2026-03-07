import type { FertilityResponseDto } from "@/app/api/cycletracker/api";

export type CycleStats = {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number;
  fertile: number;
};

export function deriveLastPeriod(nextPeriodISO: string, len: number) {
  const d = new Date(nextPeriodISO);
  d.setDate(d.getDate() - len);
  return d;
}

export function calcStats(params: {
  fertilityData: FertilityResponseDto;
  lastPeriodDate: string;
  cycleLength: number;
}): CycleStats {
  const { fertilityData, lastPeriodDate, cycleLength } = params;

  const today = new Date();

  const lastPeriod = lastPeriodDate
    ? new Date(`${lastPeriodDate}T00:00:00`)
    : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

  const nextPeriod = new Date(fertilityData.nextPeriodDate);
  const fertileEnd = new Date(fertilityData.fertileWindowEnd);

  const currentDay =
    Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const daysToNextPeriod = Math.ceil(
    (nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysToFertileEnd = Math.max(
    0,
    Math.ceil((fertileEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    currentDay: Math.max(0, currentDay),
    cycleLength,
    nextPeriod: Math.max(0, daysToNextPeriod),
    fertile: daysToFertileEnd,
  };
}