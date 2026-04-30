import axios from "axios";
import type {
  BreastfeedingSessionRequestDto,
  BreastfeedingSessionResponseDto,
  BreastfeedingIssueRequestDto,
  BreastfeedingIssueResponseDto,
  BreastfeedingTipRequestDto,
  BreastfeedingTipResponseDto,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ===================== DEBUG INTERCEPTORS =====================

api.interceptors.request.use(
  (config) => {
    console.log(
      `[Breastfeeding API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.headers
    );
    return config;
  },
  (error) => {
    console.error("[Breastfeeding API Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `[Breastfeeding API Response] ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error("[Breastfeeding API Response Error]", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// ===================== AUTH HEADER =====================

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// ===================== SESSION APIs =====================

export const getSessions = async (
  token: string
): Promise<BreastfeedingSessionResponseDto[]> => {
  const res = await api.get<BreastfeedingSessionResponseDto[]>(
    "/api/breastfeeding/sessions",
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const createSession = async (
  token: string,
  data: BreastfeedingSessionRequestDto
): Promise<BreastfeedingSessionResponseDto> => {
  const res = await api.post<BreastfeedingSessionResponseDto>(
    "/api/breastfeeding/sessions",
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const updateSession = async (
  token: string,
  sessionId: string,
  data: BreastfeedingSessionRequestDto
): Promise<BreastfeedingSessionResponseDto> => {
  const res = await api.put<BreastfeedingSessionResponseDto>(
    `/api/breastfeeding/sessions/${sessionId}`,
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const deleteSession = async (
  token: string,
  sessionId: string
): Promise<void> => {
  await api.delete(`/api/breastfeeding/sessions/${sessionId}`, {
    headers: authHeader(token),
  });
};

// ===================== ISSUE APIs =====================

export const getIssues = async (
  token: string
): Promise<BreastfeedingIssueResponseDto[]> => {
  const res = await api.get<BreastfeedingIssueResponseDto[]>(
    "/api/breastfeeding/issues",
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const getUnresolvedIssues = async (
  token: string
): Promise<BreastfeedingIssueResponseDto[]> => {
  const res = await api.get<BreastfeedingIssueResponseDto[]>(
    "/api/breastfeeding/issues/unresolved",
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const createIssue = async (
  token: string,
  data: BreastfeedingIssueRequestDto
): Promise<BreastfeedingIssueResponseDto> => {
  const res = await api.post<BreastfeedingIssueResponseDto>(
    "/api/breastfeeding/issues",
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const updateIssue = async (
  token: string,
  issueId: string,
  data: BreastfeedingIssueRequestDto
): Promise<BreastfeedingIssueResponseDto> => {
  const res = await api.put<BreastfeedingIssueResponseDto>(
    `/api/breastfeeding/issues/${issueId}`,
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const deleteIssue = async (
  token: string,
  issueId: string
): Promise<void> => {
  await api.delete(`/api/breastfeeding/issues/${issueId}`, {
    headers: authHeader(token),
  });
};

// ===================== TIP APIs =====================

export const getAllActiveTips = async (
  token: string
): Promise<BreastfeedingTipResponseDto[]> => {
  const res = await api.get<BreastfeedingTipResponseDto[]>(
    "/api/breastfeeding/tips",
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const createTip = async (
  token: string,
  data: BreastfeedingTipRequestDto
): Promise<BreastfeedingTipResponseDto> => {
  const res = await api.post<BreastfeedingTipResponseDto>(
    "/api/breastfeeding/tips",
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const updateTip = async (
  token: string,
  tipId: string,
  data: BreastfeedingTipRequestDto
): Promise<BreastfeedingTipResponseDto> => {
  const res = await api.put<BreastfeedingTipResponseDto>(
    `/api/breastfeeding/tips/${tipId}`,
    data,
    {
      headers: authHeader(token),
    }
  );
  return res.data;
};

export const deleteTip = async (
  token: string,
  tipId: string
): Promise<void> => {
  await api.delete(`/api/breastfeeding/tips/${tipId}`, {
    headers: authHeader(token),
  });
};

// ===================== DEFAULT EXPORT =====================

const breastfeedingApi = {
  // Sessions
  getSessions,
  createSession,
  updateSession,
  deleteSession,

  // Issues
  getIssues,
  getUnresolvedIssues,
  createIssue,
  updateIssue,
  deleteIssue,

  // Tips
  getAllActiveTips,
  createTip,
  updateTip,
  deleteTip,
};

export default breastfeedingApi;