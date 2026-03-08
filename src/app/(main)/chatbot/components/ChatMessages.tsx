"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import type { Message } from "../../../api/chatbot/types";

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case "sent":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "error":
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-[#fed2cc]">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.isUser ? "justify-end" : "justify-start"
          } animate-fadeIn`}
        >
          <div
            className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              message.isUser
                ? "bg-[#d04f51] text-white rounded-br-sm"
                : "bg-white text-gray-800 rounded-bl-sm border border-pink-100"
            }`}
          >
            <div className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content || (message.status === "sending" && "Thinking...")}
            </div>
            <div
              className={`flex items-center justify-between mt-1 pt-2 border-t ${
                message.isUser ? "border-white/20" : "border-gray-100"
              }`}
            >
              <span
                className={`text-[9px] ${
                  message.isUser ? "text-white/70" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
              {getStatusIcon(message.status)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
