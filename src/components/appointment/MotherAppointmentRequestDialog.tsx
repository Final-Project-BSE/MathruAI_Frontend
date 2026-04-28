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

  const refreshUnavailableDates = useCallback(async () => {
    const data = await appointmentApi.getUnavailableDates(token, midwifeId, userId);
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
        const data = await appointmentApi.getBookedSlots(token, midwifeId, userId, targetDate);
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
        setError(err instanceof Error ? err.message : "Failed to load appointment request data.");
      }
    }

    void loadInitial();

    return () => {
      active = false;
    };
  }, [open, refreshBookedSlots, refreshUnavailableDates, selectedDateIso]);

  async function handleSubmit(payload: AppointmentCreateRequestDto) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await appointmentApi.createAppointmentRequest(token, midwifeId, userId, payload);

      await Promise.all([
        refreshUnavailableDates(),
        refreshBookedSlots(payload.appointmentDate),
      ]);

      setSuccess("Appointment request submitted successfully.");
      window.dispatchEvent(new Event("appointments:changed"));
      window.dispatchEvent(new Event("appointment-requests:changed"));
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit appointment request.");
      await Promise.all([refreshUnavailableDates(), refreshBookedSlots()]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-white/10 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Request Appointment</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Submit an appointment request to your midwife.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <NewAppointmentForm
          unavailableDates={unavailableDates}
          bookedSlots={bookedSlots}
          reasonByDate={reasonByDate}
          defaultLocation={defaultLocation}
          submitting={saving}
          slotLoading={slotLoading}
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
      </DialogContent>
    </Dialog>
  );
}
