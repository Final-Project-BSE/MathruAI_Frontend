"use client";

import { useMemo, useState } from "react";
import {
  Pencil,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  CreditCard,
  MessageSquare,
  Map,
} from "lucide-react";
import type {
  AssignedPatientDetailResponseDto,
  AssignedUserProfileUpdateRequestDto,
} from "@/app/api/midwife-patient/types";
import ProtectedImage from "../../../../../../../lib/ProtectedImage";
import PatientInfoForm from "./PatientInfoForm";
import { formatDate } from "./lib/utils";
import MessagesPopup from "@/app/(connection)/messages/MessagesPopup";

type PatientSummaryCardProps = {
  patient: AssignedPatientDetailResponseDto | null;
  patientStage: string;
  token: string;
  form: AssignedUserProfileUpdateRequestDto;
  setForm: React.Dispatch<
    React.SetStateAction<AssignedUserProfileUpdateRequestDto>
  >;
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  unreadCount?: number;
  onMessagesClosed?: () => void;
};

function getInitials(patient: AssignedPatientDetailResponseDto | null) {
  const first = patient?.firstName?.[0] ?? "";
  const last = patient?.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-xs text-zinc-200">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-zinc-400">
        {icon}
      </span>
      <span className="leading-5">
        <span className="text-zinc-400">{label}:</span>{" "}
        <span className="text-zinc-400">{value}</span>
      </span>
    </div>
  );
}

export default function PatientSummaryCard({
  patient,
  patientStage,
  token,
  form,
  setForm,
  onSave,
  saving = false,
  unreadCount = 0,
  onMessagesClosed,
}: PatientSummaryCardProps) {
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const hasCoordinates =
    typeof patient?.latitude === "number" &&
    typeof patient?.longitude === "number";

  const mapQuery = useMemo(() => {
    if (hasCoordinates) {
      return `${patient?.latitude},${patient?.longitude}`;
    }

    return [patient?.address, patient?.mohArea, patient?.district]
      .filter(Boolean)
      .join(", ");
  }, [
    hasCoordinates,
    patient?.latitude,
    patient?.longitude,
    patient?.address,
    patient?.mohArea,
    patient?.district,
  ]);

  const googleMapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapQuery
      )}`
    : null;

  const googleMapsEmbedUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&z=15&output=embed`
    : null;

  async function handleSaveClick() {
    if (onSave) await onSave();
    setOpen(false);
  }

  function handleOpenMessages() {
    if (!patient?.id) return;
    setMessagesOpen(true);
  }

  const initialsFallback = (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white sm:h-28 sm:w-28">
      {getInitials(patient)}
    </div>
  );

  const loadingFallback = (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-sm text-zinc-400 sm:h-28 sm:w-28">
      ...
    </div>
  );

  return (
    <>
      <section>
        <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_25%)]" />

          <div className="relative p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-3">
              <div className="shrink-0">
                <ProtectedImage
                  src={patient?.profileImageUrl}
                  token={token}
                  alt={
                    `${patient?.firstName ?? ""} ${
                      patient?.lastName ?? ""
                    }`.trim() || "Patient"
                  }
                  className="h-24 w-24 rounded-2xl bg-white/10 object-cover shadow-md sm:h-28 sm:w-28"
                  fallback={initialsFallback}
                  loadingFallback={loadingFallback}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-md font-bold tracking-tight text-white sm:text-md">
                      {patient?.firstName || "Unknown"}{" "}
                      {patient?.lastName || "Patient"}
                    </h2>

                    <p className="mt-0.5 mb-2 text-xs font-medium text-zinc-400">
                      {patientStage || "No role"}
                    </p>

                    <DetailRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={patient?.email || "-"}
                    />
                    <DetailRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={patient?.phoneNumber || "-"}
                    />
                    <DetailRow
                      icon={<CreditCard className="h-4 w-4" />}
                      label="National ID"
                      value={patient?.nationalIdNumber || "-"}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleOpenMessages}
                      disabled={!patient?.id}
                      className="relative inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Open messages"
                      title="Open messages"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>

                      {unreadCount > 0 ? (
                        <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      aria-label="Edit patient information"
                      title="Edit patient information"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="DOB"
                  value={formatDate(patient?.dateOfBirth)}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={patient?.address || "-"}
                />

                <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  <DetailRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="District"
                    value={patient?.district || "-"}
                  />
                  <DetailRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="MOH Area"
                    value={patient?.mohArea || "-"}
                  />
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    disabled={!googleMapsUrl}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Map className="h-3 w-3" />
                    View Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {mapOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Patient Location
                </h3>
                <p className="text-sm text-zinc-400">
                  View the patient location in Google Maps
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
                aria-label="Close map popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              {googleMapsEmbedUrl ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <iframe
                    title="Patient Location Map"
                    src={googleMapsEmbedUrl}
                    className="h-[380px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-zinc-400">
                  Location is not available for this patient.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                Close
              </button>

              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Edit Patient Information
                </h3>
                <p className="text-sm text-zinc-400">
                  Update the assigned patient details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
                aria-label="Close edit modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <PatientInfoForm
                form={form}
                email={patient?.email || ""}
                setForm={setForm}
              />
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-white/10 bg-black px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MessagesPopup
        open={messagesOpen}
        onClose={() => {
          setMessagesOpen(false);
          onMessagesClosed?.();
        }}
        targetUserId={patient?.id ?? null}
        theme="dark"
      />
    </>
  );
}