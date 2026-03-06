"use client";

import { createContext, useContext, useState, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar, ChatSidebarRef } from "@/components/chat-sidebar";

interface ChatContextType {
  activeSessionId: number | null;
  setActiveSessionId: (id: number | null) => void;
  refreshChatHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const sidebarRef = useRef<ChatSidebarRef>(null);

  const refreshChatHistory = async () => {
    await sidebarRef.current?.refreshChatHistory();
  };

  return (
    <ChatContext.Provider
      value={{
        activeSessionId,
        setActiveSessionId,
        refreshChatHistory,
      }}
    >
      <SidebarProvider>
        <ChatSidebar
          ref={sidebarRef}
          activeSessionId={activeSessionId}
          onSessionSelect={setActiveSessionId}
        />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </ChatContext.Provider>
  );
}