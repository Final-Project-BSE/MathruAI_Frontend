// types.ts - Shared TypeScript type definitions

export interface VitalsState {
  Age: string;
  SystolicBP: string;
  DiastolicBP: string;
  BS: string;
  BodyTemp: string;
  BMI: string;
  HeartRate: string;
  PreviousComplications: number;
  PreexistingDiabetes: number;
  GestationalDiabetes: number;
  MentalHealth: number;
}

export interface RiskAssessment {
  risk_level: string;
  confidence: number;
  all_risk_probabilities: Record<string, number>;
}

export interface HealthGuidance {
  primary_advice: string;
  advice_confidence: number;
  alternative_recommendations: string[];
}

export interface PredictionResult {
  prediction_id: string;
  user_id: string;
  vitals: VitalsState;
  risk_assessment: RiskAssessment;
  health_guidance: HealthGuidance;
  patient_profile: Record<string, any>;
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  message?: string;
}
