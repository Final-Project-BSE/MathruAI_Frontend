import type { FertilityResponseDto } from "@/app/api/cycletracker/api";

export type CycleStats = {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number;
  fertile: number;
};

type CalcStatsParams = {
  fertilityData: FertilityResponseDto;
  lastPeriodDate: string;
  cycleLength: number;
};

export const MS_PER_DAY = 86400000;

export function deriveLastPeriod(
  nextPeriodDate: string,
  cycleLength: number
): Date {
  const next = new Date(`${nextPeriodDate}T00:00:00`);
  return new Date(next.getTime() - cycleLength * MS_PER_DAY);
}

export function calcStats({
  fertilityData,
  lastPeriodDate,
  cycleLength,
}: CalcStatsParams): CycleStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPeriod = lastPeriodDate
    ? new Date(`${lastPeriodDate}T00:00:00`)
    : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

  const diffDays = Math.floor(
    (today.getTime() - lastPeriod.getTime()) / MS_PER_DAY
  );

  const safeDiff = Math.max(0, diffDays);
  const currentDay = (safeDiff % cycleLength) + 1;

  let nextPeriod = new Date(`${fertilityData.nextPeriodDate}T00:00:00`);
  nextPeriod.setHours(0, 0, 0, 0);

  while (nextPeriod < today) {
    nextPeriod = new Date(nextPeriod.getTime() + cycleLength * MS_PER_DAY);
  }

  const nextPeriodDays = Math.ceil(
    (nextPeriod.getTime() - today.getTime()) / MS_PER_DAY
  );

  let fertileEnd = new Date(`${fertilityData.fertileWindowEnd}T00:00:00`);
  fertileEnd.setHours(0, 0, 0, 0);

  while (fertileEnd < today) {
    fertileEnd = new Date(fertileEnd.getTime() + cycleLength * MS_PER_DAY);
  }

  const fertileDays = Math.ceil(
    (fertileEnd.getTime() - today.getTime()) / MS_PER_DAY
  );

  return {
    currentDay,
    cycleLength,
    nextPeriod: nextPeriodDays,
    fertile: fertileDays,
  };
}

export function generateFutureCycles(
  lastPeriodDate: string,
  cycleLength: number
): Date[] {
  const result: Date[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(`${lastPeriodDate}T00:00:00`);
  current.setHours(0, 0, 0, 0);

  const monthsAhead =
    (today.getFullYear() - current.getFullYear()) * 12 +
    (today.getMonth() - current.getMonth()) +
    1;

  const endDate = new Date(current);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  while (current <= endDate) {
    result.push(new Date(current));
    current = new Date(current.getTime() + cycleLength * MS_PER_DAY);
  }

  return result;
}