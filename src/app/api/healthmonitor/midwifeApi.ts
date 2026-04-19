import type {
  AlternativeAdviceItem,
  AssignedPatientDetailResponseDto,
  AssignedUserProfileUpdateRequestDto,
  FertilityResponseDto,
  HealthCategoryResponseDto,
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
  HealthRecordResponseDto,
} from "./types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

type ApiEnvelope<T> = {
  status?: "success" | "error";
  data?: T;
  error?: string;
  message?: string;
  count?: number;
};

type RawHealthMonitoringRecord = {
  id?: string | number;
  patientId?: number;
  updatedByMidwifeId?: number;

  age?: number;
  systolicBP?: number;
  diastolicBP?: number;
  bs?: number;
  bodyTemp?: number;
  bmi?: number;
  heartRate?: number;

  previousComplications?: number;
  preexistingDiabetes?: number;
  gestationalDiabetes?: number;
  mentalHealth?: number;

  riskLevel?: string;
  riskConfidence?: number;
  healthAdvice?: string;
  adviceConfidence?: number;

  riskProbabilities?: Record<string, number> | string;
  patientProfile?: Record<string, any> | string;
  alternativeAdvice?: AlternativeAdviceItem[] | string;

  createdAt?: string;
  updatedAt?: string;

  patient_id?: number;
  updated_by_midwife_id?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  blood_sugar?: number;
  body_temp?: number;
  heart_rate?: number;
  previous_complications?: number;
  preexisting_diabetes?: number;
  gestational_diabetes?: number;
  mental_health?: number;
  risk_level?: string;
  risk_confidence?: number;
  health_advice?: string;
  advice_confidence?: number;
  risk_probabilities?: Record<string, number> | string;
  patient_profile?: Record<string, any> | string;
  alternative_advice?: AlternativeAdviceItem[] | string;
  created_at?: string;
  updated_at?: string;
};

function parseMaybeJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function unwrapApiEnvelope<T>(payload: unknown): T {
  const candidate = payload as ApiEnvelope<T>;

  if (
    candidate &&
    typeof candidate === "object" &&
    ("status" in candidate || "data" in candidate || "error" in candidate)
  ) {
    if (candidate.status === "error") {
      throw new Error(candidate.message || candidate.error || "Request failed");
    }

    if (candidate.data !== undefined) {
      return candidate.data;
    }
  }

  return payload as T;
}

function normalizeHealthMonitoring(
  record: RawHealthMonitoringRecord
): HealthMonitoringResponseDto {
  return {
    id: String(record.id ?? ""),
    patientId: Number(record.patientId ?? record.patient_id ?? 0),
    updatedByMidwifeId: Number(
      record.updatedByMidwifeId ?? record.updated_by_midwife_id ?? 0
    ),

    age: Number(record.age ?? 0),
    systolicBP: Number(record.systolicBP ?? record.systolic_bp ?? 0),
    diastolicBP: Number(record.diastolicBP ?? record.diastolic_bp ?? 0),
    bs: Number(record.bs ?? record.blood_sugar ?? 0),
    bodyTemp: Number(record.bodyTemp ?? record.body_temp ?? 0),
    bmi: Number(record.bmi ?? 0),
    heartRate: Number(record.heartRate ?? record.heart_rate ?? 0),

    previousComplications: Number(
      record.previousComplications ?? record.previous_complications ?? 0
    ),
    preexistingDiabetes: Number(
      record.preexistingDiabetes ?? record.preexisting_diabetes ?? 0
    ),
    gestationalDiabetes: Number(
      record.gestationalDiabetes ?? record.gestational_diabetes ?? 0
    ),
    mentalHealth: Number(record.mentalHealth ?? record.mental_health ?? 0),

    riskLevel: String(record.riskLevel ?? record.risk_level ?? ""),
    riskConfidence: Number(record.riskConfidence ?? record.risk_confidence ?? 0),
    healthAdvice: String(record.healthAdvice ?? record.health_advice ?? ""),
    adviceConfidence: Number(
      record.adviceConfidence ?? record.advice_confidence ?? 0
    ),

    riskProbabilities: parseMaybeJson<Record<string, number>>(
      record.riskProbabilities ?? record.risk_probabilities,
      {}
    ),
    patientProfile: parseMaybeJson<Record<string, any>>(
      record.patientProfile ?? record.patient_profile,
      {}
    ),
    alternativeAdvice: parseMaybeJson<AlternativeAdviceItem[]>(
      record.alternativeAdvice ?? record.alternative_advice,
      []
    ),

    createdAt: String(record.createdAt ?? record.created_at ?? ""),
    updatedAt: String(record.updatedAt ?? record.updated_at ?? ""),
  };
}

export const midwifePatientApi = {
  getAssignedPatientDetail: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<AssignedPatientDetailResponseDto>(
      `/api/connections/midwife/${midwifeId}/assigned-users/${patientId}`,
      "GET",
      token
    ),

  updateAssignedPatientProfile: (
    token: string,
    midwifeId: number,
    patientId: number,
    payload: AssignedUserProfileUpdateRequestDto
  ) =>
    request<AssignedPatientDetailResponseDto>(
      `/api/connections/midwife/${midwifeId}/assigned-users/${patientId}`,
      "PUT",
      token,
      payload
    ),

  getPatientHealthCategories: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<HealthCategoryResponseDto[]>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/categories`,
      "GET",
      token
    ),

  getPatientHealthRecordsByCategory: (
    token: string,
    midwifeId: number,
    patientId: number,
    categoryId: string
  ) =>
    request<HealthRecordResponseDto[]>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/category/${categoryId}`,
      "GET",
      token
    ),

  getPatientHealthRecordDetail: (
    token: string,
    midwifeId: number,
    patientId: number,
    recordId: string
  ) =>
    request<HealthRecordResponseDto>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/record/${recordId}`,
      "GET",
      token
    ),

  getPatientFertilityLatest: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<FertilityResponseDto>(
      `/api/fertility/midwife/${midwifeId}/patient/${patientId}/latest`,
      "GET",
      token
    ),

  getLatestPatientHealthMonitoring: async (
    token: string,
    midwifeId: number,
    patientId: number
  ): Promise<HealthMonitoringResponseDto | null> => {
    try {
      const res = await request<
        ApiEnvelope<RawHealthMonitoringRecord> | RawHealthMonitoringRecord
      >(
        `/api/health-monitoring/midwife/${midwifeId}/patient/${patientId}/latest`,
        "GET",
        token
      );

      const raw = unwrapApiEnvelope<RawHealthMonitoringRecord>(res);
      return raw ? normalizeHealthMonitoring(raw) : null;
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("not found") ||
          msg.includes("no health monitoring records")
        ) {
          return null;
        }
      }
      throw error;
    }
  },

  upsertPatientHealthMonitoring: async (
    token: string,
    midwifeId: number,
    patientId: number,
    payload: HealthMonitoringUpsertRequestDto
  ): Promise<HealthMonitoringResponseDto> => {
    const res = await request<
      ApiEnvelope<RawHealthMonitoringRecord> | RawHealthMonitoringRecord
    >(
      `/api/health-monitoring/midwife/${midwifeId}/patient/${patientId}`,
      "PUT",
      token,
      payload
    );

    const raw = unwrapApiEnvelope<RawHealthMonitoringRecord>(res);
    return normalizeHealthMonitoring(raw);
  },

  getPatientHealthMonitoringHistory: async (
    token: string,
    midwifeId: number,
    patientId: number,
    limit = 10
  ): Promise<HealthMonitoringResponseDto[]> => {
    const res = await request<
      ApiEnvelope<RawHealthMonitoringRecord[]> | RawHealthMonitoringRecord[]
    >(
      `/api/health-monitoring/midwife/${midwifeId}/patient/${patientId}/history?limit=${limit}`,
      "GET",
      token
    );

    const raw = unwrapApiEnvelope<RawHealthMonitoringRecord[]>(res);
    return Array.isArray(raw) ? raw.map(normalizeHealthMonitoring) : [];
  },
};

export default midwifePatientApi;