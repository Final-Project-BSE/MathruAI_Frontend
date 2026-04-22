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

/* =========================
   Health Monitoring Types
   Added without changing existing prediction contracts
   ========================= */

export interface HealthMonitoringAdviceOption {
  advice: string;
  confidence: number;
}

export interface HealthMonitoringUpsertRequestDto {
  age: number;
  systolicBP: number;
  diastolicBP: number;
  bs: number;
  bodyTemp: number;
  bmi: number;
  heartRate: number;
  previousComplications: number;
  preexistingDiabetes: number;
  gestationalDiabetes: number;
  mentalHealth: number;
}

export interface HealthMonitoringResponseDto {
  id: string;
  userId: string;
  updatedByMidwifeId?: string | number | null;

  age: number;
  systolicBP: number;
  diastolicBP: number;
  bs: number;
  bodyTemp: number;
  bmi: number;
  heartRate: number;

  previousComplications: number;
  preexistingDiabetes: number;
  gestationalDiabetes: number;
  mentalHealth: number;

  riskLevel: string;
  riskConfidence: number;
  healthAdvice: string;
  adviceConfidence: number;
  riskProbabilities: Record<string, number>;
  alternativeAdvice: HealthMonitoringAdviceOption[];
  patientProfile: Record<string, any>;

  createdAt?: string;
  updatedAt?: string;
}