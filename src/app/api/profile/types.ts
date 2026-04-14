export type Role =
  | "MIDWIFE"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER"
  | "HOPE_TO_PREGNANT_MOTHER"
  | string;

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationalIdNumber: string;
  address: string;
  profileImageUrl?: string;

  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;

  assignedMidwifeId?: number | null;
  roles: Role[];
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationalIdNumber?: string;
  address?: string;

  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  currentPassword: string;
}

export interface ChangeRoleRequest {
  roles: Role[];
}

export interface APIResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: string;
  message?: string;
}