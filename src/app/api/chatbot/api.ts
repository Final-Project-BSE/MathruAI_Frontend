import axios from "axios";

import type {
  ListChatsResponse,
  CreateChatResponse,
  DeleteChatResponse,
  GetChatMessagesResponse,
  HealthResponse,
  StatsResponse,
  ChatResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

const apis = {
  async listChats(token: string): Promise<ListChatsResponse> {
    const res = await http.get<ListChatsResponse>("/chats", {
      headers: authHeader(token),
    });
    return res.data;
  },

  async createChat(
    token: string,
    payload: { session_name: string }
  ): Promise<CreateChatResponse> {
    const res = await http.post<CreateChatResponse>("/chats", payload, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async deleteChat(
    token: string,
    sessionId: number
  ): Promise<DeleteChatResponse> {
    const res = await http.delete<DeleteChatResponse>(`/chats/${sessionId}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async getChatMessages(
    token: string,
    sessionId: number
  ): Promise<GetChatMessagesResponse> {
    const res = await http.get<GetChatMessagesResponse>(`/chats/${sessionId}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  async health(token: string): Promise<HealthResponse> {
    const res = await http.get<HealthResponse>("/health", {
      headers: authHeader(token),
    });
    return res.data;
  },

  async stats(token: string): Promise<StatsResponse> {
    const res = await http.get<StatsResponse>("/stats", {
      headers: authHeader(token),
    });
    return res.data;
  },

  updateChat: async (
    sessionId: number,
    token: string,
    payload: { session_name: string }
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chatbot/chats/${sessionId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update chat title");
    }

    return response.json();
  },

  async chat(
    token: string,
    payload: {
      message: string;
      session_id: number | null;
      top_k: number;
      similarity_threshold: number;
    }
  ): Promise<ChatResponse> {
    const res = await http.post<ChatResponse>("/chat", payload, {
      headers: authHeader(token),
    });
    return res.data;
  },
};

export default apis;
