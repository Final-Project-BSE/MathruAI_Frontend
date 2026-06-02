import type {
  VaccinationCardRequestDto,
  VaccinationCardResponseDto,
  VaccinationSummaryDto,
  VaccineEligibilityDto,
} from "./types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://127.0.0.1:8081").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

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

export const vaccinationApi = {
  createGlobalCard: (
    token: string,
    midwifeId: number,
    payload: VaccinationCardRequestDto
  ) =>
    request<VaccinationCardResponseDto>(
      `/api/vaccinations/midwife/${midwifeId}`,
      "POST",
      token,
      payload
    ),

  assignGlobalCardToPatient: (
    token: string,
    midwifeId: number,
    patientId: number,
    cardId: number
  ) =>
    request<VaccinationCardResponseDto>(
      `/api/vaccinations/midwife/${midwifeId}/patient/${patientId}/assign/${cardId}`,
      "POST",
      token
    ),

  getMidwifeCards: (token: string, midwifeId: number) =>
    request<VaccinationCardResponseDto[]>(
      `/api/vaccinations/midwife/${midwifeId}`,
      "GET",
      token
    ),

  getGlobalCards: (token: string, midwifeId: number) =>
    request<VaccinationCardResponseDto[]>(
      `/api/vaccinations/midwife/${midwifeId}/templates`,
      "GET",
      token
    ),

  getPatientCards: (token: string, midwifeId: number, patientId: number) =>
    request<VaccinationCardResponseDto[]>(
      `/api/vaccinations/midwife/${midwifeId}/patient/${patientId}`,
      "GET",
      token
    ),

  updateCard: (
    token: string,
    midwifeId: number,
    cardId: number,
    payload: VaccinationCardRequestDto
  ) =>
    request<VaccinationCardResponseDto>(
      `/api/vaccinations/midwife/${midwifeId}/cards/${cardId}`,
      "PUT",
      token,
      payload
    ),

  deleteCard: (token: string, midwifeId: number, cardId: number) =>
    request<string>(
      `/api/vaccinations/midwife/${midwifeId}/cards/${cardId}`,
      "DELETE",
      token
    ),

  getSummary: (token: string, midwifeId: number) =>
    request<VaccinationSummaryDto>(
      `/api/vaccinations/midwife/${midwifeId}/summary`,
      "GET",
      token
    ),

  getUpcoming: (token: string, midwifeId: number, days = 30) =>
    request<VaccinationCardResponseDto[]>(
      `/api/vaccinations/midwife/${midwifeId}/upcoming?days=${days}`,
      "GET",
      token
    ),

  getEligibility: (token: string, midwifeId: number) =>
    request<VaccineEligibilityDto[]>(
      `/api/vaccinations/midwife/${midwifeId}/eligibility`,
      "GET",
      token
    ),

  getPatientSideCards: (token: string, patientId: number) =>
    request<VaccinationCardResponseDto[]>(
      `/api/vaccinations/patient/${patientId}`,
      "GET",
      token
    ),
};