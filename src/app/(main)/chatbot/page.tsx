"use client";

import Container from "@/components/shared/container";

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
    <Container title="Pregnancy Advisor ChatBot">
      <div className="flex flex-col">
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
    </Container>
  );
}
