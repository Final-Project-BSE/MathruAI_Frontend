"use client";

import Container from "@/components/shared/container";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChatbotController } from "./components/useChatbotController";
import { ChartContainer } from "@/components/ui/chart";
import ChatContainer from "@/components/shared/ChatContainer";

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
    <ChatContainer title="Pregnancy Advisor ChatBot">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
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
      </div>
    </ChatContainer>
  );
}