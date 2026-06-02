import axios, { AxiosError } from "axios";
import type {
  ProfileResponse,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  ChangeRoleRequest,
} from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081").replace(/\/$/, "");

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

const profileApi = {
  async getProfile(token: string, userId: number): Promise<ProfileResponse> {
    try {
      const res = await http.get<ProfileResponse>(`/api/profile/${userId}`, {
        headers: {
          ...authHeader(token),
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, "Failed to fetch profile"));
    }
  },

  async updateProfile(
    token: string,
    userId: number,
    payload: ProfileUpdateRequest
  ): Promise<ProfileResponse> {
    try {
      const res = await http.put<ProfileResponse>(
        `/api/profile/${userId}`,
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
      throw new Error(extractMessage(err, "Failed to update profile"));
    }
  },

  async changePassword(
    token: string,
    userId: number,
    payload: ChangePasswordRequest
  ): Promise<string> {
    try {
      const res = await http.patch<string>(
        `/api/profile/${userId}/change-password`,
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
      throw new Error(extractMessage(err, "Failed to change password"));
    }
  },

  async changeEmail(
    token: string,
    userId: number,
    payload: ChangeEmailRequest
  ): Promise<ProfileResponse> {
    try {
      const res = await http.patch<ProfileResponse>(
        `/api/profile/${userId}/change-email`,
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
      throw new Error(extractMessage(err, "Failed to change email"));
    }
  },

  async changeRole(
    token: string,
    userId: number,
    payload: ChangeRoleRequest
  ): Promise<ProfileResponse> {
    try {
      const res = await http.patch<ProfileResponse>(
        `/api/profile/${userId}/change-role`,
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
      throw new Error(extractMessage(err, "Failed to change role"));
    }
  },

  async uploadProfileImage(
    token: string,
    userId: number,
    file: File
  ): Promise<ProfileResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await http.post<ProfileResponse>(
        `/api/profile/${userId}/upload-image`,
        formData,
        {
          headers: {
            ...authHeader(token),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, "Failed to upload profile image"));
    }
  },

  async deleteAccount(token: string, userId: number): Promise<string> {
    try {
      const res = await http.delete<string>(`/api/profile/${userId}`, {
        headers: {
          ...authHeader(token),
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, "Failed to delete account"));
    }
  },
};

export default profileApi;