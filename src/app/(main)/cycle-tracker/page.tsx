"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LoadingState } from "../../../components/common/LoadingState";
import { AuthRequired } from "./components/AuthRequired";
import { CalculatorCard } from "./components/CalculatorCard";
import { StatsGrid } from "./components/StatsGrid";
import { CycleCalendar, type CycleDay } from "./components/CycleCalendar";
import { CycleInsights } from "./components/CycleInsights";
import Container from "@/components/shared/container";
import { calcStats, generateFutureCycles } from "@/lib/cycleTrackerStats";
import {
  calculateFertility,
  getLatestFertility,
  type FertilityResponseDto,
} from "../../api/cycletracker/api";
import TopBarFeatures from "@/components/common/TopBarFeatures";

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ✅ FIX 1: Parse "YYYY-MM-DD" as LOCAL date — avoids UTC timezone offset bug
function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function buildCalendarDays(params: {
  year: number;
  month: number;
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration?: number;
  safeStart1?: string;
  safeEnd1?: string;
  safeStart2?: string;
  safeEnd2?: string;
  fertileStart?: string;
  fertileEnd?: string;
  ovulationDate?: string;
}): CycleDay[] {
  const {
    year,
    month,
    lastPeriodDate,
    cycleLength,
    periodDuration = 1,
    safeStart1,
    safeEnd1,
    safeStart2,
    safeEnd2,
    fertileStart,
    fertileEnd,
    ovulationDate,
  } = params;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futurePeriods = generateFutureCycles(lastPeriodDate, cycleLength);
  const days: CycleDay[] = [];

  const addDays = (date: Date, n: number) =>
    new Date(date.getTime() + n * 86400000);

  // ✅ FIX 1 applied: all backend date strings parsed as local dates
  const safeStartDate1 = parseLocalDate(safeStart1);
  const safeEndDate1 = parseLocalDate(safeEnd1);
  const safeStartDate2 = parseLocalDate(safeStart2);
  const safeEndDate2 = parseLocalDate(safeEnd2);
  const fertileStartDate = parseLocalDate(fertileStart);
  const fertileEndDate = parseLocalDate(fertileEnd);
  const ovulationDateObj = parseLocalDate(ovulationDate);

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);

    const isPeriod = futurePeriods.some(
      (fp) => currentDate >= fp && currentDate < addDays(fp, periodDuration)
    );

    const isFertile =
      fertileStartDate &&
      fertileEndDate &&
      currentDate >= fertileStartDate &&
      currentDate <= fertileEndDate;

    const isOvulation =
      ovulationDateObj &&
      currentDate.toDateString() === ovulationDateObj.toDateString();

    // ✅ FIX 1 applied: now compares local dates correctly
    const isSafe =
      (safeStartDate1 && safeEndDate1 &&
        currentDate >= safeStartDate1 &&
        currentDate <= safeEndDate1) ||
      (safeStartDate2 && safeEndDate2 &&
        currentDate >= safeStartDate2 &&
        currentDate <= safeEndDate2);

    const isToday = currentDate.toDateString() === today.toDateString();

    days.push({
      date: i,
      isPeriod,
      isFertile: !!isFertile,
      isOvulation: !!isOvulation,
      isToday,
      isSafe: !!isSafe,
    });
  }

  return days;
}

export default function CycleTrackerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [fertilityData, setFertilityData] = useState<FertilityResponseDto | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CycleDay[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedLast = localStorage.getItem("ct_lastPeriodDate");
    const savedLen = localStorage.getItem("ct_cycleLength");
    if (savedLast) setLastPeriodDate(savedLast);
    if (savedLen) setCycleLength(Number(savedLen));
  }, []);

  // Authentication + load latest fertility data
  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);

          const latest = await getLatestFertility(session.user.token);

          if (latest) {
            setFertilityData(latest);
            setLastPeriodDate(latest.lastPeriodDate);
            setCycleLength(latest.averageCycleLength);

            localStorage.setItem("ct_lastPeriodDate", latest.lastPeriodDate);
            localStorage.setItem("ct_cycleLength", String(latest.averageCycleLength));
          }
        } else {
          setError("Please log in to access the cycle tracker.");
          setIsAuthenticated(false);
        }
      } catch {
        setError("Authentication error. Please log in again.");
        setIsAuthenticated(false);
      } finally {
        setLoadingData(false);
      }
    };
    initialize();
  }, []);

  // Build calendar days
  useEffect(() => {
    if (!lastPeriodDate && !fertilityData) return;
    if (!lastPeriodDate) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    setCalendarDays(
      buildCalendarDays({
        year,
        month,
        lastPeriodDate,
        cycleLength,
        safeStart1: fertilityData?.safeStart1,
        safeEnd1: fertilityData?.safeEnd1,
        safeStart2: fertilityData?.safeStart2,
        safeEnd2: fertilityData?.safeEnd2,
        fertileStart: fertilityData?.fertileWindowStart,
        fertileEnd: fertilityData?.fertileWindowEnd,
        ovulationDate: fertilityData?.ovulationDate,
      })
    );
  }, [lastPeriodDate, cycleLength, currentMonth, fertilityData]);

  const stats = useMemo(() => {
    if (!fertilityData)
      return { currentDay: 0, cycleLength, nextPeriod: 0, fertile: 0 };
    return calcStats({ fertilityData, lastPeriodDate, cycleLength });
  }, [fertilityData, lastPeriodDate, cycleLength]);

  const displayMonth = `${currentMonth.toLocaleString("default", {
    month: "long",
  })} ${currentMonth.getFullYear()}`;

  const leadingEmptyDays = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
    [currentMonth]
  );

  async function handleCalculate() {
    if (!lastPeriodDate) return setError("Please enter your last period date");
    if (!token) return setError("Please log in to calculate fertility window");

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const data = await calculateFertility(token, {
        lastPeriodDate,
        averageCycleLength: cycleLength,
      });

      setFertilityData(data);
      setLastPeriodDate(data.lastPeriodDate);
      setCycleLength(data.averageCycleLength);

      localStorage.setItem("ct_lastPeriodDate", data.lastPeriodDate);
      localStorage.setItem("ct_cycleLength", String(data.averageCycleLength));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate fertility window"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRecalculate() {
    setFertilityData(null);
    setLastPeriodDate("");
    setCalendarDays([]);
    localStorage.removeItem("ct_lastPeriodDate");
    localStorage.removeItem("ct_cycleLength");
  }

  if (loadingData) return <LoadingState />;
  if (!isAuthenticated) return <AuthRequired message={error || "Please log in"} />;

  return (
    <Container title="Cycle Tracker">
      <div className="min-h-screen bg-[#fed2cc] p-6">
        <TopBarFeatures />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cycle Tracker</h1>
        <p className="text-gray-700 mb-6">Track your cycle and fertility window</p>

        {!fertilityData && (
          <CalculatorCard
            lastPeriodDate={lastPeriodDate}
            cycleLength={cycleLength}
            onLastPeriodDateChange={setLastPeriodDate}
            onCycleLengthChange={setCycleLength}
            onCalculate={handleCalculate}
            loading={loading}
            error={error}
            success={success}
            maxDate={formatDateForApi(new Date())}
          />
        )}

        {fertilityData && (
          <>
            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CycleCalendar
                  displayMonth={displayMonth}
                  leadingEmptyDays={leadingEmptyDays}
                  days={calendarDays}
                  onPrevMonth={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                    )
                  }
                  onNextMonth={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                    )
                  }
                  onRecalculate={handleRecalculate}
                />
              </div>

              <CycleInsights fertilityData={fertilityData} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}