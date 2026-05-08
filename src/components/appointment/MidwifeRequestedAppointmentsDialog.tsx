"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, MapPin, XCircle } from "lucide-react";
import { appointmentApi } from "@/app/api/appointment/api";
import type { AppointmentRequestResponseDto } from "@/app/api/appointment/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatAppointmentDate, formatTimeLabel, getAppointmentTypeLabel, toAppointmentTimestamp } from "./utils";

type MidwifeRequestedAppointmentsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  midwifeId: number;
  userId?: number;
  onHandled?: () => void | Promise<void>;
};

export default function MidwifeRequestedAppointmentsDialog({
  open,
  onOpenChange,
  token,
  midwifeId,
  userId,
  onHandled,
}: MidwifeRequestedAppointmentsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState<AppointmentRequestResponseDto[]>([]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const rows = await appointmentApi.getMidwifeAppointmentRequests(token, midwifeId);
      setRequests(
        typeof userId === "number"
          ? rows.filter((item) => item.userId === userId)
          : rows
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointment requests.");
    } finally {
      setLoading(false);
    }
  }, [token, midwifeId, userId]);

  useEffect(() => {
    if (!open) {
      setError("");
      setSuccess("");
      return;
    }

    void loadRequests();
  }, [open, loadRequests]);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const aTs = toAppointmentTimestamp(a.appointmentDate, a.startTime);
      const bTs = toAppointmentTimestamp(b.appointmentDate, b.startTime);

      if (aTs === null && bTs === null) return 0;
      if (aTs === null) return 1;
      if (bTs === null) return -1;

      return aTs - bTs;
    });
  }, [requests]);

  const pendingRequests = useMemo(() => {
    return sortedRequests.filter((item) => item.status === "PENDING");
  }, [sortedRequests]);

  async function handleAccept(request: AppointmentRequestResponseDto) {
    try {
      setActionLoadingId(request.requestId);
      setError("");
      setSuccess("");

      await appointmentApi.acceptAppointmentRequest(token, midwifeId, request.requestId);
      await loadRequests();
      await onHandled?.();
      window.dispatchEvent(new Event("appointment-requests:changed"));
      window.dispatchEvent(new Event("appointments:changed"));
      setSuccess("Appointment confirmed.");
    } catch (err) {
      await loadRequests();
      await onHandled?.();
      window.dispatchEvent(new Event("appointment-requests:changed"));
      window.dispatchEvent(new Event("appointments:changed"));
      setError(err instanceof Error ? err.message : "Failed to accept appointment request.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDecline(request: AppointmentRequestResponseDto) {
    try {
      setActionLoadingId(request.requestId);
      setError("");
      setSuccess("");

      await appointmentApi.declineAppointmentRequest(token, midwifeId, request.requestId);
      await loadRequests();
      await onHandled?.();
      window.dispatchEvent(new Event("appointment-requests:changed"));
      window.dispatchEvent(new Event("appointments:changed"));
      setSuccess("Request declined.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decline appointment request.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/10 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Requested Appointments</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Review patient appointment requests and accept or decline them.
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

        {loading ? (
          <div className="rounded-lg border border-white/10 bg-black p-4 text-sm text-zinc-300">
            Loading requested appointments...
          </div>
        ) : pendingRequests.length ? (
          <div className="space-y-3">
            {pendingRequests.map((item) => {
              const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim();
              const patientLabel = fullName || item.userEmail || `User #${item.userId}`;
              const isPending = item.status === "PENDING";
              const isBusy = actionLoadingId === item.requestId;

              return (
                <div
                  key={item.requestId}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">{patientLabel}</p>

                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Clock3 className="h-4 w-4 text-zinc-400" />
                        <span>
                          {formatAppointmentDate(item.appointmentDate)} at {formatTimeLabel(item.startTime)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300">
                        {getAppointmentTypeLabel(item.appointmentType)}
                      </p>

                      <p className="flex items-center gap-2 text-xs text-zinc-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location || "No location"}
                      </p>
                    </div>

                    <span
                      className={
                        item.status === "PENDING"
                          ? "rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-200"
                          : item.status === "ACCEPTED"
                            ? "rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200"
                            : "rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-200"
                      }
                    >
                      {item.status}
                    </span>
                  </div>

                  {isPending ? (
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => handleDecline(item)}
                        className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                        Decline
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => handleAccept(item)}
                        className="bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 bg-black p-4 text-sm text-zinc-400">
            No requested appointments found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
