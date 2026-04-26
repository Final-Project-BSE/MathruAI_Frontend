const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "DELETE";

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const triposhaApi = {
  getByPatient: (token: string, patientId: number) =>
    request<TriposhaRecord[]>(
      `/api/triposha/patient/${patientId}`,
      "GET",
      token
    ),

  create: (
    token: string,
    payload: Omit<TriposhaRecord, "id">
  ) =>
    request<TriposhaRecord>(
      `/api/triposha`,
      "POST",
      token,
      payload
    ),

  delete: (token: string, id: number) =>
    request<void>(`/api/triposha/${id}`, "DELETE", token),

   update: (
    token: string,
    id: number,
    payload: Omit<TriposhaRecord, "id">
  ) =>
    request<TriposhaRecord>(
      `/api/triposha/${id}`,
      "PUT",
      token,
      payload
    ),
};