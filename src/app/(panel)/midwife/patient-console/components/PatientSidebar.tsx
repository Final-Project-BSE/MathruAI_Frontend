"use client";

import { Search } from "lucide-react";
import type { UserResponseDto } from "@/app/api/user-assign/types";
import ProtectedImage from "@/lib/ProtectedImage";
import {
  getPatientEmailLabel,
  getPatientAvatarText,
} from "../patients/[id]/components/lib/patientConsoleShared";

type PatientSidebarProps = {
  patients: UserResponseDto[];
  loading: boolean;
  error?: string;
  token: string;
  search: string;
  onSearchChange: (value: string) => void;
  onPatientClick: (patient: UserResponseDto) => void;
  onPatientPrefetch?: (patient: UserResponseDto) => void;
  activePatientId?: number | null;
};

export default function PatientSidebar({
  patients,
  loading,
  error = "",
  token,
  search,
  onSearchChange,
  onPatientClick,
  onPatientPrefetch,
  activePatientId,
}: PatientSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-white/10 text-white">
      <div className="shrink-0 border-b border-white/10 pt-2 pb-2 pr-4 pl-4">
        <div className="mb-2">
          <div className="text-sm font-semibold">Patient Lists</div>
          <div className="text-xs text-zinc-500">
            {loading ? "Loading..." : `${patients.length} patients`}
          </div>
        </div>

        <div className="flex h-7 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search patients"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {error ? (
          <div className="rounded xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[74px] animate-pulse rounded-2xl bg-white/5"
              />
            ))
          : patients.map((patient) => {
              const active = patient.id === activePatientId;

              const initialsFallback = (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-sm font-semibold text-zinc-200">
                  {getPatientAvatarText(patient)}
                </div>
              );

              const loadingFallback = (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-[10px] text-zinc-500">
                  ...
                </div>
              );

              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => onPatientClick(patient)}
                  onMouseEnter={() => onPatientPrefetch?.(patient)}
                  onFocus={() => onPatientPrefetch?.(patient)}
                  className={`flex w-full items-center gap-3 rounded-sm border p-2 text-left transition ${
                    active
                      ? "border-[#ffffff] bg-white/80"
                      : "border-transparent bg-zinc-900/70 hover:border-[#d04f51] hover:bg-zinc-900"
                  }`}
                >
                  <ProtectedImage
                    src={patient.profileImageUrl}
                    token={token}
                    alt={
                      `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim() ||
                      "Patient"
                    }
                    className={`h-9 w-9 rounded-full object-cover ${
                    active
                      ? "border border-black/20"
                      : "border border-white/10"
                  
                    }`}
                    fallback={initialsFallback}
                    loadingFallback={loadingFallback}
                  />

                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-xs font-semibold ${
                    active
                      ? "text-black"
                      : "text-white"
                  
                    }`}>
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className={`truncate text-xs ${
                    active
                      ? "text-black/80"
                      : "text-white/50"
                  
                    }`}>
                      {getPatientEmailLabel(patient)}
                    </div>
                  </div>

                  <div className="text-zinc-500">›</div>
                </button>
              );
            })}

        {!loading && patients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900 p-6 text-center text-sm text-zinc-500">
            No patients found.
          </div>
        ) : null}
      </div>
    </aside>
  );
}