"use client";

import * as React from "react";
import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import {
  IconMessage,
  IconPlus,
  IconTrash,
  IconDots,
  IconInnerShadowTop,
  IconClock,
  IconLoader,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/authentication";

import { ChatSession as ApiChatSession } from "../app/api/chatbot/types";
import apis from "../app/api/chatbot/api";


// Types
interface ChatSession {
  id: number;
  session_id?: number;
  session_name: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

export interface ChatSidebarRef {
  refreshChatHistory: () => Promise<void>;
}

interface ChatSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSessionId?: number | null;
  onSessionSelect?: (sessionId: number | null) => void;
  onNewChat?: () => void;
  onRefreshNeeded?: () => void;
}

// Helper Functions
function groupSessionsByDate(sessions: ChatSession[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups = {
    today: [] as ChatSession[],
    yesterday: [] as ChatSession[],
    thisWeek: [] as ChatSession[],
    older: [] as ChatSession[],
  };

  sessions.forEach((session) => {
    const sessionDate = new Date(session.last_activity);
    const sessionDateOnly = new Date(
      sessionDate.getFullYear(),
      sessionDate.getMonth(),
      sessionDate.getDate()
    );

    if (sessionDateOnly.getTime() === today.getTime()) {
      groups.today.push(session);
    } else if (sessionDateOnly.getTime() === yesterday.getTime()) {
      groups.yesterday.push(session);
    } else if (sessionDateOnly.getTime() >= weekAgo.getTime()) {
      groups.thisWeek.push(session);
    } else {
      groups.older.push(session);
    }
  });

  return groups;
}

// Chat History Item
function ChatHistoryItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: {
  session: ChatSession;
  isActive?: boolean;
  onSelect: (sessionId: number) => void;
  onDelete: (sessionId: number) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener("click", handleDocumentClick);
      return () => document.removeEventListener("click", handleDocumentClick);
    }
  }, [showOptions]);

  return (
    <SidebarMenuItem>
      <div
        onClick={() => onSelect(session.id)}
        className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-pink-50 ${
          isActive ? "bg-pink-100 border-l-4 border-pink-500" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <IconMessage className="h-4 w-4 text-pink-500 flex-shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {session.session_name || `Chat ${session.session_id}`}
              </h4>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <IconClock className="h-3 w-3" />
                {formatTime(session.last_activity)}
              </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                {session.message_count}
              </span>
            </div>
          </div>

          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((s) => !s);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
            >
              <IconDots className="h-4 w-4 text-gray-500" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <IconTrash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarMenuItem>
  );
}

// normalize backend chat sessions into the UI ChatSession shape
function normalizeSessions(sessions: ApiChatSession[]): ChatSession[] {
  return sessions.map((s: any) => ({
    ...s,
    session_id: s.session_id ?? s.id,
    last_activity: s.updated_at || s.last_activity || s.created_at,
  }));
}

// Main Sidebar Component
export const ChatSidebar = forwardRef<ChatSidebarRef, ChatSidebarProps>(
  ({ activeSessionId, onSessionSelect, onNewChat, ...props }, ref) => {
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingSession, setCreatingSession] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const ensureToken = useCallback(async (): Promise<string | null> => {
      if (token) return token;
      const session = await getSession();
      const jwt = session?.user?.token || null;
      if (jwt) setToken(jwt);
      return jwt;
    }, [token]);

    const fetchChatSessions = useCallback(async () => {
      const jwt = await ensureToken();
      if (!jwt) {
        setError("Please log in to use the chatbot.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await apis.listChats(jwt);

        if (data.status === "success") {
          setChatSessions(normalizeSessions(data.sessions || []));
        } else {
          setError(data.message || "Failed to load chat sessions");
        }
      } catch (e: any) {
        setError(e?.message || "Unable to connect to server");
      } finally {
        setLoading(false);
      }
    }, [ensureToken]);

    useImperativeHandle(ref, () => ({
      refreshChatHistory: fetchChatSessions,
    }));

    useEffect(() => {
      // preload token once
      const initialize = async () => {
        await ensureToken();
      };
      initialize();
    }, [ensureToken]);

    useEffect(() => {
      if (token) fetchChatSessions();
    }, [token, fetchChatSessions]);

    const handleNewChat = async () => {
      const jwt = await ensureToken();
      if (!jwt) return setError("Please log in first");

      setCreatingSession(true);
      try {
        const data = await apis.createChat(jwt, {
          session_name: `Chat ${new Date().toLocaleDateString()}`,
        });

        if (data.status === "success") {
          await fetchChatSessions();
          onSessionSelect?.(data.session_id);
          onNewChat?.();
        } else {
          setError(data.message || "Failed to create new chat");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to create new chat");
      } finally {
        setCreatingSession(false);
      }
    };

    const handleDeleteChat = async (sessionId: number) => {
      const jwt = await ensureToken();
      if (!jwt) return setError("Please log in first");
      if (!confirm("Are you sure you want to delete this chat?")) return;

      try {
        const data = await apis.deleteChat(jwt, sessionId);

        if (data.status === "success") {
          setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
          if (activeSessionId === sessionId) onSessionSelect?.(null);
        } else {
          setError(data.message || "Failed to delete chat");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to delete chat");
      }
    };

    const groupedSessions = groupSessionsByDate(chatSessions);

    return (
      <Sidebar reserveSpace={false} collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button type="button" className="flex items-center gap-2">
                  <IconInnerShadowTop className="!size-5 text-pink-500" />
                  <span className="font-semibold bg-gradient-to-br from-pink-500 to-pink-500 bg-clip-text text-transparent">
                    Pregnancy Advisor
                  </span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="px-3 py-2">
            <button
              onClick={handleNewChat}
              disabled={creatingSession}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-400 to-pink-400 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md disabled:opacity-50"
            >
              {creatingSession ? (
                <IconLoader className="h-5 w-5 animate-spin" />
              ) : (
                <IconPlus className="h-5 w-5" />
              )}
              <span>{creatingSession ? "Creating..." : "New Chat"}</span>
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          {error && (
            <div className="mx-3 mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {error}
              <button
                onClick={fetchChatSessions}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 font-medium px-3 py-2 flex items-center justify-between">
              <span>Chat History</span>
              <button
                onClick={fetchChatSessions}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <IconLoader
                  className={`h-3 w-3 text-gray-400 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </SidebarGroupLabel>

            <SidebarGroupContent className="space-y-2">
              {loading && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Loading chats...
                </div>
              )}

              {!loading &&
                Object.entries(groupedSessions).map(([label, sessions]) =>
                  sessions.length > 0 ? (
                    <div key={label}>
                      <div className="text-xs font-semibold text-gray-400 uppercase px-3 mt-3 mb-1">
                        {label === "today"
                          ? "Today"
                          : label === "yesterday"
                          ? "Yesterday"
                          : label === "thisWeek"
                          ? "This Week"
                          : "Older"}
                      </div>
                      {sessions.map((session) => (
                        <ChatHistoryItem
                          key={session.id}
                          session={session}
                          isActive={session.id === activeSessionId}
                          onSelect={(id) => onSessionSelect?.(id)}
                          onDelete={handleDeleteChat}
                        />
                      ))}
                    </div>
                  ) : null
                )}

              {!loading && chatSessions.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No chat history found.
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 text-xs text-gray-400 text-center">
          <span>Pregnancy Advisor © 2025</span>
        </SidebarFooter>
      </Sidebar>
    );
  }
);

ChatSidebar.displayName = "ChatSidebar";
