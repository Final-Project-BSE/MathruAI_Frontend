import type { TriposhaRecord } from "./types";

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
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

export type TriposhaPayload = {
  patientId: number;
  midwifeId: number;
  distributionDate: string;
  quantity: number;
  status: "GIVEN" | "PENDING" | "MISSED";
  nextDueDate: string;
  notes?: string;
};

export const triposhaApi = {
  getByPatient: (token: string, patientId: number) =>
    request<TriposhaRecord[]>(
      `/api/triposha/patient/${patientId}`,
      "GET",
      token
    ),

  getByMidwife: (token: string, midwifeId: number) =>
    request<TriposhaRecord[]>(
      `/api/triposha/midwife/${midwifeId}`,
      "GET",
      token
    ),

  create: (token: string, payload: TriposhaPayload) =>
    request<TriposhaRecord>(`/api/triposha`, "POST", token, payload),

  update: (token: string, id: number, payload: TriposhaPayload) =>
    request<TriposhaRecord>(`/api/triposha/${id}`, "PUT", token, payload),

  delete: (token: string, id: number) =>
    request<string>(`/api/triposha/${id}`, "DELETE", token),
};