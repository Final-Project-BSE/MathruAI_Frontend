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
import type {
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
} from "@/app/api/healthmonitor/types";

import HealthRecordsSection from "./components/HealthRecordsSection";
import PatientSummaryCard from "./components/PatientSummaryCard";
import FertilityCard from "./components/FertilityCard";
import StatusAlert from "./components/StatusAlert";
import DailyRecommendationCard from "./components/daily-recommendation/DailyRecommendationCard";
import { getRoleLabel } from "./components/lib/utils";
import {
  clearCachedHealthMonitoringBundle,
  clearCachedPatientBundle,
  getCachedHealthMonitoringBundle,
  getCachedPatientBundle,
  getCachedPatientList,
  getFreshCachedHealthMonitoringBundle,
  prefetchPatientBundle,
  setCachedCategoryRecords,
  setCachedPatientBundle,
  setCachedPatientList,
  setCachedHealthMonitoringBundle,
} from "./components/lib/patientConsoleCache";
import PatientSidebar from "../../components/PatientSidebar";
import { filterPatients } from "./components/lib/patientConsoleShared";
import HealthMonitoringCard from "./components/health-monitoring/HealthMonitoringCard";
import { healthMonitoringApis } from "../../../../../api/healthmonitor/api";
import { chatApi } from "@/app/api/chat/api";
import PatientVaccinationCard from "./components/vaccination/PatientVaccinationCard";
import RecoveryTrackingCard from "./components/recovery-tracking/RecoveryTrackingCard";

import { triposhaApi } from "@/app/api/triposha/api";
import type { TriposhaRecord } from "@/app/api/triposha/types";
import TriposhaCard from "./components/TriposhaCard";
import TriposhaForm from "./components/TriposhaForm";

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

  const [latestMonitoring, setLatestMonitoring] =
    useState<HealthMonitoringResponseDto | null>(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringSaving, setMonitoringSaving] = useState(false);
  const [monitoringDeleting, setMonitoringDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [unreadByPatientId, setUnreadByPatientId] = useState<Record<number, number>>({});

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

  const [triposha, setTriposha] = useState<TriposhaRecord[]>([]);
  const [triposhaLoading, setTriposhaLoading] = useState(false);

  useEffect(() => {
    if (!error && !success) return;

    const timer = window.setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    if (token && patientId) {
      loadTriposha();
    }
  }, [token, patientId]);

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

  function hydrateMonitoringFromCache(currentPatientId: number) {
    const cached = getCachedHealthMonitoringBundle(currentPatientId);
    if (!cached) return false;

    setLatestMonitoring(cached.monitoring);
    return true;
  }

  function persistMonitoringCache(
    currentPatientId: number,
    monitoring: HealthMonitoringResponseDto | null
  ) {
    setCachedHealthMonitoringBundle(currentPatientId, {
      monitoring,
    });
  }

  async function loadMonitoringData(
    jwt: string,
    currentMidwifeId: number,
    currentPatientId: number,
    options?: { preferCache?: boolean }
  ) {
    const preferCache = options?.preferCache ?? true;

    try {
      if (preferCache) {
        const freshCached =
          getFreshCachedHealthMonitoringBundle(currentPatientId);
        if (freshCached) {
          setLatestMonitoring(freshCached.monitoring);
          return;
        }
      }

      setMonitoringLoading(true);

      const latest = await healthMonitoringApis.getLatest(
        jwt,
        currentMidwifeId,
        currentPatientId
      );

      setLatestMonitoring(latest);
      persistMonitoringCache(currentPatientId, latest);
    } catch (err) {
      setLatestMonitoring(null);
      throw err;
    } finally {
      setMonitoringLoading(false);
    }
  }

  async function loadTriposha() {
    if (!token || !patientId) return;

    try {
      setTriposhaLoading(true);
      const data = await triposhaApi.getByPatient(token, patientId);
      setTriposha(data);
    } catch (err) {
      console.error("Failed to load Triposha:", err);
      setTriposha([]);
    } finally {
      setTriposhaLoading(false);
    }
  }
  async function reloadMonitoringDataFromServer() {
    if (!token || !midwifeId || !patientId) return;

    clearCachedHealthMonitoringBundle(patientId);

    await loadMonitoringData(token, midwifeId, patientId, {
      preferCache: false,
    });
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

    hydrateMonitoringFromCache(patientId);
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
        void loadUnreadCounts(jwt, currentUser.id);

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

        await loadMonitoringData(jwt, currentUser.id, patientId, {
          preferCache: true,
        });
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load patient details."
        );
        setLoading(false);
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [patientId]);

  useEffect(() => {
    let active = true;

    async function loadRecordsForCategory() {
      if (!token || !midwifeId || !patientId || !selectedCategoryId) return;

      try {
        setRecordsLoading(true);

        const cachedRecords =
          getCachedPatientBundle(patientId)?.recordsByCategory?.[
          selectedCategoryId
          ];

        if (cachedRecords) {
          setRecords(cachedRecords);
        }

        const nextRecords =
          await midwifePatientApi.getPatientHealthRecordsByCategory(
            token,
            midwifeId,
            patientId,
            selectedCategoryId
          );

        if (!active) return;
        setRecords(nextRecords);
        setCachedCategoryRecords(patientId, selectedCategoryId, nextRecords);
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

  const isPregnancyUser = useMemo(() => {
    return Boolean(patient?.roles?.includes("PREGNANT_MOTHER"));
  }, [patient]);

  const isPostpartumUser = useMemo(() => {
    return Boolean(patient?.roles?.includes("POST_PREGNANT_MOTHER"));
  }, [patient]);

  const isHopeToPregnantUser = useMemo(() => {
    return Boolean(patient?.roles?.includes("HOPE_TO_PREGNANT_MOTHER"));
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

  async function handleProfileSave() {
    if (!token || !midwifeId || !patient) return;

    try {
      setProfileSaving(true);
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
      setError(
        err instanceof Error ? err.message : "Failed to save patient profile"
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleAddTriposha(data: {
    quantity: number;
    status: "GIVEN" | "PENDING" | "MISSED";
    notes?: string;
  }) {
    if (!token || !midwifeId || !patientId) return;

    try {
      setError("");
      setSuccess("");

      await triposhaApi.create(token, {
        patientId,
        midwifeId,
        quantity: data.quantity,
        status: data.status,
        notes: data.notes,
        distributionDate: new Date().toISOString(),
        nextDueDate: new Date().toISOString(),
      });

      setSuccess("Triposha record added successfully.");
      await loadTriposha();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add Triposha"
      );
    }
  }


  async function handleDeleteTriposha(id: number) {
    if (!token) return;

    try {
      setError("");
      setSuccess("");

      console.log("Deleting ID:", id);

      await triposhaApi.delete(token, id);

      // ✅ REMOVE FROM UI IMMEDIATELY
      setTriposha(prev => prev.filter(item => item.id !== id));

      setSuccess("Triposha record deleted.");
    } catch (err) {
      console.error(err);

      if (err instanceof Error && err.message.includes("not found")) {
        setTriposha(prev => prev.filter(item => item.id !== id));
        setError("Record already deleted.");
        return;
      }

      setError(
        err instanceof Error ? err.message : "Delete failed"
      );
    }
  }

  async function handleUpdateTriposha(
    id: number,
    data: {
      quantity: number;
      status: "GIVEN" | "PENDING" | "MISSED";
      notes?: string;
    }
  ) {
    if (!token || !midwifeId || !patientId) return;

    try {
      setError("");
      setSuccess("");

      await triposhaApi.update(token, id, {
        patientId,
        midwifeId,
        quantity: data.quantity,
        status: data.status,
        notes: data.notes,
        distributionDate: new Date().toISOString(),
        nextDueDate: new Date().toISOString(),
      });

      setSuccess("Triposha record updated successfully.");
      await loadTriposha();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update Triposha"
      );
    }
  }
  async function handleMonitoringSave(
    payload: HealthMonitoringUpsertRequestDto
  ) {
    if (!token || !midwifeId || !patientId) {
      throw new Error("Missing authentication or patient context.");
    }

    try {
      setMonitoringSaving(true);
      setError("");
      setSuccess("");

      if (latestMonitoring?.id) {
        await healthMonitoringApis.update(
          token,
          midwifeId,
          patientId,
          latestMonitoring.id,
          payload
        );
        setSuccess("Health monitoring record updated successfully.");
      } else {
        await healthMonitoringApis.create(token, midwifeId, patientId, payload);
        setSuccess("Health monitoring record created successfully.");
      }

      clearCachedHealthMonitoringBundle(patientId);
      clearCachedPatientBundle(patientId);

      await reloadMonitoringDataFromServer();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save health monitoring record";
      setError(message);
      throw err;
    } finally {
      setMonitoringSaving(false);
    }
  }

  async function handleMonitoringDelete(record: HealthMonitoringResponseDto) {
    if (!token || !midwifeId || !patientId) {
      throw new Error("Missing authentication or patient context.");
    }

    const previousLatest = latestMonitoring;

    try {
      setMonitoringDeleting(true);
      setError("");
      setSuccess("");

      setLatestMonitoring(null);
      persistMonitoringCache(patientId, null);

      await healthMonitoringApis.delete(token, midwifeId, patientId, record.id);

      clearCachedPatientBundle(patientId);
      await reloadMonitoringDataFromServer();

      setSuccess("Health monitoring record deleted successfully.");
    } catch (err) {
      setLatestMonitoring(previousLatest);
      persistMonitoringCache(patientId, previousLatest);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete health monitoring record";
      setError(message);
      throw err;
    } finally {
      setMonitoringDeleting(false);
    }
  }

  function handleFertilityUpdated(data: FertilityResponseDto) {
    setFertility(data);

    const cached = getCachedPatientBundle(patientId);

    if (cached) {
      setCachedPatientBundle(patientId, {
        ...cached,
        fertility: data,
        cachedAt: Date.now(),
      });
    }

    setSuccess("Fertility data recalculated successfully.");
  }

  async function handleRefresh() {
    if (!token || !midwifeId || !patientId) return;

    try {
      setError("");
      setSuccess("");

      clearCachedPatientBundle(patientId);
      clearCachedHealthMonitoringBundle(patientId);

      const freshBundle = await prefetchPatientBundle({
        token,
        midwifeId,
        patientId,
        force: true,
      });

      hydrateFromBundle(freshBundle);

      await loadMonitoringData(token, midwifeId, patientId, {
        preferCache: false,
      });

      setSuccess("Patient data refreshed.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh patient data."
      );
    }
  }


  async function loadUnreadCounts(jwt: string, currentUserId: number) {
    const conversations = await chatApi.getMyConversations(currentUserId, jwt);
    const next: Record<number, number> = {};

    conversations.forEach((conversation) => {
      next[conversation.otherUser.id] = conversation.unreadCount || 0;
    });

    setUnreadByPatientId(next);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-black text-white">
      <div className="mx-auto grid h-full overflow-hidden md:grid-cols-[260px_minmax(0,1fr)]">
        <PatientSidebar
          patients={filteredPatients}
          loading={false}
          error=""
          token={token}
          search={search}
          onSearchChange={setSearch}
          onPatientClick={openPatient}
          onPatientPrefetch={prefetchPatient}
        />

        <main className="min-h-0 overflow-y-auto bg-black p-6">
          <div className="space-y-6">
            {error && <StatusAlert type="error" message={error} />}
            {success && <StatusAlert type="success" message={success} />}

            <div className="grid gap-6 xl:grid-cols-2">
              <PatientSummaryCard
                patient={patient}
                patientStage={patientStage}
                token={token}
                form={form}
                setForm={setForm}
                onSave={handleProfileSave}
                saving={profileSaving}
                unreadCount={patient ? unreadByPatientId[patient.id] || 0 : 0}
                onMessagesClosed={() => {
                  if (token && midwifeId) {
                    void loadUnreadCounts(token, midwifeId);
                  }
                }}
              />

              <HealthMonitoringCard
                patientId={patientId}
                monitoring={latestMonitoring}
                loading={monitoringLoading}
                saving={monitoringSaving}
                deleting={monitoringDeleting}
                onSave={handleMonitoringSave}
                onDelete={handleMonitoringDelete}
              />
            </div>

            {midwifeId && patient ? (
              <PatientVaccinationCard
                token={token}
                midwifeId={midwifeId}
                patientId={patientId}
              />
            ) : null}

            {isPregnancyUser ? (
              <DailyRecommendationCard
                token={token}
                userId={patientId}
                enabled={isPregnancyUser}
              />
            ) : null}

            {isPostpartumUser ? (
              <RecoveryTrackingCard token={token} patientId={patientId} />
            ) : null}

            {midwifeId && isHopeToPregnantUser ? (
              <FertilityCard
                fertility={fertility}
                token={token}
                midwifeId={midwifeId}
                patientId={patientId}
                onFertilityUpdated={handleFertilityUpdated}
              />
            ) : null}

            <TriposhaCard
              records={triposha}
              onDelete={handleDeleteTriposha}
              onAdd={handleAddTriposha}
              onUpdate={handleUpdateTriposha}
            />


            <HealthRecordsSection
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              recordsLoading={recordsLoading}
              records={records}
              token={token}
              midwifeId={midwifeId}
              patientId={patientId}
              onRecordsChanged={async () => {
                if (!token || !midwifeId || !patientId || !selectedCategoryId) return;

                clearCachedPatientBundle(patientId);

                const [freshCategories, freshRecords] = await Promise.all([
                  midwifePatientApi.getPatientHealthCategories(token, midwifeId, patientId),
                  midwifePatientApi.getPatientHealthRecordsByCategory(
                    token,
                    midwifeId,
                    patientId,
                    selectedCategoryId
                  ),
                ]);

                setCategories(freshCategories);
                setRecords(freshRecords);
                setCachedCategoryRecords(patientId, selectedCategoryId, freshRecords);

                const cached = getCachedPatientBundle(patientId);
                if (cached) {
                  setCachedPatientBundle(patientId, {
                    ...cached,
                    categories: freshCategories,
                    recordsByCategory: {
                      ...cached.recordsByCategory,
                      [selectedCategoryId]: freshRecords,
                    },
                    cachedAt: Date.now(),
                  });
                }
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}