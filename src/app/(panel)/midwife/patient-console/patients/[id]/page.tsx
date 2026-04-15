"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { assignmentApi } from "@/app/api/user-assign/api";
import { midwifePatientApi } from "@/app/api/midwife-patient/api";
import type { UserResponseDto } from "@/app/api/user-assign/types";
import type {
  AssignedPatientDetailResponseDto,
  AssignedUserProfileUpdateRequestDto,
  FertilityResponseDto,
  HealthCategoryResponseDto,
  HealthRecordResponseDto,
} from "@/app/api/midwife-patient/types";

import PatientHeader from "./components/PatientHeader";
import HealthRecordsSection from "./components/HealthRecordsSection";
import PatientSummaryCard from "./components/PatientSummaryCard";
import FertilityCard from "./components/FertilityCard";
import StatusAlert from "./components/StatusAlert";
import { getRoleLabel } from "./components/lib/utils";
import {
  getCachedPatientBundle,
  getCachedPatientList,
  prefetchPatientBundle,
  setCachedCategoryRecords,
  setCachedPatientBundle,
  setCachedPatientList,
} from "./components/lib/patientConsoleCache";
import PatientSidebar from "../../components/PatientSidebar";
import { filterPatients } from "./components/lib/patientConsoleShared";

export default function AssignedPatientManagePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params?.id);

  const [token, setToken] = useState("");
  const [midwifeId, setMidwifeId] = useState<number | null>(null);

  const [patients, setPatients] = useState<UserResponseDto[]>([]);
  const [search, setSearch] = useState("");

  const [patient, setPatient] = useState<AssignedPatientDetailResponseDto | null>(
    null
  );
  const [categories, setCategories] = useState<HealthCategoryResponseDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [records, setRecords] = useState<HealthRecordResponseDto[]>([]);
  const [fertility, setFertility] = useState<FertilityResponseDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<AssignedUserProfileUpdateRequestDto>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    address: "",
    profileImageUrl: "",
    area: "",
    district: "",
    mohArea: "",
    latitude: undefined,
    longitude: undefined,
  });

  function hydrateFromBundle(bundle: {
    patient: AssignedPatientDetailResponseDto;
    categories: HealthCategoryResponseDto[];
    fertility: FertilityResponseDto | null;
    selectedCategoryId: string;
    recordsByCategory: Record<string, HealthRecordResponseDto[]>;
  }) {
    setPatient(bundle.patient);
    setCategories(bundle.categories);
    setFertility(bundle.fertility);

    const nextCategoryId =
      bundle.selectedCategoryId ||
      bundle.categories.find((item) => item.recordCount > 0)?.id ||
      bundle.categories[0]?.id ||
      "";

    setSelectedCategoryId(nextCategoryId);
    setRecords(bundle.recordsByCategory[nextCategoryId] || []);

    setForm({
      firstName: bundle.patient.firstName || "",
      lastName: bundle.patient.lastName || "",
      phoneNumber: bundle.patient.phoneNumber || "",
      dateOfBirth: bundle.patient.dateOfBirth || "",
      nationalIdNumber: bundle.patient.nationalIdNumber || "",
      address: bundle.patient.address || "",
      profileImageUrl: bundle.patient.profileImageUrl || "",
      area: bundle.patient.area || "",
      district: bundle.patient.district || "",
      mohArea: bundle.patient.mohArea || "",
      latitude: bundle.patient.latitude,
      longitude: bundle.patient.longitude,
    });

    setLoading(false);
  }

  useEffect(() => {
    if (Number.isNaN(patientId)) {
      setError("Invalid patient id.");
      setLoading(false);
      return;
    }

    const cachedList = getCachedPatientList();
    if (cachedList.length) {
      setPatients(cachedList);
    }

    const cachedBundle = getCachedPatientBundle(patientId);
    if (cachedBundle) {
      hydrateFromBundle(cachedBundle);
    } else {
      setLoading(true);
    }
  }, [patientId]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        setError("");
        setSuccess("");

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

        const listPromise =
          patients.length > 0
            ? Promise.resolve(patients)
            : assignmentApi.getAssignedUsersForMidwife(currentUser.id, jwt);

        const [patientList, freshBundle] = await Promise.all([
          listPromise,
          prefetchPatientBundle({
            token: jwt,
            midwifeId: currentUser.id,
            patientId,
          }),
        ]);

        if (!active) return;

        setPatients(patientList);
        setCachedPatientList(patientList);
        hydrateFromBundle(freshBundle);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load patient details"
        );
        setLoading(false);
      }
    }

    if (!Number.isNaN(patientId)) {
      void bootstrap();
    }

    return () => {
      active = false;
    };
  }, [patientId]);

  useEffect(() => {
    let active = true;

    async function loadRecordsForCategory() {
      if (!token || !midwifeId || !patientId || !selectedCategoryId) return;

      const cachedBundle = getCachedPatientBundle(patientId);
      const cachedRecords =
        cachedBundle?.recordsByCategory?.[selectedCategoryId] || [];

      if (cachedRecords.length > 0) {
        setRecords(cachedRecords);
        setRecordsLoading(false);
        return;
      }

      try {
        setRecordsLoading(true);

        const data = await midwifePatientApi.getPatientHealthRecordsByCategory(
          token,
          midwifeId,
          patientId,
          selectedCategoryId
        );

        if (!active) return;

        setRecords(data);
        setCachedCategoryRecords(patientId, selectedCategoryId, data);
      } catch {
        if (!active) return;
        setRecords([]);
      } finally {
        if (active) setRecordsLoading(false);
      }
    }

    void loadRecordsForCategory();

    return () => {
      active = false;
    };
  }, [token, midwifeId, patientId, selectedCategoryId]);

  const filteredPatients = useMemo(() => {
    return filterPatients(patients, search);
  }, [patients, search]);

  const patientStage = useMemo(() => {
    return patient ? getRoleLabel(patient.roles) : "-";
  }, [patient]);

  function openPatient(entry: UserResponseDto) {
    if (entry.id === patientId) return;
    router.push(`/midwife/patient-console/patients/${entry.id}`);
  }

  function prefetchPatient(entry: UserResponseDto) {
    router.prefetch(`/midwife/patient-console/patients/${entry.id}`);

    if (!token || !midwifeId) return;

    void prefetchPatientBundle({
      token,
      midwifeId,
      patientId: entry.id,
    });
  }

  async function handleSave() {
    if (!token || !midwifeId || !patient) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await midwifePatientApi.updateAssignedPatientProfile(
        token,
        midwifeId,
        patient.id,
        form
      );

      setPatient(updated);
      setSuccess("Patient profile updated successfully.");

      const cached = getCachedPatientBundle(patient.id);
      if (cached) {
        setCachedPatientBundle(patient.id, {
          ...cached,
          patient: updated,
          cachedAt: Date.now(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save patient profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleRefresh() {
    if (!token || !midwifeId || !patientId) return;

    try {
      setError("");
      setSuccess("");

      const freshBundle = await prefetchPatientBundle({
        token,
        midwifeId,
        patientId,
      });

      hydrateFromBundle(freshBundle);
      setSuccess("Patient data refreshed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    }
  }

  return (
    <div className="h-full overflow-hidden bg-black text-white">
      <div className="mx-auto grid h-full overflow-hidden shadow-2xl md:grid-cols-[260px_minmax(0,1fr)]">
        <PatientSidebar
          patients={filteredPatients}
          loading={false}
          token={token}
          search={search}
          onSearchChange={setSearch}
          onPatientClick={openPatient}
          onPatientPrefetch={prefetchPatient}
          activePatientId={patientId}
        />

        <main className="min-w-0 h-full min-h-0 overflow-y-auto bg-black p-4 md:p-6">
          {loading ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading patient details...</span>
              </div>
            </div>
          ) : error && !patient ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                <div className="text-lg font-semibold text-red-300">
                  Failed to open patient
                </div>
                <div className="mt-2 text-sm text-red-400">{error}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <StatusAlert type="error" message={error} />
              <StatusAlert type="success" message={success} />

              <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-6">
                  <PatientSummaryCard
                    patient={patient}
                    patientStage={patientStage}
                    token={token}
                    form={form}
                    setForm={setForm}
                    onSave={handleSave}
                    saving={saving}
                  />

                  <HealthRecordsSection
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    recordsLoading={recordsLoading}
                    records={records}
                  />
                </div>

                <div className="space-y-6">
                  <FertilityCard fertility={fertility} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}