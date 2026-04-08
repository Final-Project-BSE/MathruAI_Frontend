"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import "./ai-assistant-card.css";
import apis from "@/app/api/chatbot/api";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  status?: "sending" | "sent" | "error";
  timestamp: Date;
}

interface AIAssistantCardProps {
  token: string;
  sessionId?: number | null;
  onSessionChange?: (sessionId: number | null) => void;
  onResponse?: (response: string) => void;
  onError?: (message: string) => void;
  chatbotPath?: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  content: "Hello! I'm your AI assistant. Ask me anything and I'll help you.",
  isUser: false,
  status: "sent",
  timestamp: new Date(),
};

export default function AIAssistantCard({
  token,
  sessionId = null,
  onSessionChange,
  onResponse,
  onError,
  chatbotPath = "/midwife/chatbot",
}: AIAssistantCardProps) {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const hasNewMessage = messages.length > prevMessageCountRef.current;

    if (hasNewMessage) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }

    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Loader2 className="h-3.5 w-3.5 animate-spin text-white/35" />;
      case "sent":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "error":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
      default:
        return null;
    }
  };

  const handleReset = () => {
    if (isLoading) return;

    setMessages([
      {
        ...WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    onSessionChange?.(null);
  };

  const handleOpenChatbotPage = () => {
    router.push(chatbotPath);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();

    if (!trimmed || isLoading || !token) return;

    const now = Date.now();
    const currentTime = new Date();

    const userMessageId = `${now}_user`;
    const botMessageId = `${now}_bot`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      content: trimmed,
      isUser: true,
      status: "sent",
      timestamp: currentTime,
    };

    const botMessage: ChatMessage = {
      id: botMessageId,
      content: "",
      isUser: false,
      status: "sending",
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await apis.chat(token, {
        message: trimmed,
        session_id: sessionId,
        top_k: 3,
        similarity_threshold: 0.1,
      });

      if (res.status !== "success") {
        throw new Error(res.response || "Failed to get AI response");
      }

      const resolvedSessionId =
        typeof res.session_id === "number" ? res.session_id : sessionId;

      if (resolvedSessionId !== sessionId) {
        onSessionChange?.(resolvedSessionId ?? null);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: res.response,
                status: "sent",
                timestamp: new Date(),
              }
            : msg
        )
      );

      onResponse?.(res.response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the message";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I ran into an error while processing your message. Please try again.",
                status: "error",
                timestamp: new Date(),
              }
            : msg
        )
      );

      onError?.(message);
      console.error("AI Assistant Card error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSend();
    }
  };

  const showHero =
    messages.length === 1 &&
    messages[0].id === "welcome" &&
    !messages.some((m) => m.isUser);

  return (
    <section className="flex w-full flex-col rounded-[20px] border border-white/10 bg-[#0b0b0f] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.42)] sm:rounded-[24px] sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[16px] font-semibold tracking-tight sm:text-[18px]">
            AI Assistant
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            title="Reset"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenChatbotPage}
            title="Open full page"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showHero ? (
        <div className="flex flex-1 flex-col items-center justify-center pt-5 sm:pt-6">
          <div className="orb-scene mb-4 scale-90 sm:scale-100">
            <div className="orb-glow" />
            <div className="orb-aura" />
            <div className="orb-ring orb-ring-1" />
            <div className="orb-ring orb-ring-2" />
            <div className="orb-ring orb-ring-3" />

            <div className="orb-wrapper">
              <div className="orb-core" />
              <div className="orb-highlight" />
            </div>

            <div className="orb-particle orb-particle-1" />
            <div className="orb-particle orb-particle-2" />
            <div className="orb-particle orb-particle-3" />
          </div>

          <div className="assistant-status mb-4 mt-4">
            <span className="status-dot" />
            <span className="thinking-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>

          <p className="text-[12px] text-white/60 sm:text-[13px]">Hi, Masud</p>
          <h2 className="mt-1 text-center text-[22px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[25px]">
            How can I help you?
          </h2>
          <p className="mt-2 text-center text-[11px] text-white/45 sm:text-[12px]">
            {isLoading ? "Thinking..." : "Ask anything. I’m ready."}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex-1 overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="chat-scroll max-h-[260px] overflow-y-auto bg-[#030303] px-1 py-2 pr-1"
          >
            <div className="flex w-full flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`w-fit max-w-[94%] rounded-3xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.22)] sm:max-w-[82%] lg:max-w-[75%] ${
                      message.isUser
                        ? "rounded-br-lg bg-[#f2875b] text-white"
                        : "rounded-bl-lg border border-white/10 bg-white/[0.05] text-white"
                    }`}
                  >
                    <div className="max-w-none overflow-x-auto text-xs leading-7 break-words sm:text-[13px] [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/30 [&_pre]:p-3 [&_code]:break-words [&_strong]:font-semibold">
                      <ReactMarkdown>
                        {message.content ||
                          (message.status === "sending" ? "Thinking..." : "")}
                      </ReactMarkdown>
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between gap-3 border-t pt-2 ${
                        message.isUser ? "border-white/15" : "border-white/10"
                      }`}
                    >
                      <span
                        className={`text-[10px] ${
                          message.isUser ? "text-white/70" : "text-white/45"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                      {getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 rounded-full border border-white/8 bg-[#141419] p-1.5 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <input
          type="text"
          placeholder={token ? "Ask something..." : "Loading session..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !token}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim() || !token}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2875b] text-white transition duration-200 hover:scale-[1.05] hover:bg-[#ff9369] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}