import type {
  AssignedPatientDetailResponseDto,
  AssignedUserProfileUpdateRequestDto,
  FertilityResponseDto,
  HealthCategoryResponseDto,
  HealthRecordResponseDto,
} from "./types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export const midwifePatientApi = {
  getAssignedPatientDetail: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<AssignedPatientDetailResponseDto>(
      `/api/connections/midwife/${midwifeId}/assigned-users/${patientId}`,
      "GET",
      token
    ),

  updateAssignedPatientProfile: (
    token: string,
    midwifeId: number,
    patientId: number,
    payload: AssignedUserProfileUpdateRequestDto
  ) =>
    request<AssignedPatientDetailResponseDto>(
      `/api/connections/midwife/${midwifeId}/assigned-users/${patientId}`,
      "PUT",
      token,
      payload
    ),

  getPatientHealthCategories: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<HealthCategoryResponseDto[]>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/categories`,
      "GET",
      token
    ),

  getPatientHealthRecordsByCategory: (
    token: string,
    midwifeId: number,
    patientId: number,
    categoryId: string
  ) =>
    request<HealthRecordResponseDto[]>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/category/${categoryId}`,
      "GET",
      token
    ),

  getPatientHealthRecordDetail: (
    token: string,
    midwifeId: number,
    patientId: number,
    recordId: string
  ) =>
    request<HealthRecordResponseDto>(
      `/api/health-records/midwife/${midwifeId}/patient/${patientId}/record/${recordId}`,
      "GET",
      token
    ),

  getPatientFertilityLatest: (
    token: string,
    midwifeId: number,
    patientId: number
  ) =>
    request<FertilityResponseDto>(
      `/api/fertility/midwife/${midwifeId}/patient/${patientId}/latest`,
      "GET",
      token
    ),
};