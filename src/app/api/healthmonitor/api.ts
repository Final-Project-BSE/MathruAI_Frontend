import axios, { AxiosError } from "axios";
import type {
  APIResponse,
  PredictionResult,
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
  VitalsState,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export type VitalsPayload = {
  Age: number;
  SystolicBP: number;
  DiastolicBP: number;
  BS: number;
  BodyTemp: number;
  BMI: number;
  HeartRate: number;
  PreviousComplications: number;
  PreexistingDiabetes: number;
  GestationalDiabetes: number;
  MentalHealth: number;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

type AlternativeAdviceItem =
  | string
  | {
      advice: string;
      confidence: number;
    };

type PatientProfile = Record<string, unknown>;

export type BackendPredictionRecord = {
  prediction_id?: string;
  id?: string;
  user_id: string;
  vitals: Partial<VitalsPayload>;
  prediction?: {
    risk_level?: string;
    risk_confidence?: number;
    risk_probabilities?: Record<string, number>;
    health_advice?: string;
    advice_confidence?: number;
    alternative_advice?: AlternativeAdviceItem[];
    patient_profile?: PatientProfile;
  };
  risk_assessment?: {
    risk_level: string;
    confidence: number;
    all_risk_probabilities: Record<string, number>;
  };
  health_guidance?: {
    primary_advice: string;
    advice_confidence: number;
    alternative_recommendations: AlternativeAdviceItem[];
  };
  patient_profile?: PatientProfile;
  created_at?: string;
  updated_at?: string;
  updated_by_midwife_id?: string | number | null;
};

function toStringVital(value: number | undefined): string {
  return value === undefined || value === null ? "" : String(value);
}

function toNumberFlag(value: number | undefined): number {
  return Number(value ?? 0);
}

function normalizeVitals(vitals: Partial<VitalsPayload> = {}): VitalsState {
  return {
    Age: toStringVital(vitals.Age),
    SystolicBP: toStringVital(vitals.SystolicBP),
    DiastolicBP: toStringVital(vitals.DiastolicBP),
    BS: toStringVital(vitals.BS),
    BodyTemp: toStringVital(vitals.BodyTemp),
    BMI: toStringVital(vitals.BMI),
    HeartRate: toStringVital(vitals.HeartRate),
    PreviousComplications: toNumberFlag(vitals.PreviousComplications),
    PreexistingDiabetes: toNumberFlag(vitals.PreexistingDiabetes),
    GestationalDiabetes: toNumberFlag(vitals.GestationalDiabetes),
    MentalHealth: toNumberFlag(vitals.MentalHealth),
  };
}

export function normalizePrediction(
  record: BackendPredictionRecord
): PredictionResult {
  const predId = record.prediction_id || record.id || "";
  const vitals = normalizeVitals(record.vitals);

  if (record.risk_assessment && record.health_guidance) {
    return {
      prediction_id: predId,
      user_id: record.user_id,
      vitals,
      risk_assessment: record.risk_assessment,
      health_guidance: {
        primary_advice: record.health_guidance.primary_advice,
        advice_confidence: record.health_guidance.advice_confidence,
        alternative_recommendations:
          record.health_guidance.alternative_recommendations.map((item) =>
            typeof item === "string" ? item : item.advice
          ),
      },
      patient_profile: record.patient_profile || {},
    };
  }

  return {
    prediction_id: predId,
    user_id: record.user_id,
    vitals,
    risk_assessment: {
      risk_level: record.prediction?.risk_level || "",
      confidence: record.prediction?.risk_confidence ?? 0,
      all_risk_probabilities: record.prediction?.risk_probabilities || {},
    },
    health_guidance: {
      primary_advice: record.prediction?.health_advice || "",
      advice_confidence: record.prediction?.advice_confidence ?? 0,
      alternative_recommendations: Array.isArray(
        record.prediction?.alternative_advice
      )
        ? record.prediction.alternative_advice.map((item) =>
            typeof item === "string" ? item : item.advice
          )
        : [],
    },
    patient_profile: record.prediction?.patient_profile || {},
  };
}

function normalizeAlternativeAdvice(
  alternativeAdvice: AlternativeAdviceItem[] | undefined
) {
  if (!Array.isArray(alternativeAdvice)) return [];

  return alternativeAdvice.map((item) => {
    if (typeof item === "string") {
      return {
        advice: item,
        confidence: 0,
      };
    }

    return {
      advice: item.advice || "",
      confidence: Number(item.confidence ?? 0),
    };
  });
}

export function normalizeHealthMonitoringRecord(
  record: BackendPredictionRecord
): HealthMonitoringResponseDto {
  const vitals = record.vitals || {};
  const prediction = record.prediction || {};
  const riskAssessment = record.risk_assessment || {
    risk_level: "",
    confidence: 0,
    all_risk_probabilities: {},
  };
  const healthGuidance = record.health_guidance || {
    primary_advice: "",
    advice_confidence: 0,
    alternative_recommendations: [],
  };

  const riskLevel = prediction.risk_level || riskAssessment.risk_level || "";
  const riskConfidence = Number(
    prediction.risk_confidence ?? riskAssessment.confidence ?? 0
  );
  const healthAdvice =
    prediction.health_advice || healthGuidance.primary_advice || "";
  const adviceConfidence = Number(
    prediction.advice_confidence ?? healthGuidance.advice_confidence ?? 0
  );
  const riskProbabilities =
    prediction.risk_probabilities ||
    riskAssessment.all_risk_probabilities ||
    {};
  const alternativeAdvice = Array.isArray(prediction.alternative_advice)
    ? normalizeAlternativeAdvice(prediction.alternative_advice)
    : Array.isArray(healthGuidance.alternative_recommendations)
    ? healthGuidance.alternative_recommendations.map((item) =>
        typeof item === "string"
          ? { advice: item, confidence: 0 }
          : {
              advice: item.advice || "",
              confidence: Number(item.confidence ?? 0),
            }
      )
    : [];

  const patientProfile =
    prediction.patient_profile || record.patient_profile || {};

  return {
    id: String(record.id || record.prediction_id || ""),
    userId: String(record.user_id || ""),
    updatedByMidwifeId: record.updated_by_midwife_id ?? null,

    age: Number(vitals.Age ?? 0),
    systolicBP: Number(vitals.SystolicBP ?? 0),
    diastolicBP: Number(vitals.DiastolicBP ?? 0),
    bs: Number(vitals.BS ?? 0),
    bodyTemp: Number(vitals.BodyTemp ?? 0),
    bmi: Number(vitals.BMI ?? 0),
    heartRate: Number(vitals.HeartRate ?? 0),

    previousComplications: Number(vitals.PreviousComplications ?? 0),
    preexistingDiabetes: Number(vitals.PreexistingDiabetes ?? 0),
    gestationalDiabetes: Number(vitals.GestationalDiabetes ?? 0),
    mentalHealth: Number(vitals.MentalHealth ?? 0),

    riskLevel,
    riskConfidence,
    healthAdvice,
    adviceConfidence,
    riskProbabilities,
    alternativeAdvice,
    patientProfile,

    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

const apis = {
  async getLatest(token: string): Promise<PredictionResult | null> {
    try {
      const res = await http.get<APIResponse<BackendPredictionRecord>>(
        "/predict/latest",
        {
          headers: authHeader(token),
        }
      );

      if (res.data?.status === "success" && res.data.data) {
        return normalizePrediction(res.data.data);
      }

      return null;
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;

      if (axiosErr.response?.status === 404) return null;

      throw err;
    }
  },

  async store(token: string, payload: VitalsPayload): Promise<PredictionResult> {
    const res = await http.post<APIResponse<BackendPredictionRecord>>(
      "/predict/store",
      payload,
      {
        headers: authHeader(token),
      }
    );

    if (res.data?.status !== "success" || !res.data.data) {
      throw new Error(res.data?.error || "Prediction failed");
    }

    return normalizePrediction(res.data.data);
  },

  async update(
    token: string,
    predictionId: string,
    payload: VitalsPayload
  ): Promise<PredictionResult> {
    const res = await http.put<APIResponse<BackendPredictionRecord>>(
      `/predict/update/${predictionId}`,
      payload,
      {
        headers: authHeader(token),
      }
    );

    if (res.data?.status !== "success" || !res.data.data) {
      throw new Error(res.data?.error || "Prediction update failed");
    }

    return normalizePrediction(res.data.data);
  },

  async delete(token: string, predictionId: string): Promise<void> {
    const res = await http.delete<APIResponse<unknown>>(
      `/predict/delete/${predictionId}`,
      {
        headers: authHeader(token),
      }
    );

    if (res.data?.status !== "success") {
      throw new Error(res.data?.error || "Failed to delete prediction");
    }
  },
};

export const healthMonitoringApis = {
  async getLatest(
    token: string,
    midwifeId: string | number,
    patientId: string | number
  ): Promise<HealthMonitoringResponseDto | null> {
    try {
      const res = await http.get<APIResponse<BackendPredictionRecord>>(
        `/health-monitoring/midwife/${midwifeId}/patient/${patientId}/latest`,
        {
          headers: authHeader(token),
        }
      );

      if (res.data?.status === "success" && res.data.data) {
        return normalizeHealthMonitoringRecord(res.data.data);
      }

      return null;
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;

      if (axiosErr.response?.status === 404) return null;

      throw new Error(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          "Failed to fetch latest health monitoring record"
      );
    }
  },

  async create(
    token: string,
    midwifeId: string | number,
    patientId: string | number,
    payload: HealthMonitoringUpsertRequestDto
  ): Promise<HealthMonitoringResponseDto> {
    try {
      const res = await http.post<APIResponse<BackendPredictionRecord>>(
        `/health-monitoring/midwife/${midwifeId}/patient/${patientId}`,
        payload,
        {
          headers: authHeader(token),
        }
      );

      if (res.data?.status !== "success" || !res.data.data) {
        throw new Error(
          res.data?.error ||
            res.data?.message ||
            "Failed to create health monitoring record"
        );
      }

      return normalizeHealthMonitoringRecord(res.data.data);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;

      throw new Error(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Failed to create health monitoring record")
      );
    }
  },

  async update(
    token: string,
    midwifeId: string | number,
    patientId: string | number,
    predictionId: string | number,
    payload: HealthMonitoringUpsertRequestDto
  ): Promise<HealthMonitoringResponseDto> {
    try {
      const res = await http.put<APIResponse<BackendPredictionRecord>>(
        `/health-monitoring/midwife/${midwifeId}/patient/${patientId}/prediction/${predictionId}`,
        payload,
        {
          headers: authHeader(token),
        }
      );

      if (res.data?.status !== "success" || !res.data.data) {
        throw new Error(
          res.data?.error ||
            res.data?.message ||
            "Failed to update health monitoring record"
        );
      }

      return normalizeHealthMonitoringRecord(res.data.data);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;

      throw new Error(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Failed to update health monitoring record")
      );
    }
  },

  async delete(
    token: string,
    midwifeId: string | number,
    patientId: string | number,
    predictionId: string | number
  ): Promise<void> {
    try {
      const res = await http.delete<APIResponse<unknown>>(
        `/health-monitoring/midwife/${midwifeId}/patient/${patientId}/prediction/${predictionId}`,
        {
          headers: authHeader(token),
        }
      );

      if (res.data?.status !== "success") {
        throw new Error(
          res.data?.error ||
            res.data?.message ||
            "Failed to delete health monitoring record"
        );
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;

      throw new Error(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Failed to delete health monitoring record")
      );
    }
  },
};

export default apis;