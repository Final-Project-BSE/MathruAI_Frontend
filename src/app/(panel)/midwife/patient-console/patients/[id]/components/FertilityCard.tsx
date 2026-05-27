"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import type { FertilityResponseDto } from "@/app/api/midwife-patient/types";
import { midwifePatientApi } from "@/app/api/midwife-patient/api";
import { formatDate } from "./lib/utils";

type FertilityCardProps = {
  fertility: FertilityResponseDto | null;
  token: string;
  midwifeId: number;
  patientId: number;
  onFertilityUpdated: (data: FertilityResponseDto) => void;
};

type CalendarDay = {
  date: number;
  isFertile: boolean;
  isOvulation: boolean;
  isSafe: boolean;
  isToday: boolean;
};

function parseLocalDate(value?: string | null): Date | null {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function isBetween(date: Date, start?: string, end?: string) {
  const startDate = parseLocalDate(start);
  const endDate = parseLocalDate(end);

  if (!startDate || !endDate) return false;

  return date >= startDate && date <= endDate;
}

function buildCalendarDays(
  year: number,
  month: number,
  fertility: FertilityResponseDto
): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ovulationDate = parseLocalDate(fertility.ovulationDate);

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const currentDate = new Date(year, month, dayNumber);

    return {
      date: dayNumber,
      isFertile: isBetween(
        currentDate,
        fertility.fertileWindowStart,
        fertility.fertileWindowEnd
      ),
      isOvulation:
        !!ovulationDate &&
        currentDate.toDateString() === ovulationDate.toDateString(),
      isSafe:
        isBetween(currentDate, fertility.safeStart1, fertility.safeEnd1) ||
        isBetween(currentDate, fertility.safeStart2, fertility.safeEnd2),
      isToday: currentDate.toDateString() === today.toDateString(),
    };
  });
}

function getDayClassName(day: CalendarDay) {
  if (day.isToday) {
    return "bg-white text-zinc-950 border-white font-bold";
  }

  if (day.isOvulation) {
    return "bg-red-600 text-white border-red-400 font-bold ring-2 ring-red-400/40";
  }

  if (day.isFertile) {
    return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
  }

  if (day.isSafe) {
    return "bg-blue-500/20 text-blue-200 border-blue-500/30";
  }

  return "bg-zinc-900 text-zinc-400 border-white/10";
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3">
      <span className="text-zinc-400">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

export default function FertilityCard({
  fertility,
  token,
  midwifeId,
  patientId,
  onFertilityUpdated,
}: FertilityCardProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [showInsights, setShowInsights] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [recalculating, setRecalculating] = useState(false);
  const [recalculateError, setRecalculateError] = useState<string | null>(null);

  const displayMonth = `${currentMonth.toLocaleString("default", {
    month: "long",
  })} ${currentMonth.getFullYear()}`;

  const leadingEmptyDays = useMemo(() => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
  }, [currentMonth]);

  const days = useMemo(() => {
    if (!fertility) return [];

    return buildCalendarDays(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      fertility
    );
  }, [currentMonth, fertility]);

  async function handleRecalculate() {
    if (!lastPeriodDate) {
      setRecalculateError("Please enter last period date.");
      return;
    }

    if (cycleLength < 21 || cycleLength > 35) {
      setRecalculateError("Cycle length must be between 21 and 35 days.");
      return;
    }

    try {
      setRecalculating(true);
      setRecalculateError(null);

      const updated = await midwifePatientApi.calculatePatientFertility(
        token,
        midwifeId,
        patientId,
        {
          lastPeriodDate,
          averageCycleLength: cycleLength,
        }
      );

      onFertilityUpdated(updated);
      setShowCalculator(false);
      setLastPeriodDate(updated.lastPeriodDate);
      setCycleLength(updated.averageCycleLength);
    } catch (err) {
      setRecalculateError(
        err instanceof Error ? err.message : "Failed to recalculate fertility."
      );
    } finally {
      setRecalculating(false);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Fertility Data</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Calendar overview of fertile, ovulation, and safe days.
            </p>
          </div>

          {fertility && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInsights(true)}
                className="rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                title="View insights"
                aria-label="View fertility insights"
              >
                <Eye className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowCalculator(true)}
                className="rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                title="Recalculate fertility"
                aria-label="Recalculate fertility"
              >
                <Calculator className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {!fertility ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
            No fertility data available.
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-sm font-medium text-white">
                {displayMonth}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: leadingEmptyDays }).map((_, index) => (
                <div key={`empty-${index}`} className="p-3" />
              ))}

              {days.map((day) => (
                <div
                  key={day.date}
                  className={`rounded-lg border p-3 text-center text-sm transition ${getDayClassName(
                    day
                  )}`}
                >
                  {day.date}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="h-3 w-3 rounded bg-emerald-500/40" />
                Fertile
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <span className="h-3 w-3 rounded bg-red-600" />
                Ovulation
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <span className="h-3 w-3 rounded bg-blue-500/40" />
                Safe
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <span className="h-3 w-3 rounded bg-white" />
                Today
              </div>
            </div>
          </>
        )}
      </section>

      <Modal
        open={showInsights}
        onClose={() => setShowInsights(false)}
        title="Fertility Insights"
      >
        {fertility && (
          <div className="space-y-3 text-sm">
            <InsightRow
              label="Fertile window"
              value={`${formatDate(fertility.fertileWindowStart)} - ${formatDate(
                fertility.fertileWindowEnd
              )}`}
            />

            <InsightRow
              label="Ovulation date"
              value={formatDate(fertility.ovulationDate)}
            />

            <InsightRow
              label="Next period date"
              value={formatDate(fertility.nextPeriodDate)}
            />

            <InsightRow
              label="Pregnancy test day"
              value={formatDate(fertility.pregnancyTestDay)}
            />

            <InsightRow
              label="Safe range 1"
              value={`${formatDate(fertility.safeStart1)} - ${formatDate(
                fertility.safeEnd1
              )}`}
            />

            <InsightRow
              label="Safe range 2"
              value={`${formatDate(fertility.safeStart2)} - ${formatDate(
                fertility.safeEnd2
              )}`}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={showCalculator}
        onClose={() => setShowCalculator(false)}
        title="Recalculate Fertility"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="lastPeriodDate"
              className="text-sm font-medium text-zinc-300"
            >
              Last Period Start Date
            </label>

            <input
              id="lastPeriodDate"
              type="date"
              value={lastPeriodDate}
              max={formatDateForInput(new Date())}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="cycleLength"
              className="text-sm font-medium text-zinc-300"
            >
              Average Cycle Length
            </label>

            <input
              id="cycleLength"
              type="number"
              min={21}
              max={35}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
            />
          </div>

          {recalculateError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {recalculateError}
            </div>
          )}

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={recalculating}
            className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {recalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recalculating...
              </>
            ) : (
              "Recalculate"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}