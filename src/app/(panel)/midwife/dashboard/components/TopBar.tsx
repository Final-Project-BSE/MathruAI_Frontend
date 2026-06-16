"use client";

import React, { useEffect, useMemo, useState } from "react";
import AssetCard from "./AssetCard";
import AIAssistantCard from "./AIAssistantCard";
import PatientsConsoleCard from "./PatientsConsoleCard";
import Link from "next/link";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";

import { assignmentApi } from "@/app/api/user-assign/api";
import { appointmentApi } from "@/app/api/appointment/api";
import { vaccinationApi } from "@/app/api/vaccination/api";

type DashboardAsset = {
  name: string;
  label: string;
  rate: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  coinBg: string;
  isLoading?: boolean;
  error?: string;
};

type DashboardStats = {
  assignedPatients: number;
  upcomingAppointments: number;
  todayAppointments: number;
  pendingAppointmentRequests: number;
  missedVaccinations: number;
};

const initialStats: DashboardStats = {
  assignedPatients: 0,
  upcomingAppointments: 0,
  todayAppointments: 0,
  pendingAppointmentRequests: 0,
  missedVaccinations: 0,
};

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isPromiseFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

export default function TopBar() {
  const [token, setToken] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsStatsLoading(true);
        setStatsError("");

        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!mounted) return;

        setToken(jwt);

        if (!jwt) {
          setCurrentUserId(null);
          setStats(initialStats);
          setStatsError("No active session found.");
          return;
        }

        const currentUser = await getcuruser(jwt);

        if (!mounted) return;

        const midwifeId = Number(currentUser.id);
        setCurrentUserId(midwifeId);

        const today = getTodayIsoDate();

        const [
          assignedPatientsResult,
          upcomingAppointmentsResult,
          appointmentRequestsResult,
          vaccinationSummaryResult,
        ] = await Promise.allSettled([
          assignmentApi.getAssignedUsersForMidwife(midwifeId, jwt),
          appointmentApi.getUpcomingAppointments(jwt, midwifeId),
          appointmentApi.getMidwifeAppointmentRequests(jwt, midwifeId),
          vaccinationApi.getSummary(jwt, midwifeId),
        ]);

        if (!mounted) return;

        const assignedPatients = isPromiseFulfilled(assignedPatientsResult)
          ? assignedPatientsResult.value.length
          : 0;

        const upcomingAppointments = isPromiseFulfilled(upcomingAppointmentsResult)
          ? upcomingAppointmentsResult.value.length
          : 0;

        const todayAppointments = isPromiseFulfilled(upcomingAppointmentsResult)
          ? upcomingAppointmentsResult.value.filter(
              (appointment) => appointment.appointmentDate === today
            ).length
          : 0;

        const pendingAppointmentRequests = isPromiseFulfilled(
          appointmentRequestsResult
        )
          ? appointmentRequestsResult.value.filter(
              (request) => request.status === "PENDING"
            ).length
          : 0;

        const missedVaccinations = isPromiseFulfilled(vaccinationSummaryResult)
          ? vaccinationSummaryResult.value.missedPatients
          : 0;

        setStats({
          assignedPatients,
          upcomingAppointments,
          todayAppointments,
          pendingAppointmentRequests,
          missedVaccinations,
        });

        const failedRequests = [
          assignedPatientsResult,
          upcomingAppointmentsResult,
          appointmentRequestsResult,
          vaccinationSummaryResult,
        ].filter((result) => result.status === "rejected").length;

        if (failedRequests > 0) {
          setStatsError(`${failedRequests} dashboard metric(s) failed to load.`);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        if (mounted) {
          setToken("");
          setCurrentUserId(null);
          setStats(initialStats);
          setStatsError(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data."
          );
        }
      } finally {
        if (mounted) {
          setIsStatsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const dashboardAssets = useMemo<DashboardAsset[]>(
    () => [
      {
        name: "Assigned Patients",
        label: "Currently assigned to you",
        rate: String(stats.assignedPatients),
        change: "Live from assigned users",
        changeType: "neutral",
        coinBg: "bg-slate-700/80",
        isLoading: isStatsLoading,
        error: statsError,
      },
      {
        name: "Upcoming Appointments",
        label: "Scheduled upcoming visits",
        rate: String(stats.upcomingAppointments),
        change: `${stats.todayAppointments} today`,
        changeType: stats.todayAppointments > 0 ? "up" : "neutral",
        coinBg: "bg-purple-600/90",
        isLoading: isStatsLoading,
        error: statsError,
      },
      {
        name: "Pending Requests",
        label: "Appointment requests awaiting action",
        rate: String(stats.pendingAppointmentRequests),
        change:
          stats.pendingAppointmentRequests > 0
            ? "Needs review"
            : "No pending requests",
        changeType: stats.pendingAppointmentRequests > 0 ? "up" : "neutral",
        coinBg: "bg-yellow-500/90",
        isLoading: isStatsLoading,
        error: statsError,
      },
      {
        name: "Missed Vaccinations",
        label: "Patients marked as missed",
        rate: String(stats.missedVaccinations),
        change:
          stats.missedVaccinations > 0
            ? "Follow-up required"
            : "No missed patients",
        changeType: stats.missedVaccinations > 0 ? "down" : "neutral",
        coinBg: "bg-rose-500/90",
        isLoading: isStatsLoading,
        error: statsError,
      },
    ],
    [stats, isStatsLoading, statsError]
  );

  return (
    <main className="text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 h-full">
            <div className="grid h-full gap-4 grid-rows-[auto_1fr]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {dashboardAssets.map((asset) => (
                  <AssetCard key={asset.name} {...asset} />
                ))}
              </div>

              <div className="grid min-h-0">
                <Link href="/midwife/patient-console">
                  {token && currentUserId !== null ? (
                    <PatientsConsoleCard token={token} userId={currentUserId} />
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-white/10 bg-[#0b0b0f] text-sm text-white/50">
                      Loading patient console...
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </section>

          <aside className="h-full w-full">
            <AIAssistantCard
              token={token}
              sessionId={activeSessionId}
              onSessionChange={setActiveSessionId}
              onResponse={(response) => {
                console.log("AI response:", response);
              }}
              onError={(message) => {
                console.error(message);
              }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}