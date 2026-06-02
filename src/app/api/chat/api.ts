import type {
  ChatConversationResponseDto,
  ChatMessageResponseDto,
  ChatOpenConversationRequestDto,
  UnreadCountResponseDto,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";

type HttpMethod = "GET" | "POST" | "PATCH";

async function request<T>(
  path: string,
  method: HttpMethod,
  token?: string,
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
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

export const chatApi = {
  getMyConversations: (currentUserId: number, token?: string) =>
    request<ChatConversationResponseDto[]>(
      `/api/chat/conversations/${currentUserId}`,
      "GET",
      token
    ),

  openConversation: (
    currentUserId: number,
    payload: ChatOpenConversationRequestDto,
    token?: string
  ) =>
    request<ChatConversationResponseDto>(
      `/api/chat/conversations/open/${currentUserId}`,
      "POST",
      token,
      payload
    ),

  getMessages: (
    conversationId: number,
    currentUserId: number,
    token?: string
  ) =>
    request<ChatMessageResponseDto[]>(
      `/api/chat/conversations/${conversationId}/messages/${currentUserId}`,
      "GET",
      token
    ),

  markAsRead: (
    conversationId: number,
    currentUserId: number,
    token?: string
  ) =>
    request<string>(
      `/api/chat/conversations/${conversationId}/read/${currentUserId}`,
      "PATCH",
      token
    ),

  getUnreadCount: (currentUserId: number, token?: string) =>
    request<UnreadCountResponseDto>(
      `/api/chat/unread/${currentUserId}`,
      "GET",
      token
    ),
};