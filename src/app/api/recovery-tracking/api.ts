import axios, { AxiosError } from "axios";
import type { RecoveryRecordRequestDto, RecoveryRecordResponseDto } from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

const http = axios.create({
  baseURL: API_BASE_URL,
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function extractMessage(err: unknown, fallback: string) {
  const axiosErr = err as AxiosError<{ message?: string; error?: string } | string>;
  const data = axiosErr.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    return data.message || data.error || fallback;
  }

  return fallback;
}

const recoveryTrackingApi = {
  async saveOrUpdateRecord(
    token: string,
    payload: RecoveryRecordRequestDto
  ): Promise<RecoveryRecordResponseDto> {
    try {
      const res = await http.post<RecoveryRecordResponseDto>(
        `/api/recovery-records`,
        payload,
        {
          headers: {
            ...authHeader(token),
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, "Failed to save recovery record"));
    }
  },

  async getRecordByPatientAndDay(
    token: string,
    patientId: number,
    dayNumber: number
  ): Promise<RecoveryRecordResponseDto | null> {
    try {
      const res = await http.get<RecoveryRecordResponseDto>(
        `/api/recovery-records/patient/${patientId}/day/${dayNumber}`,
        {
          headers: {
            ...authHeader(token),
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw new Error(extractMessage(err, "Failed to get recovery record"));
    }
  },

  async getAllRecordsForPatient(
    token: string,
    patientId: number
  ): Promise<RecoveryRecordResponseDto[]> {
    try {
      const res = await http.get<RecoveryRecordResponseDto[]>(
        `/api/recovery-records/patient/${patientId}`,
        {
          headers: {
            ...authHeader(token),
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, "Failed to fetch recovery records"));
    }
  },
};

export default recoveryTrackingApi;
