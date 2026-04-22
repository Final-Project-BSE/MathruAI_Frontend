"use client";

import { midwifePatientApi } from "@/app/api/midwife-patient/api";
import type {
  AssignedPatientDetailResponseDto,
  FertilityResponseDto,
  HealthCategoryResponseDto,
  HealthRecordResponseDto,
} from "@/app/api/midwife-patient/types";
import type { HealthMonitoringResponseDto } from "@/app/api/healthmonitor/types";
import type { UserResponseDto } from "@/app/api/user-assign/types";

const PATIENT_LIST_CACHE_KEY = "midwife:patient-console:list";
const HEALTH_MONITORING_TTL_MS = 1000 * 60 * 5; // 5 minutes
const PATIENT_BUNDLE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function patientBundleKey(patientId: number) {
  return `midwife:patient-console:bundle:${patientId}`;
}

function healthMonitoringBundleKey(patientId: number) {
  return `midwife:patient-console:health-monitoring:${patientId}`;
}

type PatientBundle = {
  patient: AssignedPatientDetailResponseDto;
  categories: HealthCategoryResponseDto[];
  fertility: FertilityResponseDto | null;
  selectedCategoryId: string;
  recordsByCategory: Record<string, HealthRecordResponseDto[]>;
  cachedAt: number;
};

export type HealthMonitoringBundle = {
  monitoring: HealthMonitoringResponseDto | null;
  cachedAt: number;
};

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function isCacheFresh(cachedAt?: number, ttl = HEALTH_MONITORING_TTL_MS) {
  if (!cachedAt) return false;
  return Date.now() - cachedAt <= ttl;
}

export function getCachedPatientList() {
  return safeRead<UserResponseDto[]>(PATIENT_LIST_CACHE_KEY) ?? [];
}

export function setCachedPatientList(patients: UserResponseDto[]) {
  safeWrite(PATIENT_LIST_CACHE_KEY, patients);
}

export function clearCachedPatientList() {
  safeRemove(PATIENT_LIST_CACHE_KEY);
}

export function getCachedPatientBundle(patientId: number) {
  return safeRead<PatientBundle>(patientBundleKey(patientId));
}

export function getFreshCachedPatientBundle(
  patientId: number,
  ttl = PATIENT_BUNDLE_TTL_MS
) {
  const cached = getCachedPatientBundle(patientId);
  if (!cached) return null;
  return isCacheFresh(cached.cachedAt, ttl) ? cached : null;
}

export function setCachedPatientBundle(patientId: number, bundle: PatientBundle) {
  safeWrite(patientBundleKey(patientId), bundle);
}

export function clearCachedPatientBundle(patientId: number) {
  safeRemove(patientBundleKey(patientId));
}

export function setCachedCategoryRecords(
  patientId: number,
  categoryId: string,
  records: HealthRecordResponseDto[]
) {
  const existing = getCachedPatientBundle(patientId);
  if (!existing) return;

  const next: PatientBundle = {
    ...existing,
    selectedCategoryId: categoryId,
    recordsByCategory: {
      ...existing.recordsByCategory,
      [categoryId]: records,
    },
    cachedAt: Date.now(),
  };

  setCachedPatientBundle(patientId, next);
}

export function getCachedCategoryRecords(patientId: number, categoryId: string) {
  const bundle = getCachedPatientBundle(patientId);
  return bundle?.recordsByCategory?.[categoryId] ?? [];
}

export async function prefetchPatientBundle(params: {
  token: string;
  midwifeId: number;
  patientId: number;
  force?: boolean;
}) {
  const { token, midwifeId, patientId, force = false } = params;

  if (!force) {
    const cached = getFreshCachedPatientBundle(patientId);
    if (cached) return cached;
  }

  const [patient, categories] = await Promise.all([
    midwifePatientApi.getAssignedPatientDetail(token, midwifeId, patientId),
    midwifePatientApi.getPatientHealthCategories(token, midwifeId, patientId),
  ]);

  let fertility: FertilityResponseDto | null = null;
  try {
    fertility = await midwifePatientApi.getPatientFertilityLatest(
      token,
      midwifeId,
      patientId
    );
  } catch {
    fertility = null;
  }

  const firstCategory =
    categories.find((item) => item.recordCount > 0) || categories[0];
  const selectedCategoryId = firstCategory?.id || "";

  let initialRecords: HealthRecordResponseDto[] = [];
  if (selectedCategoryId) {
    try {
      initialRecords =
        await midwifePatientApi.getPatientHealthRecordsByCategory(
          token,
          midwifeId,
          patientId,
          selectedCategoryId
        );
    } catch {
      initialRecords = [];
    }
  }

  const bundle: PatientBundle = {
    patient,
    categories,
    fertility,
    selectedCategoryId,
    recordsByCategory: selectedCategoryId
      ? { [selectedCategoryId]: initialRecords }
      : {},
    cachedAt: Date.now(),
  };

  setCachedPatientBundle(patientId, bundle);
  return bundle;
}

/**
 * HEALTH MONITORING CACHE
 */

export function getCachedHealthMonitoringBundle(patientId: number) {
  return safeRead<HealthMonitoringBundle>(healthMonitoringBundleKey(patientId));
}

export function getFreshCachedHealthMonitoringBundle(
  patientId: number,
  ttl = HEALTH_MONITORING_TTL_MS
) {
  const cached = getCachedHealthMonitoringBundle(patientId);
  if (!cached) return null;
  return isCacheFresh(cached.cachedAt, ttl) ? cached : null;
}

export function setCachedHealthMonitoringBundle(
  patientId: number,
  bundle: Omit<HealthMonitoringBundle, "cachedAt">
) {
  const next: HealthMonitoringBundle = {
    ...bundle,
    cachedAt: Date.now(),
  };

  safeWrite(healthMonitoringBundleKey(patientId), next);
  return next;
}

export function clearCachedHealthMonitoringBundle(patientId: number) {
  safeRemove(healthMonitoringBundleKey(patientId));
}