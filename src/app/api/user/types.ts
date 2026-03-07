export type Role = "USER" | "ADMIN" | string;

export type AuthResponse = {
  token: string;
  email: string;
  roles: Role[];
  // id: number;
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
};

export type UserResponseDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string; 
  roles: Role[];
};

export type UserUpdateRequest = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  roles?: Role[];
};