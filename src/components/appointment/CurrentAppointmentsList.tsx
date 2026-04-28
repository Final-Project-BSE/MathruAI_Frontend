"use client";

import { CheckCircle2, Clock3, MapPin, Trash2, XCircle } from "lucide-react";
import type { AppointmentResponseDto } from "@/app/api/appointment/types";
import { Button } from "@/components/ui/button";
import { APPOINTMENT_STATUS_STYLES } from "./constants";
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
};

export default function CurrentAppointmentsList({
  appointments,
  loading = false,
  actionLoadingId = null,
  onCancel,
  onComplete,
  onDeleteCompleted,
}: CurrentAppointmentsListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
        Loading appointments...
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-zinc-400">
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
        const isBusy = actionLoadingId === appointment.id;

        return (
          <div
            key={appointment.id}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Clock3 className="h-4 w-4 text-zinc-400" />
                  <span>
                    {formatAppointmentDate(appointment.appointmentDate)} at {formatTimeLabel(appointment.startTime)}
                  </span>
                </div>

                <p className="text-xs text-zinc-300">
                  {getAppointmentTypeLabel(appointment.appointmentType)}
                </p>

                <p className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {appointment.location || "No location"}
                </p>
              </div>

              <span
                className={`rounded-full border px-2 py-1 text-[11px] font-medium ${statusStyle.className}`}
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
                  className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => onComplete(appointment)}
                  className="bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </Button>
              </div>
            ) : appointment.status === "COMPLETED" ? (
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => onDeleteCompleted?.(appointment)}
                  className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
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
