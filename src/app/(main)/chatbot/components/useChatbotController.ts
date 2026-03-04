"use client";

import { useEffect, useRef, useState } from "react";
import { getSession } from "@/lib/authentication";
import { useChatContext } from "@/app/(main)/chatbot/layout";
import apis from "../../../api/chatbot/api";

import { ChatResponse as ApiChatResponse } from "../../../api/chatbot/types";
import type { Message, SystemStats } from "../../../api/chatbot/types";

const WELCOME_MESSAGE: Message = {
  id: "1",
  content:
    "Hello! I'm your pregnancy advisor assistant. I'm here to help answer your questions about pregnancy, provide guidance and support you through this wonderful journey. How can I assist you today?",
  isUser: false,
  timestamp: new Date(),
  status: "sent",
};

export function useChatbotController() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const { activeSessionId, setActiveSessionId, refreshChatHistory } =
    useChatContext();

  // prevent stale welcome timestamp (not critical, but nice)
  const welcomeRef = useRef<Message>({
    ...WELCOME_MESSAGE,
    timestamp: new Date(),
  });

  const resetToNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      {
        ...welcomeRef.current,
        timestamp: new Date(),
      },
    ]);
  };

  const checkSystemHealth = async (jwtToken: string) => {
    try {
      const data = await apis.health(jwtToken);
      setIsConnected(data?.status === "healthy");
      setConnectionError(
        data?.status === "healthy" ? null : data?.error || "System not healthy"
      );
    } catch {
      setIsConnected(false);
      setConnectionError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  const fetchSystemStats = async (jwtToken: string) => {
    try {
      const data = await apis.stats(jwtToken);
      if (data?.knowledge_base_stats) {
        setSystemStats(data as any);
      }
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
    }
  };

  const loadSessionMessages = async (sessionId: number) => {
    if (!token) return;

    try {
      const data = await apis.getChatMessages(token, sessionId);

      if (data?.status === "success") {
        const formattedMessages: Message[] = [];

        if (!data.messages || data.messages.length === 0) {
          formattedMessages.push({
            ...welcomeRef.current,
            timestamp: new Date(),
          });
        } else {
          data.messages.forEach((m: any) => {
            if (m.message) {
              formattedMessages.push({
                id: `${m.id}_user`,
                content: m.message,
                isUser: true,
                timestamp: new Date(m.created_at),
                status: "sent",
              });
            }
            if (m.response) {
              formattedMessages.push({
                id: `${m.id}_bot`,
                content: m.response,
                isUser: false,
                timestamp: new Date(m.created_at),
                status: "sent",
              });
            }
          });
        }

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !token) return;

    const userMessage: Message = {
      id: Date.now().toString() + "_user",
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
      status: "sent",
    };

    const botMessage: Message = {
      id: Date.now().toString() + "_bot",
      content: "",
      isUser: false,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data: ApiChatResponse = await apis.chat(token, {
        message: messageContent,
        session_id: currentSessionId,
        top_k: 3,
        similarity_threshold: 0.1,
      });

      if (data?.status === "success") {
        if (data.session_id && !currentSessionId) {
          setCurrentSessionId(data.session_id);
          setActiveSessionId?.(data.session_id);
          await refreshChatHistory?.();
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, content: data.response, status: "sent" }
              : msg
          )
        );
      } else {
        throw new Error(data?.response || "Failed to get response");
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your message. Please try again.",
                status: "error",
              }
            : msg
        )
      );
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Init token + health/stats
  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getSession();
        if (session?.user?.token) {
          setToken(session.user.token);
          console.log("✅ JWT token loaded for ChatBot");
          checkSystemHealth(session.user.token);
          fetchSystemStats(session.user.token);
        } else {
          console.warn("⚠️ No session found — please log in first.");
          setConnectionError("Please log in to access the chatbot.");
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        setConnectionError("Authentication error. Please log in again.");
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle session switch from sidebar
  useEffect(() => {
    if (!token) return;

    if (activeSessionId && activeSessionId !== currentSessionId) {
      setCurrentSessionId(activeSessionId);
      loadSessionMessages(activeSessionId);
    } else if (activeSessionId === null) {
      resetToNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, token]);

  const retryHealth = () => {
    if (token) checkSystemHealth(token);
  };

  return {
    // state
    messages,
    inputMessage,
    isLoading,
    isConnected,
    systemStats,
    connectionError,
    token,

    // session
    currentSessionId,

    // actions
    setInputMessage,
    sendMessage,
    resetToNewChat,
    retryHealth,
  };
}
