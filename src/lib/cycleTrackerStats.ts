import type { FertilityResponseDto } from "@/app/api/cycletracker/api";

type CalcStatsParams = {
  fertilityData: FertilityResponseDto;
  lastPeriodDate: string;
  cycleLength: number;
};

export const MS_PER_DAY = 86400000;

/** Derive the last period date if not provided */
export function deriveLastPeriod(
  nextPeriodDate: string,
  cycleLength: number
): Date {
  const next = new Date(`${nextPeriodDate}T00:00:00`);
  return new Date(next.getTime() - cycleLength * MS_PER_DAY);
}

/** Calculate current cycle stats */
export function calcStats({
  fertilityData,
  lastPeriodDate,
  cycleLength,
}: CalcStatsParams) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPeriod = lastPeriodDate
    ? new Date(`${lastPeriodDate}T00:00:00`)
    : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

  /* Days since last period */
  const diffDays = Math.floor((today.getTime() - lastPeriod.getTime()) / MS_PER_DAY);
  const safeDiff = Math.max(0, diffDays);

  /* Current cycle day */
  const currentDay = (safeDiff % cycleLength) + 1;

  /* Auto-advance next period if in the past */
  let nextPeriod = new Date(fertilityData.nextPeriodDate);
  nextPeriod.setHours(0, 0, 0, 0);
  while (nextPeriod < today) {
    nextPeriod = new Date(nextPeriod.getTime() + cycleLength * MS_PER_DAY);
  }
  const nextPeriodDays = Math.ceil((nextPeriod.getTime() - today.getTime()) / MS_PER_DAY);

  /* Fertile window end */
  let fertileEnd = new Date(fertilityData.fertileWindowEnd);
  fertileEnd.setHours(0, 0, 0, 0);
  while (fertileEnd < today) {
    fertileEnd = new Date(fertileEnd.getTime() + cycleLength * MS_PER_DAY);
  }
  const fertileDays = Math.ceil((fertileEnd.getTime() - today.getTime()) / MS_PER_DAY);

  return {
    currentDay,
    cycleLength,
    nextPeriod: nextPeriodDays,
    fertile: fertileDays,
  };
}

/** Generate future period dates from lastPeriodDate until current month */
export function generateFutureCycles(
  lastPeriodDate: string,
  cycleLength: number
): Date[] {
  const result: Date[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(`${lastPeriodDate}T00:00:00`);
  current.setHours(0, 0, 0, 0);

  // Calculate months ahead dynamically from last period to current month
  const monthsAhead =
    (today.getFullYear() - current.getFullYear()) * 12 +
    (today.getMonth() - current.getMonth()) +
    1; // include current month

  const endDate = new Date(current);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  // Generate future periods until endDate
  while (current <= endDate) {
    result.push(new Date(current));
    current = new Date(current.getTime() + cycleLength * MS_PER_DAY); // add one cycle
  }

  return result;
}
  