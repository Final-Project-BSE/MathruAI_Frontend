import type {
  ChatbotUploadResponse,
  DailyRecommendationUploadResponse,
  UserResponseDto,
  UserUpdateRequest,
} from "./types";

const JAVA_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081"
).replace(/\/$/, "");

const CHATBOT_API_BASE_URL = (
  process.env.NEXT_PUBLIC_CHATBOT_API_URL ||
  process.env.NEXT_PUBLIC_AI_API_URL ||
  "http://127.0.0.1:5000/api"
).replace(/\/$/, "");

const DAILY_RECOMMENDATION_API_BASE_URL = (
  process.env.NEXT_PUBLIC_DAILY_RECOMMENDATION_API_URL ||
  `${process.env.NEXT_PUBLIC_AI_API_URL || "http://127.0.0.1:5000"}/pregnancy`
).replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function jsonHeaders(token: string) {
  return {
    ...authHeaders(token),
    "Content-Type": "application/json",
  };
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}

async function javaRequest<T>(
  path: string,
  method: HttpMethod,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${JAVA_API_BASE_URL}${path}`, {
    method,
    headers: jsonHeaders(token),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

async function uploadPdf<T>(
  url: string,
  token: string,
  file: File,
  fieldName = "file"
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Upload failed";
    throw new Error(message);
  }

  return data as T;
}

export const adminApi = {
  getAllUsers(token: string) {
    return javaRequest<UserResponseDto[]>("/api/users", "GET", token);
  },

  updateUser(token: string, id: number, payload: UserUpdateRequest) {
    return javaRequest<UserResponseDto>(`/api/users/${id}`, "PUT", token, payload);
  },

  deleteUser(token: string, id: number) {
    return javaRequest<string>(`/api/users/${id}`, "DELETE", token);
  },

  uploadChatbotKnowledgeBase(token: string, file: File) {
    return uploadPdf<ChatbotUploadResponse>(
      `${CHATBOT_API_BASE_URL}/upload`,
      token,
      file
    );
  },

  uploadDailyRecommendationKnowledgeBase(token: string, file: File) {
    return uploadPdf<DailyRecommendationUploadResponse>(
      `${DAILY_RECOMMENDATION_API_BASE_URL}/upload-pdf`,
      token,
      file
    );
  },

  getChatbotUploadHistory(token: string) {
    return javaRequest<unknown>("/__unused__", "GET", token).catch(() => null);
  },
};

export default adminApi;
