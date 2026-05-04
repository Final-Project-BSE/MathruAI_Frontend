"use client";

import { CheckCircle2, Clock3, MapPin, Trash2, XCircle } from "lucide-react";
import type { AppointmentResponseDto } from "@/app/api/appointment/types";
import { Button } from "@/components/ui/button";
import { APPOINTMENT_STATUS_STYLES } from "./constants";
import type { AppointmentTheme } from "./utils";
import {
  formatAppointmentDate,
  formatTimeLabel,
  getAppointmentTypeLabel,
  sortAppointmentsByDateTime,
} from "./utils";

type CurrentAppointmentsListProps = {
  appointments: AppointmentResponseDto[];
  loading?: boolean;
  actionLoadingId?: string | null;
  onCancel: (appointment: AppointmentResponseDto) => void | Promise<void>;
  onComplete: (appointment: AppointmentResponseDto) => void | Promise<void>;
  onDeleteCompleted?: (appointment: AppointmentResponseDto) => void | Promise<void>;
  glass?: boolean;
  theme?: AppointmentTheme;
};

export default function CurrentAppointmentsList({
  appointments,
  loading = false,
  actionLoadingId = null,
  onCancel,
  onComplete,
  onDeleteCompleted,
  glass = false,
  theme = "light",
}: CurrentAppointmentsListProps) {
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div
        className={`rounded-xl border ${
          isDark
            ? glass
              ? "border-white/10 bg-white/5 text-zinc-300 backdrop-blur-sm"
              : "border-white/10 bg-black text-zinc-300"
            : glass
              ? "border-[#d04f51]/20 bg-[#d04f51]/10 text-zinc-800 backdrop-blur-sm"
              : "border-gray-200 bg-pink-50 text-zinc-700"
        } p-4 text-sm`}
      >
        Loading appointments...
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div
        className={`rounded-xl ${
          isDark
            ? glass
              ? "border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-sm"
              : "bg-white/5 text-zinc-400"
            : glass
              ? "border border-[#d04f51]/20 bg-[#d04f51]/10 text-zinc-800 backdrop-blur-sm"
              : "bg-[#d04f51]/10 text-zinc-600"
        } p-5 text-sm`}
      >
        No appointments found for this patient.
      </div>
    );
  }

  const sorted = sortAppointmentsByDateTime(appointments);

  return (
    <div className="space-y-3">
      {sorted.map((appointment) => {
        const statusStyle = APPOINTMENT_STATUS_STYLES[appointment.status];
        const isScheduled = appointment.status === "SCHEDULED";
        const appointmentTimestamp = new Date(`${appointment.appointmentDate}T${appointment.startTime}`).getTime();
        const isPastScheduled = isScheduled && appointmentTimestamp < Date.now();
        const isBusy = actionLoadingId === appointment.id;

        return (
          <div
            key={appointment.id}
            className={`rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md ${
              isDark
                ? glass
                  ? "border-white/10 bg-white/5 text-zinc-100 backdrop-blur-sm"
                  : "border-white/10 bg-black text-zinc-100"
                : glass
                  ? "border-[#d04f51]/20 bg-[#d04f51]/10 text-zinc-800 backdrop-blur-sm"
                  : "border-gray-100 bg-pink-50 text-zinc-800"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    isDark ? "text-zinc-100" : "text-zinc-800"
                  }`}
                >
                  <Clock3 className={`h-4 w-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
                  <span>
                    {formatAppointmentDate(appointment.appointmentDate)} at {formatTimeLabel(appointment.startTime)}
                  </span>
                </div>

                <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {getAppointmentTypeLabel(appointment.appointmentType)}
                </p>

                <p className={`flex items-center gap-2 text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <MapPin className="h-3.5 w-3.5" />
                  {appointment.location || "No location"}
                </p>
              </div>

              <span
                className={`rounded-full border px-2 py-1 text-[11px] font-medium ${
                  isDark ? statusStyle.darkClassName : statusStyle.lightClassName
                }`}
              >
                {statusStyle.label}
              </span>
            </div>

            {isScheduled ? (
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => onCancel(appointment)}
                  className={
                    isDark
                      ? "border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                      : "border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/20"
                  }
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => onComplete(appointment)}
                  className="bg-emerald-600 text-emerald-50 shadow-sm hover:bg-emerald-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </Button>
              </div>
            ) : (appointment.status === "COMPLETED" || appointment.status === "CANCELED" || isPastScheduled) ? (
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => onDeleteCompleted?.(appointment)}
                  className={
                    isDark
                      ? "border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                      : "border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/20"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
