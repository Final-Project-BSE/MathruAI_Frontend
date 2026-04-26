export type VaccinationStatus = "PENDING" | "COMPLETED" | "MISSED";

export interface VaccinationCardRequestDto {
  vaccineName: string;
  vaccineType?: string;
  dose?: string;
  dueDate: string;
  status: VaccinationStatus;
  midwifeNote?: string;
  completedDate?: string;
  vaccinationInjectionDate?: string;
  location?: string;
}

export interface VaccinationCardResponseDto {
  id: number;
  midwifeId: number;
  patientId?: number | null;
  patientName?: string | null;
  patientEmail?: string | null;
  vaccineName: string;
  vaccineType?: string | null;
  dose?: string | null;
  dueDate: string;
  status: VaccinationStatus;
  midwifeNote?: string | null;
  completedDate?: string | null;
  vaccinationInjectionDate?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationSummaryDto {
  totalCards: number;
  upcomingVaccinations: number;
  todayVaccinations: number;
  missedPatients: number;
  completedPatients: number;
  pendingPatients: number;
}

export interface VaccineEligibilityDto {
  vaccineName: string;
  vaccineType: string;
  dose: string;
  eligiblePatients: number;
}
