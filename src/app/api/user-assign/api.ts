import type {
  AreaMapSearchRequestDto,
  AreaSearchRequestDto,
  AssignedUserProfileUpdateRequestDto,
  ConnectionRequestResponseDto,
  SendConnectionRequestDto,
  UserResponseDto,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod,
  token?: string,
  body?: unknown,
  isFormData = false
): Promise<T> {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? (body as BodyInit)
        : JSON.stringify(body)
      : undefined,
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

export const assignmentApi = {
  sendRequest: (
    senderId: number,
    payload: SendConnectionRequestDto,
    token?: string
  ) =>
    request<ConnectionRequestResponseDto[]>(
      `/api/connections/send/${senderId}`,
      "POST",
      token,
      payload
    ),

  approveRequest: (requestId: number, approverUserId: number, token?: string) =>
    request<ConnectionRequestResponseDto>(
      `/api/connections/${requestId}/approve/${approverUserId}`,
      "PATCH",
      token
    ),

  rejectRequest: (requestId: number, approverUserId: number, token?: string) =>
    request<ConnectionRequestResponseDto>(
      `/api/connections/${requestId}/reject/${approverUserId}`,
      "PATCH",
      token
    ),

  getSentRequests: (userId: number, token?: string) =>
    request<ConnectionRequestResponseDto[]>(
      `/api/connections/sent/${userId}`,
      "GET",
      token
    ),

  getReceivedRequests: (userId: number, token?: string) =>
    request<ConnectionRequestResponseDto[]>(
      `/api/connections/received/${userId}`,
      "GET",
      token
    ),

  getAssignedUsersForMidwife: (midwifeId: number, token?: string) =>
    request<UserResponseDto[]>(
      `/api/connections/midwife/${midwifeId}/assigned-users`,
      "GET",
      token
    ),

  getAssignedMidwifeForMother: (motherUserId: number, token?: string) =>
    request<UserResponseDto>(
      `/api/connections/mother/${motherUserId}/assigned-midwife`,
      "GET",
      token
    ),

  updateAssignedMotherProfile: (
    midwifeId: number,
    motherUserId: number,
    payload: AssignedUserProfileUpdateRequestDto,
    token?: string
  ) =>
    request<UserResponseDto>(
      `/api/connections/midwife/${midwifeId}/assigned-users/${motherUserId}`,
      "PUT",
      token,
      payload
    ),

  searchUsersByDistrictAndMohArea: (
    requesterId: number,
    payload: AreaSearchRequestDto,
    token?: string
  ) =>
    request<UserResponseDto[]>(
      `/api/connections/search/${requesterId}`,
      "POST",
      token,
      payload
    ),

  searchMappableUsersByDistrictAndMohArea: (
    requesterId: number,
    payload: AreaMapSearchRequestDto,
    token?: string
  ) =>
    request<UserResponseDto[]>(
      `/api/connections/map-search/${requesterId}`,
      "POST",
      token,
      payload
    ),

  getDistricts: (token?: string) =>
    request<string[]>(
      `/api/locations/districts`,
      "GET",
      token
    ),

  getMohAreasByDistrict: (district: string, token?: string) =>
    request<string[]>(
      `/api/locations/moh-areas?district=${encodeURIComponent(district)}`,
      "GET",
      token
    ),
};