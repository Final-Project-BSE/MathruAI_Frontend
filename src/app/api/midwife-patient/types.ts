export type Role =
  | "MIDWIFE"
  | "HOPE_TO_PREGNANT_MOTHER"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER"
  | string;

export interface AssignedPatientDetailResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationalIdNumber?: string;
  address?: string;
  profileImageUrl?: string;

  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;

  assignedMidwifeId?: number | null;
  roles: Role[];

  canEditProfile: boolean;
  canViewHealthRecords: boolean;
  canViewFertility: boolean;
  canViewRiskPredictions: boolean;
}

export interface AssignedUserProfileUpdateRequestDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationalIdNumber?: string;
  address?: string;
  profileImageUrl?: string;
  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;
}

export interface HealthCategoryResponseDto {
  id: string;
  slug: string;
  name: string;
  icon: string;
  colorClass: string;
  recordCount: number;
}

export interface RecordFileResponseDto {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

export interface HealthRecordResponseDto {
  id: string;
  name: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  categoryId: string;
  files: RecordFileResponseDto[];
}

export interface FertilityResponseDto {
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  nextPeriodDate: string;
  pregnancyTestDay: string;
  safeStart1: string;
  safeEnd1: string;
  safeStart2: string;
  safeEnd2: string;
  lastPeriodDate: string;
  averageCycleLength: number;
}