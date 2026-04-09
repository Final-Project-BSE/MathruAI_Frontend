import axios, { AxiosError } from 'axios';
import type {
  APIResponse,
  ProfileResponse,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  ChangeRoleRequest,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function extractMessage(err: unknown, fallback: string) {
  const axiosErr = err as AxiosError<any>;
  const data = axiosErr.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  return data?.message || data?.error || fallback;
}

function shouldTryAnotherEndpoint(err: unknown) {
  const axiosErr = err as AxiosError<any>;
  const status = axiosErr.response?.status;
  return (
    status === undefined ||
    status === 400 ||
    status === 403 ||
    status === 404 ||
    status === 405 ||
    status === 415 ||
    status === 422 ||
    status >= 500
  );
}

function normalizeRoleValue(role: string): string {
  return role.replace(/^ROLE_/, '');
}

const profileApi = {

  // GET /api/profile/{id}
  async getProfile(token: string, userId: number): Promise<ProfileResponse> {
    try {
      const res = await http.get<ProfileResponse>(`/api/profile/${userId}`, {
        headers: authHeader(token),
      });
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, 'Failed to fetch profile'));
    }
  },

  // PUT /api/profile/{id}
  async updateProfile(
    token: string,
    userId: number,
    payload: ProfileUpdateRequest
  ): Promise<ProfileResponse> {
    try {
      const res = await http.put<ProfileResponse>(
        `/api/profile/${userId}`,
        payload,
        { headers: authHeader(token) }
      );
      return res.data;
    } catch (err) {
      throw new Error(extractMessage(err, 'Failed to update profile'));
    }
  },

  // PATCH /api/profile/{id}/change-password
  async changePassword(
    token: string,
    userId: number,
    payload: ChangePasswordRequest
  ): Promise<string> {
    try {
      const res = await http.patch<string>(
        `/api/profile/${userId}/change-password`,
        payload,
        { headers: authHeader(token) }
      );
      return res.data; // "Password changed successfully."
    } catch (err) {
      throw new Error(extractMessage(err, 'Failed to change password'));
    }
  },

  // PATCH /api/profile/{id}/change-email
  async changeEmail(
    token: string,
    userId: number,
    payload: ChangeEmailRequest
  ): Promise<ProfileResponse> {
    // Try with original payload first
    try {
      const res = await http.patch<ProfileResponse>(
        `/api/profile/${userId}/change-email`,
        payload,
        { headers: authHeader(token) }
      );
      return res.data;
    } catch (err: any) {
      const errMsg = extractMessage(err, 'Failed to change email');
      
      // If it's an auth-related error, inform user but still consider it a valid attempt
      if (errMsg.includes('User Not Found') || errMsg.includes('authentication')) {
        // This might mean the email was actually changed but session couldn't be updated
        // Throw error but client will handle graceful logout
        throw new Error(errMsg);
      }
      
      throw new Error(errMsg);
    }
  },

  // PATCH /api/profile/{id}/change-role
  async changeRole(
    token: string,
    userId: number,
    payload: ChangeRoleRequest
  ): Promise<ProfileResponse> {
    const selectedRole = normalizeRoleValue(String(payload.roles?.[0] || ''));

    const payloadCandidates: Array<Record<string, unknown>> = [
      { roles: [selectedRole] },
      { roles: [`ROLE_${selectedRole}`] },
      { role: selectedRole },
      { role: `ROLE_${selectedRole}` },
      { stage: selectedRole },
      { stage: `ROLE_${selectedRole}` },
    ];

    let lastError: unknown = null;

    for (const candidate of payloadCandidates) {
      try {
        const res = await http.patch<ProfileResponse>(
          `/api/profile/${userId}/change-role`,
          candidate,
          { headers: authHeader(token) }
        );
        return res.data;
      } catch (err) {
        lastError = err;
        if (!shouldTryAnotherEndpoint(err)) {
          break;
        }
      }
    }

    throw new Error(extractMessage(lastError, 'Failed to change role'));
  },

  async uploadProfileImage(
    token: string,
    userId: number,
    file: File
  ): Promise<ProfileResponse> {
    const endpoints = [
      `/api/profile/${userId}/image`,
      `/api/profile/${userId}/upload-image`,
      `/api/profile/${userId}/avatar`,
      `/api/profile/${userId}/profile-image`,
      `/api/profile/image/${userId}`,
      `/api/profile/avatar/${userId}`,
    ];
    const methods: Array<'put' | 'post' | 'patch'> = ['put', 'post', 'patch'];
    const fieldNames = ['file', 'image', 'avatar', 'profileImage', 'profilePicture', 'multipartFile'];

    const candidates: Array<{
      method: 'put' | 'post' | 'patch';
      path: string;
      fieldName: string;
    }> = [];

    for (const path of endpoints) {
      for (const method of methods) {
        for (const fieldName of fieldNames) {
          candidates.push({ method, path, fieldName });
        }
      }
    }

    let lastError: unknown = null;

    for (const candidate of candidates) {
      try {
        const formData = new FormData();
        formData.append(candidate.fieldName, file);

        const res = await http.request<ProfileResponse>({
          url: candidate.path,
          method: candidate.method,
          data: formData,
          headers: {
            ...authHeader(token),
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.data;
      } catch (err) {
        lastError = err;
        if (!shouldTryAnotherEndpoint(err)) {
          break;
        }
      }
    }

    throw new Error(extractMessage(lastError, 'Failed to upload profile image'));
  },

  async deleteProfileImage(token: string, userId: number): Promise<ProfileResponse> {
    const candidates = [
      `/api/profile/${userId}/image`,
      `/api/profile/${userId}/avatar`,
      `/api/profile/${userId}/delete-image`,
    ];

    let lastError: unknown = null;

    for (const path of candidates) {
      try {
        const res = await http.delete<ProfileResponse>(path, {
          headers: authHeader(token),
        });
        return res.data;
      } catch (err) {
        lastError = err;
        if (!shouldTryAnotherEndpoint(err)) {
          break;
        }
      }
    }

    throw new Error(extractMessage(lastError, 'Failed to delete profile image'));
  },

  // DELETE /api/profile/{id}
  async deleteAccount(token: string, userId: number): Promise<string> {
    const candidates = [
      { method: 'delete' as const, path: `/api/users/me` },
      { method: 'delete' as const, path: `/api/profile/me` },
      { method: 'delete' as const, path: `/api/account/me` },
      { method: 'delete' as const, path: `/api/account` },
      { method: 'delete' as const, path: `/api/users/delete/${userId}` },
      { method: 'delete' as const, path: `/api/user/delete/${userId}` },
      { method: 'post' as const, path: `/api/users/delete-account` },
      { method: 'post' as const, path: `/api/profile/delete-account` },
      { method: 'post' as const, path: `/api/account/delete` },
      { method: 'post' as const, path: `/api/account/delete/${userId}` },
      { method: 'post' as const, path: `/api/users/${userId}/delete` },
      { method: 'post' as const, path: `/api/users/delete/${userId}` },
      { method: 'post' as const, path: `/api/user/delete/${userId}` },
      { method: 'post' as const, path: `/api/users/${userId}/delete-account` },
      { method: 'post' as const, path: `/api/profile/${userId}/delete-account` },
      { method: 'delete' as const, path: `/api/users?id=${userId}` },
      { method: 'delete' as const, path: `/api/user?id=${userId}` },
      { method: 'delete' as const, path: `/api/users/${userId}` },
      { method: 'delete' as const, path: `/api/user/${userId}` },
      { method: 'delete' as const, path: `/api/profile/${userId}` },
      { method: 'delete' as const, path: `/api/profile/${userId}/delete` },
      { method: 'delete' as const, path: `/api/profile/delete/${userId}` },
      { method: 'post' as const, path: `/api/profile/${userId}/delete` },
    ];

    let lastError: unknown = null;
    let lastTried = '';
    const attemptErrors: string[] = [];

    for (const candidate of candidates) {
      try {
        lastTried = `${candidate.method.toUpperCase()} ${candidate.path}`;
        const requestBody = candidate.method === 'post' ? { id: userId, userId } : undefined;

        const res = await http.request<string | { message?: string; error?: string }>({
          url: candidate.path,
          method: candidate.method,
          data: requestBody,
          headers: authHeader(token),
        });

        if (typeof res.data === 'string' && res.data.trim()) {
          return res.data;
        }

        return (res.data as { message?: string })?.message || 'Account deleted successfully.';
      } catch (err) {
        lastError = err;
        const axiosErr = err as AxiosError<{ message?: string; error?: string } | string>;
        const status = axiosErr.response?.status;
        const reason = extractMessage(err, 'Request failed');
        attemptErrors.push(`${lastTried} -> ${status ?? 'NO_STATUS'} ${reason}`);
      }
    }

    const base = extractMessage(lastError, 'Failed to delete account');
    const details = attemptErrors.length
      ? ` Attempts: ${attemptErrors.join(' | ')}`
      : '';
    throw new Error(lastTried ? `${base} (Last tried: ${lastTried})${details}` : `${base}${details}`);
  },
};

export default profileApi;