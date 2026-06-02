import axios, { AxiosError } from "axios";
import type { UserResponseDto, UserUpdateRequest } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type ErrorResponseData = {
  message?: unknown;
};

function toMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<ErrorResponseData>;
    const data = axErr.response?.data;

    return (
      (typeof data === "string" && data) ||
      (typeof data?.message === "string" && data.message) ||
      axErr.message ||
      "Request failed"
    );
  }

  return err instanceof Error ? err.message : "Request failed";
}

export async function getAllUsers(token: string): Promise<UserResponseDto[]> {
  try {
    const res = await api.get<UserResponseDto[]>("/api/users", {
      headers: authHeader(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function getUserById(
  token: string,
  id: number
): Promise<UserResponseDto> {
  try {
    const res = await api.get<UserResponseDto>(`/api/users/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function updateUser(
  token: string,
  id: number,
  payload: UserUpdateRequest
): Promise<UserResponseDto> {
  try {
    const res = await api.put<UserResponseDto>(`/api/users/${id}`, payload, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function deleteUser(token: string, id: number): Promise<string> {
  try {
    const res = await api.delete<string>(`/api/users/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function getcuruser(token: string): Promise<UserResponseDto> {
  try {
    const res = await api.get<UserResponseDto>("/api/users/me", {
      headers: authHeader(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}