"use client";

import { createContext, useContext, useState, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar, ChatSidebarRef } from "@/components/chat-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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

  const handleNewChat = () => {
    setActiveSessionId(null);
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
          onNewChat={handleNewChat}
        />
        <main className="w-full">
          <SidebarTrigger />
           <AppSidebar/>
          {children}
        </main>
      </SidebarProvider>
    </ChatContext.Provider>
  );
}