"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, CalendarPlus, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { appointmentApi } from "@/app/api/appointment/api";
import type {
  AppointmentCreateRequestDto,
  AppointmentResponseDto,
} from "@/app/api/appointment/types";
import CurrentAppointmentsList from "@/components/appointment/CurrentAppointmentsList";
import MidwifeRequestedAppointmentsDialog from "@/components/appointment/MidwifeRequestedAppointmentsDialog";
import NewAppointmentForm from "@/components/appointment/NewAppointmentForm";
import { Button } from "@/components/ui/button";
import { sortAppointmentsByDateTime } from "@/components/appointment/utils";

type PatientAppointmentsCardProps = {
  token: string;
  midwifeId: number | null;
  patientId: number;
  patientName?: string;
  defaultLocation?: string;
};

export default function PatientAppointmentsCard({
  token,
  midwifeId,
  patientId,
  patientName,
  defaultLocation,
}: PatientAppointmentsCardProps) {
  const [mode, setMode] = useState<"list" | "new">("list");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [requestedCount, setRequestedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [reasonByDate, setReasonByDate] = useState<Record<string, string>>({});
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookedSlotsLoading, setBookedSlotsLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);

  const canUseApi = Boolean(token && midwifeId && patientId);

  function notifyAppointmentsChanged() {
    window.dispatchEvent(new Event("appointments:changed"));
  }

  function pushAppointments(next: AppointmentResponseDto[]) {
    setAppointments(sortAppointmentsByDateTime(next));
  }

  async function refreshAfterMutation(dateOverride?: string | null) {
    // Clear stale slot data immediately so UI never keeps old booked slots after mutations.
    setBookedSlots([]);
    await Promise.all([refreshAppointments(), refreshBookedSlots(dateOverride)]);
  }

  const refreshBookedSlots = useCallback(
    async (dateOverride?: string | null) => {
      const targetDate = dateOverride ?? selectedDateIso;

      if (!token || !midwifeId || !patientId || !targetDate) {
        setBookedSlots([]);
        return;
      }

      setBookedSlotsLoading(true);
      try {
        const data = await appointmentApi.getBookedSlots(
          token,
          midwifeId,
          patientId,
          targetDate
        );
        setBookedSlots(data.bookedSlots || []);
      } finally {
        setBookedSlotsLoading(false);
      }
    },
    [token, midwifeId, patientId, selectedDateIso]
  );

  const refreshRequestedCount = useCallback(async () => {
    if (!token || !midwifeId) {
      setRequestedCount(0);
      return;
    }

    try {
      const rows = await appointmentApi.getMidwifeAppointmentRequests(
        token,
        midwifeId
      );
      setRequestedCount(
        rows.filter(
          (item) =>
            item.userId === patientId &&
            String(item.status).toUpperCase() === "PENDING"
        ).length
      );
    } catch {
      setRequestedCount(0);
    }
  }, [token, midwifeId, patientId]);

  const refreshAppointments = useCallback(async () => {
    if (!token || !midwifeId || !patientId) return;

    const [rows, unavailable] = await Promise.all([
      appointmentApi.getPatientAppointments(token, midwifeId, patientId),
      appointmentApi.getUnavailableDates(token, midwifeId, patientId),
    ]);

    pushAppointments(rows);
    setUnavailableDates(unavailable.dates || []);
    setReasonByDate(unavailable.reasonByDate || {});
  }, [token, midwifeId, patientId]);

  useEffect(() => {
    if (!token || !midwifeId || !patientId) return;

    let active = true;

    async function loadAppointments() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const [rows, unavailable] = await Promise.all([
          appointmentApi.getPatientAppointments(token, midwifeId, patientId),
          appointmentApi.getUnavailableDates(token, midwifeId, patientId),
        ]);

        if (!active) return;

        pushAppointments(rows);
        setUnavailableDates(unavailable.dates || []);
        setReasonByDate(unavailable.reasonByDate || {});
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load appointments.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAppointments();

    return () => {
      active = false;
    };
  }, [token, midwifeId, patientId]);

  useEffect(() => {
    void refreshBookedSlots();
  }, [refreshBookedSlots]);

  useEffect(() => {
    void refreshRequestedCount();

    function handleRequestChanged() {
      void refreshRequestedCount();
    }

    window.addEventListener("appointment-requests:changed", handleRequestChanged);
    window.addEventListener("appointments:changed", handleRequestChanged);

    return () => {
      window.removeEventListener("appointment-requests:changed", handleRequestChanged);
      window.removeEventListener("appointments:changed", handleRequestChanged);
    };
  }, [refreshRequestedCount]);

  const currentAppointments = useMemo(() => {
    return appointments.filter(
      (item) => item.status === "SCHEDULED" || item.status === "COMPLETED"
    );
  }, [appointments]);

  const visibleAppointments = useMemo(() => {
    return showAllAppointments
      ? currentAppointments
      : currentAppointments.slice(0, 2);
  }, [currentAppointments, showAllAppointments]);

  async function handleCreate(payload: AppointmentCreateRequestDto) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!canUseApi) {
        throw new Error("Missing patient or authentication context.");
      }

      await appointmentApi.createAppointment(token, midwifeId, patientId, {
        ...payload,
        endTime: payload.endTime ?? null,
      });

      await refreshAfterMutation();
      notifyAppointmentsChanged();
      setMode("list");
      setSuccess("Appointment created successfully.");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "Selected time slot is already booked."
      ) {
        await refreshAfterMutation(selectedDateIso);
        notifyAppointmentsChanged();
      }

      setError(err instanceof Error ? err.message : "Failed to create appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      if (!canUseApi) {
        throw new Error("Missing patient or authentication context.");
      }

      await appointmentApi.cancelAppointment(token, midwifeId, patientId, row.id);
      await refreshAfterMutation(row.appointmentDate);
      notifyAppointmentsChanged();
      setSuccess("Appointment canceled and removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel appointment.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleComplete(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      if (!canUseApi) {
        throw new Error("Missing patient or authentication context.");
      }

      await appointmentApi.completeAppointment(token, midwifeId, patientId, row.id);
      await refreshAfterMutation(row.appointmentDate);
      notifyAppointmentsChanged();
      setSuccess("Appointment marked as completed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete appointment.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteCompleted(row: AppointmentResponseDto) {
    try {
      setActionLoadingId(row.id);
      setError("");
      setSuccess("");

      if (!canUseApi) {
        throw new Error("Missing patient or authentication context.");
      }

      await appointmentApi.deleteAppointment(token, midwifeId, patientId, row.id);
      await refreshAfterMutation(row.appointmentDate);
      notifyAppointmentsChanged();
      setSuccess("Completed appointment deleted.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete completed appointment."
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <CalendarClock className="h-5 w-5 text-zinc-300" />
            Appointment
          </h2>
          <p className="text-sm text-zinc-400">
            {patientName
              ? `Manage appointments for ${patientName}.`
              : "Manage current and upcoming patient appointments."}
          </p>
        </div>

        {mode === "list" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => {
                void refreshRequestedCount();
                setRequestDialogOpen(true);
              }}
              className="relative rounded-xl bg-[#d04f51] px-4 py-2 text-sm text-white hover:bg-[#b94245]"
            >
              <ClipboardList className="h-4 w-4" />
              Requested Appointments
              {requestedCount > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#d04f51] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {requestedCount > 99 ? "99+" : requestedCount}
                </span>
              ) : null}
            </Button>

            <Button
              type="button"
              onClick={() => {
                setMode("new");
                setError("");
                setSuccess("");
              }}
              className="rounded-xl bg-[#d04f51] px-4 py-2 text-sm text-white hover:bg-[#b94245]"
            >
              <CalendarPlus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-emerald-500/30 bg-black p-2 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        {mode === "list" ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-400">
                Current appointments: {currentAppointments.length}
              </p>

              {currentAppointments.length > 2 ? (
                <button
                  type="button"
                  onClick={() => setShowAllAppointments((prev) => !prev)}
                  className="text-xs font-medium text-[#fab0a7] transition hover:text-[#ffd0c9]"
                >
                  {showAllAppointments ? "Show less" : "View all"}
                </button>
              ) : null}
            </div>

            <CurrentAppointmentsList
              appointments={visibleAppointments}
              loading={loading}
              actionLoadingId={actionLoadingId}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onDeleteCompleted={handleDeleteCompleted}
              glass={true}
              theme="dark"
            />
          </>
        ) : (
          <NewAppointmentForm
            unavailableDates={unavailableDates}
            bookedSlots={bookedSlots}
            reasonByDate={reasonByDate}
            defaultLocation={defaultLocation}
            submitting={saving}
            slotLoading={bookedSlotsLoading}
            theme="dark"
            onDateChange={(date) => {
              if (!date) {
                setSelectedDateIso(null);
                setBookedSlots([]);
                return;
              }

              setBookedSlots([]);
              setSelectedDateIso(format(date, "yyyy-MM-dd"));
            }}
            onCancel={() => {
              setMode("list");
              setError("");
            }}
            onSubmit={handleCreate}
          />
        )}
      </div>

      {token && midwifeId ? (
        <MidwifeRequestedAppointmentsDialog
          open={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
          token={token}
          midwifeId={midwifeId}
          userId={patientId}
          onHandled={async () => {
            await refreshAfterMutation();
            await refreshRequestedCount();
            notifyAppointmentsChanged();
          }}
        />
      ) : null}
    </section>
  );
}