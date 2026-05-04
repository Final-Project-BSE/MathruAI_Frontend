export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELED";

export type AppointmentRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type AppointmentTypeCode =
  | "ANTENATAL_CHECKUP"
  | "FERTILITY_CONSULT"
  | "POSTPARTUM_FOLLOW_UP"
  | "LACTATION_SUPPORT"
  | "MENTAL_HEALTH"
  | "URGENT_ADVICE"
  | "VIRTUAL_CHAT"
  | "HOME_VISIT"
  | "CLINIC_VISIT";

export interface AppointmentResponseDto {
  id: string;
  patientId: number;
  midwifeId?: number;
  appointmentDate: string;
  startTime: string;
  endTime?: string | null;
  appointmentType: AppointmentTypeCode;
  location: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentCreateRequestDto {
  appointmentDate: string;
  startTime: string;
  endTime?: string | null;
  appointmentType: AppointmentTypeCode;
  location: string;
  notes?: string;
}

export interface UnavailableDatesResponseDto {
  dates: string[];
  reasonByDate?: Record<string, string>;
}

export interface AppointmentRequestResponseDto {
  requestId: string;
  midwifeId: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  userEmail?: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string | null;
  appointmentType: AppointmentTypeCode;
  location: string;
  notes?: string;
  status: AppointmentRequestStatus;
  requestedAt?: string;
  updatedAt?: string;
}

export interface BookedSlotsResponseDto {
  date: string;
  bookedSlots: string[];
}

export interface AppointmentListResponseDto {
  appointments: AppointmentResponseDto[];
}

export interface UpcomingAppointmentResponseDto {
  appointmentId: string;
  userId: number;
  userEmail: string;
  firstName: string;
  lastName: string;
  appointmentDate: string;
  startTime: string;
  appointmentType: AppointmentTypeCode;
  location: string;
  status: AppointmentStatus;
}

export interface ApiEnvelope<T> {
  status?: "success" | "error";
  data?: T;
  message?: string;
  error?: string;
}
