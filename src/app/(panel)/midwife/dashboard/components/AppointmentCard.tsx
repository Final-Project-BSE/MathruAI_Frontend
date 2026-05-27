"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { appointmentApi } from "@/app/api/appointment/api";
import type { UpcomingAppointmentResponseDto } from "@/app/api/appointment/types";
import {
  formatAppointmentDate,
  formatTimeLabel,
  getAppointmentTypeLabel,
  toAppointmentTimestamp,
  toIsoDate,
} from "@/components/appointment/utils";

type UpcomingDashboardAppointment = {
  id: string;
  date: string;
  time: string;
  patient: string;
  type: string;
};

type AppointmentCardProps = {
  token: string;
  midwifeId: number;
};

export function AppointmentCard({ token, midwifeId }: AppointmentCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingDashboardAppointment[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadUpcomingAppointments() {
      try {
        setLoading(true);
        setError("");

        const upcomingRows = await appointmentApi.getUpcomingAppointments(
          token,
          midwifeId
        );

        if (!active) return;

        const mapped = upcomingRows
          .filter((row) => String(row.status).toUpperCase() === "SCHEDULED")
          .map((row: UpcomingAppointmentResponseDto) => ({
            id: String(row.appointmentId),
            date: row.appointmentDate,
            time: row.startTime,
            patient:
              `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
              row.userEmail ||
              `User #${row.userId}`,
            type: getAppointmentTypeLabel(row.appointmentType),
          }));

        mapped.sort((a, b) => {
          const aTs = toAppointmentTimestamp(a.date, a.time);
          const bTs = toAppointmentTimestamp(b.date, b.time);

          if (aTs === null && bTs === null) return 0;
          if (aTs === null) return 1;
          if (bTs === null) return -1;

          return aTs - bTs;
        });

        setUpcomingAppointments(mapped);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load upcoming appointments"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUpcomingAppointments();

    const intervalId = window.setInterval(() => {
      void loadUpcomingAppointments();
    }, 30000);

    function handleFocus() {
      void loadUpcomingAppointments();
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    function handleAppointmentsChanged() {
      void loadUpcomingAppointments();
    }

    window.addEventListener("appointments:changed", handleAppointmentsChanged);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("appointments:changed", handleAppointmentsChanged);
    };
  }, [token, midwifeId]);

  const todayCount = useMemo(() => {
    const todayLabel = toIsoDate(new Date());

    return upcomingAppointments.filter((item) => item.date === todayLabel).length;
  }, [upcomingAppointments]);

  const visibleAppointments = useMemo(() => {
    return showAll ? upcomingAppointments : upcomingAppointments.slice(0, 3);
  }, [showAll, upcomingAppointments]);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4 sm:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-white/80 sm:text-[18px]">Upcoming Appointments</h2>
          <p className="text-[11px] sm:text-[12px] leading-6 text-white/50">
            Quick view of upcoming patient visits for today.
          </p>
        </div>
        <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#fab0a7]">
          {todayCount} Today
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Patient List</h3>
          <div className="flex items-center gap-3">
            {upcomingAppointments.length > 3 ? (
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="text-xs font-medium text-[#fab0a7] transition hover:text-[#ffd0c9]"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            ) : null}
            <span className="text-xs text-slate-400">Time Sorted</span>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading upcoming appointments...</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : upcomingAppointments.length ? (
          <div className="space-y-3">
            {visibleAppointments.map((appointment) => (
              <div
                key={`${appointment.id}-${appointment.date}-${appointment.time}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fab0a7]/10 p-2 text-[#fab0a7]">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{appointment.patient}</p>
                    <p className="text-xs text-slate-400">{appointment.type}</p>
                    <p className="text-[10px] text-slate-500">
                      {formatAppointmentDate(appointment.date)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {formatTimeLabel(appointment.time)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No upcoming appointments found.</p>
        )}
      </div>
    </div>
  );
}