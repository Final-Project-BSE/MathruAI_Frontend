"use client";

import { useState, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar, ChatSidebarRef } from "@/components/chat-sidebar";
import { ChatContext } from "./components/ChatContext";

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