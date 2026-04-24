"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { chatApi } from "@/app/api/chat/api";
import type {
  ChatConversationResponseDto,
  ChatMessageResponseDto,
} from "@/app/api/chat/types";
import { createChatClient } from "@/lib/chatSocket";

type Theme = "light" | "dark";

type Props = {
  open: boolean;
  onClose: () => void;
  targetUserId?: number | null;
  theme: Theme;
};

function formatTime(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MessagesPopup({
  open,
  onClose,
  targetUserId,
  theme,
}: Props) {
  const isLight = theme === "light";

  const [token, setToken] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<
    ChatConversationResponseDto[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversationResponseDto | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const socketRef = useRef<ReturnType<typeof createChatClient> | null>(null);
  const conversationSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(
    null
  );
  const unreadSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const selectedConversationIdRef = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversation?.id || null;
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function bootstrap() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!jwt) {
          throw new Error("You are not authenticated. Please sign in again.");
        }

        const me = await getcuruser(jwt);
        if (!active) return;

        setToken(jwt);
        setCurrentUserId(me.id);

        let list = await chatApi.getMyConversations(me.id, jwt);

        if (targetUserId) {
          const opened = await chatApi.openConversation(
            me.id,
            { targetUserId },
            jwt
          );

          const exists = list.some((item) => item.id === opened.id);
          list = exists
            ? list.map((item) => (item.id === opened.id ? opened : item))
            : [opened, ...list];

          if (active) setSelectedConversation(opened);
        } else if (active) {
          setSelectedConversation(list[0] || null);
        }

        if (!active) return;
        setConversations(list);

        const socket = createChatClient({
          token: jwt,

          onConnect: () => {
            setSocketReady(true);
            setError("");

            try {
              unreadSubscriptionRef.current?.unsubscribe();
              unreadSubscriptionRef.current = socket.subscribeUnread(me.id);
            } catch {
              // Retry on next reconnect.
            }

            const activeConversationId = selectedConversationIdRef.current;
            if (activeConversationId) {
              try {
                conversationSubscriptionRef.current?.unsubscribe();
                conversationSubscriptionRef.current =
                  socket.subscribeConversation(activeConversationId);
              } catch {
                // Conversation effect will retry.
              }
            }
          },

          onDisconnect: () => {
            setSocketReady(false);
          },

          onError: (message) => {
            setError(message);
            setSocketReady(false);
          },

          onConversationMessage: (message) => {
            setMessages((prev) => {
              const exists = prev.some((item) => item.id === message.id);
              if (exists) return prev;

              if (
                selectedConversationIdRef.current &&
                selectedConversationIdRef.current !== message.conversationId
              ) {
                return prev;
              }

              return [...prev, message];
            });

            setConversations((prev) => {
              const next = prev.map((item) =>
                item.id === message.conversationId
                  ? {
                      ...item,
                      lastMessage: message.content,
                      lastMessageAt: message.createdAt,
                      unreadCount:
                        message.receiverId === me.id &&
                        selectedConversationIdRef.current !==
                          message.conversationId
                          ? item.unreadCount + 1
                          : item.unreadCount,
                    }
                  : item
              );

              return [...next].sort((a, b) => {
                const aTime = a.lastMessageAt
                  ? new Date(a.lastMessageAt).getTime()
                  : 0;
                const bTime = b.lastMessageAt
                  ? new Date(b.lastMessageAt).getTime()
                  : 0;
                return bTime - aTime;
              });
            });
          },
        });

        socketRef.current = socket;
        socket.client.activate();
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load chats.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void bootstrap();

    return () => {
      active = false;
      conversationSubscriptionRef.current?.unsubscribe();
      unreadSubscriptionRef.current?.unsubscribe();
      socketRef.current?.client.deactivate();
      socketRef.current = null;
      setSocketReady(false);
    };
  }, [open, targetUserId]);

  useEffect(() => {
    if (!open || !selectedConversation || !currentUserId || !token) return;

    let active = true;

    async function loadMessages() {
      try {
        setError("");

        const list = await chatApi.getMessages(
          selectedConversation.id,
          currentUserId,
          token
        );

        if (!active) return;

        setMessages(list);

        await chatApi.markAsRead(
          selectedConversation.id,
          currentUserId,
          token
        );

        setConversations((prev) =>
          prev.map((item) =>
            item.id === selectedConversation.id
              ? { ...item, unreadCount: 0 }
              : item
          )
        );

        conversationSubscriptionRef.current?.unsubscribe();
        conversationSubscriptionRef.current = null;

        if (socketRef.current?.client.connected) {
          conversationSubscriptionRef.current =
            socketRef.current.subscribeConversation(selectedConversation.id);
        }
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load messages."
        );
      }
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, [open, selectedConversation?.id, currentUserId, token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedOtherUserName = useMemo(() => {
    if (!selectedConversation) return "";

    const { firstName, lastName, email } = selectedConversation.otherUser;
    return `${firstName || ""} ${lastName || ""}`.trim() || email;
  }, [selectedConversation]);

  async function handleSend() {
    if (!socketRef.current || !selectedConversation || !text.trim()) return;

    if (!socketRef.current.client.connected) {
      setError("Chat is still connecting. Try again in a moment.");
      return;
    }

    try {
      setSending(true);
      socketRef.current.publishMessage(selectedConversation.id, text.trim());
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
      <div
        className={cn(
          "flex h-[min(760px,92vh)] w-full max-w-6xl overflow-hidden rounded-2xl border shadow-2xl",
          isLight
            ? "border-neutral-200 bg-white text-neutral-900"
            : "border-white/10 bg-[#050505] text-white"
        )}
      >
        <aside
          className={cn(
            "hidden w-[320px] border-r md:block",
            isLight ? "border-neutral-200" : "border-white/10"
          )}
        >
          <div
            className={cn(
              "border-b p-4",
              isLight ? "border-neutral-200" : "border-white/10"
            )}
          >
            <h2 className="text-lg font-semibold">Messages</h2>
            <p className={cn("text-sm", isLight ? "text-neutral-500" : "text-white/45")}>
              Assigned chat only
            </p>
          </div>

          <div className="h-[calc(100%-73px)] overflow-y-auto">
            {loading ? (
              <div className={cn("p-4 text-sm", isLight ? "text-neutral-500" : "text-white/45")}>
                Loading messages...
              </div>
            ) : conversations.length === 0 ? (
              <div className={cn("p-4 text-sm", isLight ? "text-neutral-500" : "text-white/45")}>
                No conversations available.
              </div>
            ) : (
              conversations.map((conversation) => {
                const active = selectedConversation?.id === conversation.id;
                const other = conversation.otherUser;
                const name =
                  `${other.firstName || ""} ${other.lastName || ""}`.trim() ||
                  other.email;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full border-b px-4 py-3 text-left transition",
                      isLight
                        ? "border-neutral-100 hover:bg-neutral-50"
                        : "border-white/10 hover:bg-white/[0.04]",
                      active && (isLight ? "bg-red-50" : "bg-white/[0.08]")
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {name}
                        </div>
                        <div
                          className={cn(
                            "truncate text-sm",
                            isLight ? "text-neutral-500" : "text-white/45"
                          )}
                        >
                          {conversation.lastMessage || "Start conversation"}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div
                          className={cn(
                            "text-xs",
                            isLight ? "text-neutral-400" : "text-white/35"
                          )}
                        >
                          {formatTime(conversation.lastMessageAt)}
                        </div>

                        {conversation.unreadCount > 0 ? (
                          <div className="mt-1 inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#d04f51] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {conversation.unreadCount}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "flex items-center justify-between border-b p-4",
              isLight ? "border-neutral-200" : "border-white/10"
            )}
          >
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">
                {selectedConversation ? selectedOtherUserName : "Messages"}
              </h3>
              <p className={cn("text-xs", isLight ? "text-neutral-500" : "text-white/45")}>
                {socketReady ? "Online" : "Connecting..."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "rounded-full p-2 transition",
                isLight
                  ? "text-neutral-600 hover:bg-neutral-100"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              aria-label="Close messages"
            >
              <X size={18} />
            </button>
          </div>

          {error ? (
            <div className="mx-4 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          ) : null}

          {!selectedConversation ? (
            <div
              className={cn(
                "flex flex-1 items-center justify-center text-sm",
                isLight ? "text-neutral-500" : "text-white/45"
              )}
            >
              Select a conversation
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {messages.map((message) => {
                    const mine = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={cn("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[78%] rounded-2xl px-4 py-2 text-sm",
                            mine
                              ? "bg-[#d04f51] text-white"
                              : isLight
                              ? "bg-neutral-100 text-neutral-900"
                              : "bg-white/10 text-white"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              mine
                                ? "text-white/70"
                                : isLight
                                ? "text-neutral-400"
                                : "text-white/40"
                            )}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
              </div>

              <div
                className={cn(
                  "border-t p-4",
                  isLight ? "border-neutral-200" : "border-white/10"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-2",
                    isLight
                      ? "border-neutral-200 bg-neutral-50"
                      : "border-white/10 bg-white/[0.04]"
                  )}
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className={cn(
                      "min-w-0 flex-1 bg-transparent text-sm outline-none",
                      isLight
                        ? "text-neutral-900 placeholder:text-neutral-400"
                        : "text-white placeholder:text-white/35"
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={sending || !text.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d04f51] text-white transition hover:bg-[#e86466] disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <SendHorizontal size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}