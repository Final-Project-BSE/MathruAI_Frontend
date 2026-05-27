"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { appointmentApi } from "@/app/api/appointment/api";
import type { AppointmentCreateRequestDto } from "@/app/api/appointment/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewAppointmentForm from "./NewAppointmentForm";
import CurrentAppointmentsList from "./CurrentAppointmentsList";
import type { AppointmentResponseDto } from "@/app/api/appointment/types";
import { useLanguage } from "@/components/common/useLanguage";

type MotherAppointmentRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  midwifeId: number;
  userId: number;
  defaultLocation?: string;
};

export default function MotherAppointmentRequestDialog({
  open,
  onOpenChange,
  token,
  midwifeId,
  userId,
  defaultLocation,
}: MotherAppointmentRequestDialogProps) {
  const [saving, setSaving] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [reasonByDate, setReasonByDate] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState<"request" | "scheduled">("request");
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { t } = useLanguage();
  const appointmentText = t.appointment;

  const refreshUnavailableDates = useCallback(async () => {
    const data = await appointmentApi.getUnavailableDates(
      token,
      midwifeId,
      userId
    );
    setUnavailableDates(data.dates || []);
    setReasonByDate(data.reasonByDate || {});
  }, [token, midwifeId, userId]);

  const refreshBookedSlots = useCallback(
    async (date?: string | null) => {
      const targetDate = date ?? selectedDateIso;
      if (!targetDate) {
        setBookedSlots([]);
        return;
      }

      setSlotLoading(true);
      try {
        const data = await appointmentApi.getBookedSlots(
          token,
          midwifeId,
          userId,
          targetDate
        );
        setBookedSlots(data.bookedSlots || []);
      } finally {
        setSlotLoading(false);
      }
    },
    [token, midwifeId, userId, selectedDateIso]
  );

  useEffect(() => {
    if (!open) {
      setError("");
      setSuccess("");
      setBookedSlots([]);
      setSelectedDateIso(null);
      setMode("request");
      return;
    }

    let active = true;

    async function loadInitial() {
      try {
        setError("");
        setSuccess("");
        await refreshUnavailableDates();
        if (!active) return;
        if (selectedDateIso) {
          await refreshBookedSlots(selectedDateIso);
        }
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : appointmentText.failedToLoadRequestData
        );
      }
    }

    void loadInitial();

    return () => {
      active = false;
    };
  }, [
    open,
    refreshBookedSlots,
    refreshUnavailableDates,
    selectedDateIso,
    appointmentText.failedToLoadRequestData,
  ]);

  useEffect(() => {
    if (!open) return;
    if (mode !== "scheduled") return;

    let active = true;

    async function loadAppointments() {
      try {
        setLoadingAppointments(true);
        const rows = await appointmentApi.getPatientAppointments(
          token,
          midwifeId,
          userId
        );
        if (!active) return;

        // filter out appointments the user deleted locally (persisted in localStorage)
        const deletedKey = `deletedAppointments:${userId}`;
        let deletedIds: string[] = [];
        try {
          const raw = localStorage.getItem(deletedKey);
          if (raw) deletedIds = JSON.parse(raw) as string[];
        } catch (e) {
          deletedIds = [];
        }

        const filtered = rows.filter((r) => !deletedIds.includes(r.id));
        setAppointments(filtered);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : appointmentText.failedToLoadAppointments
        );
      } finally {
        if (active) setLoadingAppointments(false);
      }
    }

    void loadAppointments();

    return () => {
      active = false;
    };
  }, [
    open,
    mode,
    token,
    midwifeId,
    userId,
    appointmentText.failedToLoadAppointments,
  ]);

  async function handleCancel(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      const updated = await appointmentApi.cancelAppointment(
        token,
        midwifeId,
        userId,
        row.id
      );

      setAppointments((prev) =>
        prev.map((item) => (item.id === row.id ? updated : item))
      );
      setSuccess(appointmentText.appointmentCanceled);
      window.dispatchEvent(new Event("appointments:changed"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : appointmentText.failedToCancelAppointment
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleComplete(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      const updated = await appointmentApi.completeAppointment(
        token,
        midwifeId,
        userId,
        row.id
      );

      setAppointments((prev) =>
        prev.map((item) => (item.id === row.id ? updated : item))
      );
      setSuccess(appointmentText.appointmentCompleted);
      window.dispatchEvent(new Event("appointments:changed"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : appointmentText.failedToCompleteAppointment
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteCompleted(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      // Try to remove on server for all statuses. Some backends may only allow deletion for COMPLETED;
      // in that case we fall back to persisting deletion locally so the user doesn't see it again.
      let serverDeleted = false;
      try {
        await appointmentApi.deleteAppointment(token, midwifeId, userId, row.id);
        serverDeleted = true;
      } catch (apiErr) {
        // If server deletion fails, we'll persist locally as a fallback below.
        serverDeleted = false;
      }

      // Persist deletion locally so the user doesn't see it again when reloading.
      try {
        const deletedKey = `deletedAppointments:${userId}`;
        const raw = localStorage.getItem(deletedKey);
        const arr: string[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(row.id)) {
          arr.push(row.id);
          localStorage.setItem(deletedKey, JSON.stringify(arr));
        }
        // If server deleted successfully, also ensure local list doesn't keep stale entries.
        if (serverDeleted) {
          const filtered = arr.filter((id) => id !== row.id);
          localStorage.setItem(deletedKey, JSON.stringify(filtered));
        }
      } catch (e) {
        // ignore localStorage errors
      }

      setAppointments((prev) => prev.filter((item) => item.id !== row.id));
      setSuccess(
        serverDeleted
          ? appointmentText.appointmentDeleted
          : appointmentText.appointmentRemovedLocally
      );
      window.dispatchEvent(new Event("appointments:changed"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : appointmentText.failedToDeleteAppointment
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSubmit(payload: AppointmentCreateRequestDto) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await appointmentApi.createAppointmentRequest(
        token,
        midwifeId,
        userId,
        payload
      );

      await Promise.all([
        refreshUnavailableDates(),
        refreshBookedSlots(payload.appointmentDate),
      ]);

      setSuccess(appointmentText.appointmentSubmitted);
      window.dispatchEvent(new Event("appointments:changed"));
      window.dispatchEvent(new Event("appointment-requests:changed"));
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : appointmentText.failedToSubmitRequest
      );
      await Promise.all([refreshUnavailableDates(), refreshBookedSlots()]);
    } finally {
      setSaving(false);
    }
  }

  const scheduledCount = appointments.filter(
    (a) => a.status === "SCHEDULED"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-xl border-gray-200 bg-pink-50 p-6 text-black shadow-lg">
        <DialogHeader className="p-0">
          <div className="mb-4 rounded-lg bg-[#d04f51] p-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("request")}
                className={
                  mode === "request"
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#d04f51] shadow-sm"
                    : "rounded-full bg-[#d04f51]/20 px-4 py-2 text-sm font-medium text-white hover:bg-[#d04f51]/30"
                }
              >
                {appointmentText.requestAppointment}
              </button>

              <button
                type="button"
                onClick={() => setMode("scheduled")}
                className={
                  mode === "scheduled"
                    ? "relative rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#d04f51] shadow-sm"
                    : "relative rounded-full bg-[#d04f51]/20 px-4 py-2 text-sm font-medium text-white hover:bg-[#d04f51]/30"
                }
              >
                {appointmentText.scheduledAppointments}
                {appointments.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {appointments.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <DialogTitle className="mt-0 text-lg font-semibold text-zinc-900">
              {mode === "request"
                ? appointmentText.requestAppointment
                : appointmentText.scheduledAppointments}
            </DialogTitle>

            <DialogDescription className="mt-1 text-zinc-600">
              {mode === "request"
                ? appointmentText.requestDescription
                : appointmentText.scheduledDescription}
            </DialogDescription>
          </div>
        </DialogHeader>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        {mode === "request" ? (
          <NewAppointmentForm
            unavailableDates={unavailableDates}
            bookedSlots={bookedSlots}
            reasonByDate={reasonByDate}
            defaultLocation={defaultLocation}
            submitting={saving}
            slotLoading={slotLoading}
            theme="light"
            onDateChange={(date) => {
              if (!date) {
                setSelectedDateIso(null);
                setBookedSlots([]);
                return;
              }

              const iso = format(date, "yyyy-MM-dd");
              setSelectedDateIso(iso);
              setBookedSlots([]);
              void refreshBookedSlots(iso);
            }}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">
              {appointmentText.currentScheduledAppointments}: {scheduledCount}
            </p>

            <CurrentAppointmentsList
              appointments={appointments}
              loading={loadingAppointments}
              actionLoadingId={actionLoadingId}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onDeleteCompleted={handleDeleteCompleted}
              glass={true}
              theme="light"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}