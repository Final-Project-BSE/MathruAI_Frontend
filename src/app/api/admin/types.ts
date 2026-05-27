export type Role =
  | "ADMIN"
  | "MIDWIFE"
  | "HOPE_TO_PREGNANT_MOTHER"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER"
  | string;

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
  profileImageUrl?: string;
  area?: string;
  district?: string;
  mohArea?: string;
  latitude?: number;
  longitude?: number;
  roles?: Role[];
};

export type ChatbotUploadResponse = {
  status?: string;
  message?: string;
  data?: unknown;
  filename?: string;
  error?: string;
};

export type DailyRecommendationUploadResponse = {
  message?: string;
  filename?: string;
  vector_db_size?: number;
  uploaded_by?: string;
  error?: string;
};

export type UploadTarget = "chatbot" | "daily-recommendation";
