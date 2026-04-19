"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import { assignmentApi } from "@/app/api/user-assign/api";
import type { UserResponseDto } from "@/app/api/user-assign/types";

type Props = {
  token: string;
  userId: number;
  onOpen?: () => void;
  onViewAll?: () => void;
};

function formatRecentTime(dateOfBirth?: string) {
  if (!dateOfBirth) return "No date";
  return dateOfBirth;
}

function getPatientStatus(user: UserResponseDto) {
  if (user.roles.includes("PREGNANT_MOTHER")) return "Pregnancy Active";
  if (user.roles.includes("POST_PREGNANT_MOTHER")) return "Post Pregnancy Follow-up";
  if (user.roles.includes("HOPE_TO_PREGNANT_MOTHER")) return "Pre-Pregnancy Care";
  return "Under Care";
}

function getAreaLabel(user: UserResponseDto) {
  if (user.mohArea && user.district) return `${user.mohArea}, ${user.district}`;
  if (user.mohArea) return user.mohArea;
  if (user.area) return user.area;
  if (user.district) return user.district;
  return "Area not set";
}

export default function PatientsConsoleCard({
  token,
  userId,
  onOpen,
  onViewAll,
}: Props) {
  const [patients, setPatients] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function loadPatients() {
      try {
        setLoading(true);
        setError("");

        const data = await assignmentApi.getAssignedUsersForMidwife(userId, token);

        if (!active) return;
        setPatients(data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load patients");
        setPatients([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPatients();

    return () => {
      active = false;
    };
  }, [token, userId]);

  const totalPatients = patients.length;

  const liveCount = useMemo(() => {
    return patients.filter((user) => user.roles.includes("PREGNANT_MOTHER")).length;
  }, [patients]);

  const postPregnancyCount = useMemo(() => {
    return patients.filter((user) => user.roles.includes("POST_PREGNANT_MOTHER")).length;
  }, [patients]);

  const hopeCount = useMemo(() => {
    return patients.filter((user) =>
      user.roles.includes("HOPE_TO_PREGNANT_MOTHER")
    ).length;
  }, [patients]);

  const recentPatients = useMemo(() => {
    return [...patients].slice(0, 3);
  }, [patients]);

  const liveWidth = totalPatients ? (liveCount / totalPatients) * 100 : 0;
  const postWidth = totalPatients ? (postPregnancyCount / totalPatients) * 100 : 0;
  const hopeWidth = totalPatients ? (hopeCount / totalPatients) * 100 : 0;

  return (
    <section
      className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0b0f] shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:rounded-[24px]"
      style={{
        backgroundImage: "url('/images/midwife/midwife_card.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "contain",
      }}
    >
      <div className="absolute inset-0 bg-[#0b0b0f]/72" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/88 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f]/45 via-transparent to-transparent" />

      <div className="relative z-10 p-4 sm:p-5">
        <div className="max-w-[920px]">
          <div className="mt-2 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] text-white/45 sm:text-[12px]">
                    Patient Management
                  </p>

                  <h2 className="mt-1 text-[16px] font-semibold tracking-tight text-white/80 sm:text-[18px]">
                    Patients Console
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 text-[12px] text-white/80 transition hover:bg-white/[0.08]"
                >
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="mt-2 max-w-xl text-[11px] leading-6 text-white/50 sm:text-[12px]">
                Monitor assigned mothers, care progress, and recent updates from one focused view.
              </p>

              <div className="mt-4 flex items-end gap-3">
                <h3 className="text-[22px] font-semibold leading-none tracking-tight text-white/80 sm:text-[30px]">
                  {loading ? "--" : totalPatients}
                </h3>

                <div>
                  <p className="text-[11px] text-emerald-400">
                    {loading ? "Loading..." : `${liveCount} active`}
                  </p>
                  <p className="text-[10px] text-white/40">
                    Assigned mothers
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                <div className="flex h-full w-full">
                  <div
                    className="h-full rounded-full bg-white/80"
                    style={{ width: `${liveWidth}%` }}
                  />
                  <div
                    className="h-full bg-white/55"
                    style={{ width: `${postWidth}%` }}
                  />
                  <div
                    className="h-full bg-white/20"
                    style={{ width: `${hopeWidth}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                  <CircleDot className="h-3.5 w-3.5 text-emerald-400" />
                  {loading ? "..." : `${liveCount} pregnant`}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                  <Clock3 className="h-3.5 w-3.5" />
                  {loading ? "..." : `${hopeCount} planning`}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {loading ? "..." : `${postPregnancyCount} post-pregnancy`}
                </span>
              </div>

              {error ? (
                <p className="mt-4 text-xs text-red-300">{error}</p>
              ) : null}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-medium text-white/82">
                  Recent assigned mothers
                </p>

                <button
                  type="button"
                  onClick={onViewAll}
                  className="inline-flex items-center gap-1 text-[11px] text-white/45 transition hover:text-white/75"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {loading ? (
                <div className="grid gap-2.5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex w-full items-center gap-3 rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5"
                    >
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-white/10" />
                        <div className="h-3 w-48 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentPatients.length === 0 ? (
                <div className="rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-6 text-center text-sm text-white/50">
                  No assigned mothers found.
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {recentPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      {patient.profileImageUrl ? (
                        <img
                          src={patient.profileImageUrl}
                          alt={`${patient.firstName} ${patient.lastName}`}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                          {`${patient.firstName?.[0] ?? ""}${patient.lastName?.[0] ?? ""}`.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[12px] font-medium text-white/80">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="shrink-0 text-[10px] text-white/40">
                            {formatRecentTime(patient.dateOfBirth)}
                          </p>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
                          <span className="truncate">{getPatientStatus(patient)}</span>
                          <span className="h-1 w-1 rounded-full bg-white/25" />
                          <span>{getAreaLabel(patient)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}