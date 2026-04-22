"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { assignmentApi } from "@/app/api/user-assign/api";
import type { UserResponseDto } from "@/app/api/user-assign/types";
import PatientSidebar from "./components/PatientSidebar";
import { filterPatients } from "./patients/[id]/components/lib/patientConsoleShared";
import {
  prefetchPatientBundle,
  setCachedPatientList,
} from "./patients/[id]/components/lib/patientConsoleCache";

export default function MainConsolePage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [midwifeId, setMidwifeId] = useState<number | null>(null);
  const [patients, setPatients] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPatients() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!jwt) {
          throw new Error("You are not authenticated. Please sign in again.");
        }

        if (!active) return;
        setToken(jwt);

        const currentUser = await getcuruser(jwt);
        if (!active) return;
        setMidwifeId(currentUser.id);

        const assignedUsers = await assignmentApi.getAssignedUsersForMidwife(
          currentUser.id,
          jwt
        );
        if (!active) return;

        setPatients(assignedUsers);
        setCachedPatientList(assignedUsers);
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
  }, []);

  useEffect(() => {
    if (!token || !midwifeId || patients.length === 0) return;

    const warmup = () => {
      patients.slice(0, 6).forEach((patient) => {
        router.prefetch(`/midwife/patient-console/patients/${patient.id}`);
        void prefetchPatientBundle({
          token,
          midwifeId,
          patientId: patient.id,
        });
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warmup);
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(warmup, 300);
    return () => window.clearTimeout(timeout);
  }, [patients, token, midwifeId, router]);

  const filteredPatients = useMemo(() => {
    return filterPatients(patients, search);
  }, [patients, search]);

  function openPatient(patient: UserResponseDto) {
    router.push(`/midwife/patient-console/patients/${patient.id}`);
  }

  function prefetchPatient(patient: UserResponseDto) {
    router.prefetch(`/midwife/patient-console/patients/${patient.id}`);

    if (!token || !midwifeId) return;

    void prefetchPatientBundle({
      token,
      midwifeId,
      patientId: patient.id,
    });
  }

  return (
    <div className="h-full overflow-hidden bg-black text-white">
      <div className="mx-auto grid h-full overflow-hidden shadow-2xl md:grid-cols-[260px_minmax(0,1fr)]">
        <PatientSidebar
          patients={filteredPatients}
          loading={loading}
          error={error}
          token={token}
          search={search}
          onSearchChange={setSearch}
          onPatientClick={openPatient}
          onPatientPrefetch={prefetchPatient}
        />

        <main className="flex h-full min-h-0 items-center justify-center overflow-y-auto bg-black p-6">
          <div className="max-w-xl text-center">
            <div className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Select a patient
            </div>
            <p className="text-sm leading-6 text-zinc-500">
              Patient details are prefetched in the background so opening a
              profile feels instant.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}