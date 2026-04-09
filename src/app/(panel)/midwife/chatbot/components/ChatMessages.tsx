"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../../../../api/chatbot/types";

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#030303] px-3 py-4 sm:px-5">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-fit max-w-[94%] rounded-3xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.22)] sm:max-w-[82%] lg:max-w-[70%] ${
                message.isUser
                  ? "rounded-br-lg bg-[#d04f51] text-white"
                  : "rounded-bl-lg border border-white/10 bg-white/[0.05] text-white"
              }`}
            >
              <div className="max-w-none overflow-x-auto text-xs leading-7 break-words [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/30 [&_pre]:p-3 [&_code]:break-words [&_strong]:font-semibold">
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

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}