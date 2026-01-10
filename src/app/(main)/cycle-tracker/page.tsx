"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LoadingState } from "./components/LoadingState";
import { AuthRequired } from "./components/AuthRequired";
import { CalculatorCard } from "./components/CalculatorCard";
import { StatsGrid, type CycleStats } from "./components/StatsGrid";
import { CycleCalendar, type CycleDay } from "./components/CycleCalendar";
import { CycleInsights } from "./components/CycleInsights";
import {
  calculateFertility,
  getLatestFertility,
  type FertilityResponseDto,
} from "../../api/cycletracker/api";

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function deriveLastPeriod(nextPeriodISO: string, len: number) {
  const d = new Date(nextPeriodISO);
  d.setDate(d.getDate() - len);
  return d;
}

function buildCalendarDays(params: {
  year: number;
  month: number; // 0-based
  fertilityData: FertilityResponseDto;
  lastPeriodDate: string; // optional
  cycleLength: number;
}): CycleDay[] {
  const { year, month, fertilityData, lastPeriodDate, cycleLength } = params;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const periodDuration = 5;

  const nextPeriod = new Date(fertilityData.nextPeriodDate);

  const lastPeriodStart = lastPeriodDate
    ? new Date(`${lastPeriodDate}T00:00:00`) // avoids timezone shift
    : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

  const fertileStart = new Date(fertilityData.fertileWindowStart);
  const fertileEnd = new Date(fertilityData.fertileWindowEnd);
  const ovulation = new Date(fertilityData.ovulationDate);

  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000);

  const lastPeriodEnd = addDays(lastPeriodStart, periodDuration);
  const nextPeriodEnd = addDays(nextPeriod, periodDuration);

  const days: CycleDay[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);

    const isPeriod =
      (currentDate >= lastPeriodStart && currentDate < lastPeriodEnd) ||
      (currentDate >= nextPeriod && currentDate < nextPeriodEnd);

    const isFertile = currentDate >= fertileStart && currentDate <= fertileEnd;
    const isOvulation = currentDate.toDateString() === ovulation.toDateString();
    const isToday = currentDate.toDateString() === today.toDateString();

    days.push({
      date: i,
      isPeriod,
      isFertile,
      isOvulation,
      isToday,
    });
  }

  return days;
}

function calcStats(params: {
  fertilityData: FertilityResponseDto;
  lastPeriodDate: string;
  cycleLength: number;
}): CycleStats {
  const { fertilityData, lastPeriodDate, cycleLength } = params;

  const today = new Date();

  const lastPeriod = lastPeriodDate
    ? new Date(`${lastPeriodDate}T00:00:00`) // avoid timezone shift
    : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

  const nextPeriod = new Date(fertilityData.nextPeriodDate);
  const fertileEnd = new Date(fertilityData.fertileWindowEnd);

  const currentDay =
    Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const daysToNextPeriod = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  // Load local persisted inputs
  useEffect(() => {
    const savedLast = localStorage.getItem("ct_lastPeriodDate");
    const savedLen = localStorage.getItem("ct_cycleLength");
    if (savedLast) setLastPeriodDate(savedLast);
    if (savedLen) setCycleLength(Number(savedLen));
  }, []);

  // Auth + load latest from backend
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
            setError(null);
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

  // Build calendar when month/data changes
  useEffect(() => {
    if (!fertilityData) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    setCalendarDays(
      buildCalendarDays({
        year,
        month,
        fertilityData,
        lastPeriodDate,
        cycleLength,
      })
    );
  }, [fertilityData, currentMonth, lastPeriodDate, cycleLength]);

  const stats = useMemo(() => {
    if (!fertilityData) {
      return { currentDay: 0, cycleLength, nextPeriod: 0, fertile: 0 };
    }
    return calcStats({ fertilityData, lastPeriodDate, cycleLength });
  }, [fertilityData, lastPeriodDate, cycleLength]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const displayMonth = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const leadingEmptyDays = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);

  async function handleCalculate() {
    if (!lastPeriodDate) {
      setError("Please enter your last period date");
      return;
    }
    if (!token) {
      setError("Please log in to calculate fertility window");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const data = await calculateFertility(token, {
        lastPeriodDate,
        averageCycleLength: cycleLength,
      });

      setFertilityData(data);
      localStorage.setItem("ct_lastPeriodDate", lastPeriodDate);
      localStorage.setItem("ct_cycleLength", String(cycleLength));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate fertility window");
    } finally {
      setLoading(false);
    }
  }

  function handleRecalculate() {
    setFertilityData(null);
    setLastPeriodDate("");
  }

  if (loadingData) return <LoadingState />;

  if (!isAuthenticated) {
    return <AuthRequired message={error || "Please log in to access the Cycle Tracker"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cycle Tracker</h1>
        <p className="text-gray-700">Track your cycle and fertility window</p>
      </div>

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
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                }
                onNextMonth={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                }
                onRecalculate={handleRecalculate}
              />
            </div>

            <div className="space-y-6">
              <CycleInsights fertilityData={fertilityData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
