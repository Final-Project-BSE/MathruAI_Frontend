"use client";

import { Send, MessageCircle, Loader2 } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isConnected: boolean;
  onTipClick: (tip: string) => void;
}

export default function ChatInput({
  inputMessage,
  onChange,
  onSubmit,
  isLoading,
  isConnected,
  onTipClick,
}: ChatInputProps) {
  const tips = [
    "What should I eat during pregnancy?",
    "Exercise during pregnancy",
    "Common pregnancy symptoms",
    "Prenatal vitamins guide",
  ];

  return (
    <div className="fixed bottom-0 left-0 md:left-[16rem] md:right-[2rem] bg-white border-t border-pink-100 p-4 z-50">
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              isConnected
                ? "Ask me anything about pregnancy..."
                : "Please wait, connecting..."
            }
            disabled={isLoading || !isConnected}
            className="w-full px-4 py-3 pr-12 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 bg-pink-50/30"
          />
          <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim() || !isConnected}
          className="px-6 py-3 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-full hover:from-pink-400 hover:to-pink-500 disabled:opacity-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {tips.map((tip, index) => (
          <button
            key={index}
            onClick={() => onTipClick(tip)}
            disabled={isLoading || !isConnected}
            className="px-3 py-1 text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {tip}
          </button>
        ))}
      </div>
    </div>
  );
}
