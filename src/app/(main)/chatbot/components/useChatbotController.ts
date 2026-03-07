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

function generateChatTitle(message: string) {
  const cleaned = message.replace(/\s+/g, " ").trim();

  if (!cleaned) return "New chat";

  return cleaned.length > 45 ? `${cleaned.slice(0, 45)}...` : cleaned;
}

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

  const loadSessionMessages = async (sessionId: number, jwtToken: string) => {
    try {
      const data = await apis.getChatMessages(jwtToken, sessionId);

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

    const trimmedMessage = messageContent.trim();
    const sessionIdToUse = activeSessionId ?? currentSessionId;
    const isFirstUserMessageInSession = messages.filter((m) => m.isUser).length === 0;

    const userMessage: Message = {
      id: `${Date.now()}_user`,
      content: trimmedMessage,
      isUser: true,
      timestamp: new Date(),
      status: "sent",
    };

    const botMessage: Message = {
      id: `${Date.now()}_bot`,
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
        message: trimmedMessage,
        session_id: sessionIdToUse,
        top_k: 3,
        similarity_threshold: 0.1,
      });

      if (data?.status === "success") {
        const resolvedSessionId = Number(
          data.session_id ?? sessionIdToUse ?? null
        );

        if (resolvedSessionId && resolvedSessionId !== currentSessionId) {
          setCurrentSessionId(resolvedSessionId);
        }

        if (resolvedSessionId && resolvedSessionId !== activeSessionId) {
          setActiveSessionId(resolvedSessionId);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, content: data.response, status: "sent" }
              : msg
          )
        );

        if (resolvedSessionId && isFirstUserMessageInSession) {
          const generatedTitle = generateChatTitle(trimmedMessage);

          try {
            await apis.updateChat(resolvedSessionId, token, {
              session_name: generatedTitle,
            });
          } catch (titleError) {
            console.error("Failed to update chat title:", titleError);
          }
        }

        await refreshChatHistory();
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getSession();

        if (session?.user?.token) {
          const jwt = session.user.token;
          setToken(jwt);
          console.log("✅ JWT token loaded for ChatBot");
          checkSystemHealth(jwt);
          fetchSystemStats(jwt);
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
  }, []);

  useEffect(() => {
    if (!token) return;

    if (activeSessionId !== null) {
      setCurrentSessionId(activeSessionId);
      loadSessionMessages(activeSessionId, token);
    } else {
      resetToNewChat();
    }
  }, [activeSessionId, token]);

  const retryHealth = () => {
    if (token) checkSystemHealth(token);
  };

  return {
    messages,
    inputMessage,
    isLoading,
    isConnected,
    systemStats,
    connectionError,
    token,
    currentSessionId,
    setInputMessage,
    sendMessage,
    resetToNewChat,
    retryHealth,
  };
}