import axios, { AxiosError } from 'axios';
import type { APIResponse, PredictionResult } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
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

export type BackendPredictionRecord = {
  prediction_id?: string;
  id?: string;
  user_id: string;
  vitals: any;
  // sometimes backend returns "prediction" nested
  prediction?: {
    risk_level?: string;
    risk_confidence?: number;
    risk_probabilities?: Record<string, number>;
    health_advice?: string;
    advice_confidence?: number;
    alternative_advice?: string[];
    patient_profile?: Record<string, any>;
  };
  risk_assessment?: {
    risk_level: string;
    confidence: number;
    all_risk_probabilities: Record<string, number>;
  };
  health_guidance?: {
    primary_advice: string;
    advice_confidence: number;
    alternative_recommendations: string[];
  };
  patient_profile?: Record<string, any>;
};

export function normalizePrediction(record: BackendPredictionRecord): PredictionResult {
  const predId = record.prediction_id || record.id || '';

  if (record.risk_assessment && record.health_guidance) {
    return {
      prediction_id: predId,
      user_id: record.user_id,
      vitals: record.vitals,
      risk_assessment: record.risk_assessment,
      health_guidance: record.health_guidance,
      patient_profile: record.patient_profile || record.health_guidance ? (record.patient_profile || {}) : {},
    };
  }

  return {
    prediction_id: predId,
    user_id: record.user_id,
    vitals: record.vitals,
    risk_assessment: {
      risk_level: record.prediction?.risk_level || '',
      confidence: record.prediction?.risk_confidence ?? 0,
      all_risk_probabilities: record.prediction?.risk_probabilities || {},
    },
    health_guidance: {
      primary_advice: record.prediction?.health_advice || '',
      advice_confidence: record.prediction?.advice_confidence ?? 0,
      alternative_recommendations: record.prediction?.alternative_advice || [],
    },
    patient_profile: record.prediction?.patient_profile || {},
  };
}

const apis = {
  async getLatest(token: string): Promise<PredictionResult | null> {
    try {
      const res = await http.get<APIResponse<BackendPredictionRecord>>('/predict/latest', {
        headers: authHeader(token),
      });

      if (res.data?.status === 'success' && res.data.data) {
        return normalizePrediction(res.data.data);
      }

      return null;
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      if (axiosErr.response?.status === 404) return null;
      throw err;
    }
  },

  async store(token: string, payload: VitalsPayload): Promise<PredictionResult> {
    const res = await http.post<APIResponse<BackendPredictionRecord>>('/predict/store', payload, {
      headers: authHeader(token),
    });

    if (res.data?.status !== 'success' || !res.data.data) {
      throw new Error(res.data?.error || 'Prediction failed');
    }
    return normalizePrediction(res.data.data);
  },

  async update(token: string, predictionId: string, payload: VitalsPayload): Promise<PredictionResult> {
    const res = await http.put<APIResponse<BackendPredictionRecord>>(`/predict/update/${predictionId}`, payload, {
      headers: authHeader(token),
    });

    if (res.data?.status !== 'success' || !res.data.data) {
      throw new Error(res.data?.error || 'Prediction update failed');
    }
    return normalizePrediction(res.data.data);
  },

  async delete(token: string, predictionId: string): Promise<void> {
    const res = await http.delete<APIResponse<unknown>>(`/predict/delete/${predictionId}`, {
      headers: authHeader(token),
    });

    if (res.data?.status !== 'success') {
      throw new Error(res.data?.error || 'Failed to delete prediction');
    }
  },
};

export default apis;
