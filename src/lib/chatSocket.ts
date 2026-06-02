"use client";

import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessageResponseDto } from "@/app/api/chat/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";

type ConnectOptions = {
  token: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onConversationMessage?: (message: ChatMessageResponseDto) => void;
  onUnreadCount?: (count: number) => void;
  onError?: (message: string) => void;
};

export function createChatClient({
  token,
  onConnect,
  onDisconnect,
  onConversationMessage,
  onUnreadCount,
  onError,
}: ConnectOptions) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: () => {},
  });

  client.onConnect = () => {
    onConnect?.();
  };

  client.onDisconnect = () => {
    onDisconnect?.();
  };

  client.onWebSocketClose = () => {
    onDisconnect?.();
  };

  client.onStompError = (frame) => {
    const message =
      frame.headers["message"] || frame.body || "Chat connection failed.";
    onError?.(message);
  };

  client.onWebSocketError = () => {
    onError?.("WebSocket connection error.");
  };

  function subscribeConversation(conversationId: number): StompSubscription {
    if (!client.connected) {
      throw new Error("Chat socket is not connected.");
    }

    return client.subscribe(`/topic/chat/${conversationId}`, (frame) => {
      const payload = JSON.parse(frame.body) as ChatMessageResponseDto;
      onConversationMessage?.(payload);
    });
  }

  function subscribeUnread(userId: number): StompSubscription {
    if (!client.connected) {
      throw new Error("Chat socket is not connected.");
    }

    return client.subscribe(`/topic/chat-unread/${userId}`, (frame) => {
      const count = Number(frame.body);
      onUnreadCount?.(Number.isFinite(count) ? count : 0);
    });
  }

  function publishMessage(conversationId: number, content: string) {
    if (!client.connected) {
      throw new Error("Chat socket is still connecting. Try again in a moment.");
    }

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        conversationId,
        content,
      }),
    });
  }

  return {
    client,
    subscribeConversation,
    subscribeUnread,
    publishMessage,
  };
}