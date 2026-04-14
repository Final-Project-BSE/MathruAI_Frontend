export type Role =
  | "MIDWIFE"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER"
  | "HOPE_TO_PREGNANT_MOTHER"
  | string;

export type AuthResponse = {
  token: string;
  email: string;
  roles: Role[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  password: string;
  roles: Role[];
  nationalIdNumber?: string;
  address?: string;

  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;
};

export type UserResponseDto = {
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
};

export type UserUpdateRequest = {
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

  roles?: Role[];
};