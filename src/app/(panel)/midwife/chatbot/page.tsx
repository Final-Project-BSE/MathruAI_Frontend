"use client";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChatbotController } from "./components/useChatbotController";

export default function ChatBotPage() {
  const {
    messages,
    inputMessage,
    isLoading,
    isConnected,
    connectionError,
    token,
    setInputMessage,
    sendMessage,
    retryHealth,
  } = useChatbotController();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="flex min-h-0 flex-1 bg-black">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-white/10 bg-[#060606] lg:rounded-none">
        <ChatHeader
          isConnected={isConnected}
          connectionError={connectionError}
          onRetry={retryHealth}
          canRetry={!!token}
        />

        <ChatMessages messages={messages} />

        <ChatInput
          inputMessage={inputMessage}
          onChange={setInputMessage}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isConnected={isConnected}
          onTipClick={setInputMessage}
        />
      </section>
    </div>
  );
}