"use client";

import { useRef, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  ChatSidebarMidwife,
  ChatSidebarRef,
} from "@/components/chat-sidebar-midwife";
import { PanelLeft } from "lucide-react";
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
        <div className="flex min-h-[calc(100dvh-4rem)] w-full bg-black text-white">
          <ChatSidebarMidwife
            ref={sidebarRef}
            activeSessionId={activeSessionId}
            onSessionSelect={setActiveSessionId}
            className="top-16 h-[calc(100dvh-4rem)] border-r border-white/10 bg-[#050505] text-white"
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#080808]/95 px-3 py-3 backdrop-blur lg:hidden">
              <SidebarTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]">
                <PanelLeft className="h-5 w-5" />
              </SidebarTrigger>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  HelloBump
                </p>
                <p className="text-xs text-white/45">Pregnancy assistant</p>
              </div>
            </div>

            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ChatContext.Provider>
  );
}