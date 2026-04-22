export type Role =
  | "MIDWIFE"
  | "HOPE_TO_PREGNANT_MOTHER"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER";

export type ConnectionRequestMethod = "EMAIL" | "AREA";

export type ConnectionRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface SendConnectionRequestDto {
  method: ConnectionRequestMethod;
  targetEmail?: string;
  targetArea?: string;
  message?: string;
}

export interface AreaSearchRequestDto {
  district: string;
  mohArea: string;
}

export interface AreaMapSearchRequestDto {
  district: string;
  mohArea: string;
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

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  nationalIdNumber?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
  area?: string | null;
  district?: string | null;
  mohArea?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  assignedMidwifeId?: number | null;
  roles: Role[];
}

export interface ConnectionRequestResponseDto {
  id: number;
  senderId: number;
  senderEmail: string;
  senderFirstName: string;
  senderLastName: string;
  senderRoles: Role[];

  receiverId: number;
  receiverEmail: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverRoles: Role[];

  method: ConnectionRequestMethod;
  status: ConnectionRequestStatus;
  message?: string | null;
  matchedArea?: string | null;
  createdAt?: string | null;
  respondedAt?: string | null;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}