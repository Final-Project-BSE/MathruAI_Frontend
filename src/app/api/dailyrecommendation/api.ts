// api.ts
import axios, { AxiosError } from 'axios';
import type { UserData, RecommendationData, HistoryItem } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const PREGNANCY_API = `${API_BASE_URL}/pregnancy`;

const http = axios.create({
  baseURL: PREGNANCY_API,
  headers: { 'Content-Type': 'application/json' },
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function isAxios404(err: unknown) {
  return axios.isAxiosError(err) && err.response?.status === 404;
}

const apis = {
  // Optional endpoint used by your JWT fallback flow
  async me(token: string): Promise<{ user_id?: number; id?: number }> {
    const res = await http.get('/auth/me', { headers: authHeader(token) });
    return res.data;
  },

  async getUser(token: string, userId: number): Promise<UserData> {
    const res = await http.get(`/user/${userId}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async getTodayRecommendation(token: string, userId: number): Promise<RecommendationData | null> {
    try {
      const res = await http.get(`/recommendation/${userId}`, {
        headers: authHeader(token),
      });
      return res.data;
    } catch (err) {
      if (isAxios404(err)) return null;
      throw err;
    }
  },

  async refreshRecommendation(token: string, userId: number): Promise<RecommendationData> {
    // force regenerate
    const res = await http.get(`/recommendation/${userId}`, {
      headers: authHeader(token),
      params: { force_regenerate: true },
    });
    return res.data;
  },

  async getHistory(token: string, userId: number, limit = 7): Promise<HistoryItem[]> {
    const res = await http.get(`/recommendations/history/${userId}`, {
      headers: authHeader(token),
      params: { limit },
    });

    // your backend returns { recommendations: [...] }
    return res.data?.recommendations || [];
  },

  async updateUserSettings(
    token: string,
    userId: number,
    payload: {
      pregnancy_week: number;
      preferences: string;
      regenerate_recommendation: boolean;
    }
  ): Promise<any> {
    const res = await http.put(`/user/${userId}/data`, payload, {
      headers: authHeader(token),
    });
    return res.data;
  },
};

export default apis;
