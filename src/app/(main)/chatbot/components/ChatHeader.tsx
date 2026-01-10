"use client";

import { AlertCircle, Baby, Heart } from "lucide-react";

interface ChatHeaderProps {
  isConnected: boolean;
  connectionError: string | null;
  onRetry: () => void;
  canRetry: boolean;
}

export default function ChatHeader({
  isConnected,
  connectionError,
  onRetry,
  canRetry,
}: ChatHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-pink-100 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-2 rounded-full">
            <Baby className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              HelloBump
              <Heart className="h-5 w-5 text-pink-500" />
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`flex items-center gap-1 ${
                  isConnected ? "text-green-600" : "text-red-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {connectionError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{connectionError}</span>
          <button
            onClick={onRetry}
            disabled={!canRetry}
            className="ml-auto text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded disabled:opacity-60"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
