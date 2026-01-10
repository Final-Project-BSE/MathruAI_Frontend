// src/lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const FERTILITY_API = `${API_BASE_URL}/api/fertility`;

export interface FertilityResponseDto {
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  nextPeriodDate: string;
  pregnancyTestDay: string;
}

export interface CalculateFertilityRequest {
  lastPeriodDate: string; // YYYY-MM-DD
  averageCycleLength: number;
}

async function safeReadText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const text = await safeReadText(res);
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function getLatestFertility(token: string): Promise<FertilityResponseDto | null> {
  try {
    return await requestJson<FertilityResponseDto>(`${FERTILITY_API}/latest`, {
      method: "GET",
      credentials: "omit",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // If there's no existing record, treat it as "no data" rather than an app error
    return null;
  }
}

export async function calculateFertility(
  token: string,
  payload: CalculateFertilityRequest
): Promise<FertilityResponseDto> {
  return await requestJson<FertilityResponseDto>(`${FERTILITY_API}/calculate`, {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
