"use client";

import { createContext, useContext } from "react";

export interface ChatContextType {
  activeSessionId: number | null;
  setActiveSessionId: (id: number | null) => void;
  refreshChatHistory: () => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }

  return context;
}