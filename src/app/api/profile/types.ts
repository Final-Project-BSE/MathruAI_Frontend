export type Role = 'PREGNANT_MOTHER' | 'POST_PREGNANT_MOTHER' | 'HOPE_TO_PREGNANT_MOTHER' | string;

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  roles: Role[];
  avatarUrl?: string;
  profileImageUrl?: string;
  profilePictureUrl?: string;
  imageUrl?: string;
  photoUrl?: string;
  profileImage?: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // "YYYY-MM-DD"
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
  status: 'success' | 'error';
  data?: T;
  error?: string;
  message?: string;
}