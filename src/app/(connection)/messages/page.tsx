"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SendHorizontal } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { chatApi } from "@/app/api/chat/api";
import type {
  ChatConversationResponseDto,
  ChatMessageResponseDto,
} from "@/app/api/chat/types";
import { createChatClient } from "@/lib/chatSocket";

function formatTime(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get("targetUserId");

  const [token, setToken] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<
    ChatConversationResponseDto[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversationResponseDto | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
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
  const selectedConversationId = selectedConversation?.id ?? null;

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversation?.id || null;
  }, [selectedConversation?.id]);

  useEffect(() => {
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

        if (targetUserIdParam) {
          const targetUserId = Number(targetUserIdParam);

          if (!Number.isNaN(targetUserId)) {
            const opened = await chatApi.openConversation(
              me.id,
              { targetUserId },
              jwt
            );

            const exists = list.some((item) => item.id === opened.id);
            list = exists
              ? list.map((item) => (item.id === opened.id ? opened : item))
              : [opened, ...list];

            if (active) {
              setSelectedConversation(opened);
            }
          }
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

            if (me.id) {
              try {
                unreadSubscriptionRef.current?.unsubscribe();
                unreadSubscriptionRef.current = socket.subscribeUnread(me.id);
              } catch {
                // Ignore until next reconnect.
              }
            }

            const activeConversationId = selectedConversationIdRef.current;
            if (activeConversationId) {
              try {
                conversationSubscriptionRef.current?.unsubscribe();
                conversationSubscriptionRef.current =
                  socket.subscribeConversation(activeConversationId);
              } catch {
                // Ignore until conversation effect retries.
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
    };
  }, [targetUserIdParam]);

  useEffect(() => {
    if (!selectedConversationId || !currentUserId || !token) return;

    const conversationId = selectedConversationId;
    const userId = currentUserId;
    const authToken = token;

    let active = true;

    async function loadMessages() {
      try {
        setError("");

        const list = await chatApi.getMessages(
          conversationId,
          userId,
          authToken
        );

        if (!active) return;

        setMessages(list);

        await chatApi.markAsRead(conversationId, userId, authToken);

        setConversations((prev) =>
          prev.map((item) =>
            item.id === conversationId ? { ...item, unreadCount: 0 } : item
          )
        );

        conversationSubscriptionRef.current?.unsubscribe();
        conversationSubscriptionRef.current = null;

        if (socketRef.current?.client.connected) {
          conversationSubscriptionRef.current =
            socketRef.current.subscribeConversation(conversationId);
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
  }, [selectedConversationId, currentUserId, token]);

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

  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Loading messages...</div>;
  }

  return (
    <div className="h-[calc(100vh-100px)] bg-white">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r border-neutral-200">
          <div className="border-b border-neutral-200 p-4">
            <h1 className="text-lg font-semibold text-neutral-900">
              Messages
            </h1>
            <p className="text-sm text-neutral-500">Assigned chat only</p>
          </div>

          <div className="h-[calc(100%-73px)] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-neutral-500">
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
                    className={`w-full border-b border-neutral-100 px-4 py-3 text-left transition ${
                      active ? "bg-red-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-neutral-900">
                          {name}
                        </div>
                        <div className="truncate text-sm text-neutral-500">
                          {conversation.lastMessage || "Start conversation"}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs text-neutral-400">
                          {formatTime(conversation.lastMessageAt)}
                        </div>

                        {conversation.unreadCount > 0 ? (
                          <div className="mt-1 inline-flex min-w-[22px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
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

        <main className="flex min-h-0 flex-col">
          {!selectedConversation ? (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="border-b border-neutral-200 px-5 py-4">
                <div className="font-semibold text-neutral-900">
                  {selectedOtherUserName}
                </div>
                <div className="text-sm text-neutral-500">
                  {socketReady ? "Live chat connected" : "Connecting to chat..."}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-neutral-50 p-4">
                <div className="space-y-3">
                  {messages.map((message) => {
                    const mine = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            mine
                              ? "bg-red-500 text-white"
                              : "bg-white text-neutral-900"
                          }`}
                        >
                          <div>{message.content}</div>
                          <div
                            className={`mt-1 text-[11px] ${
                              mine ? "text-red-100" : "text-neutral-400"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
              </div>

              <div className="border-t border-neutral-200 p-4">
                {error ? (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {!socketReady ? (
                  <div className="mb-2 text-xs text-neutral-500">
                    Connecting to chat...
                  </div>
                ) : null}

                <div className="flex items-center gap-3">
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
                    disabled={!selectedConversation}
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-red-400 disabled:cursor-not-allowed disabled:bg-neutral-100"
                  />

                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={sending || !text.trim() || !socketReady}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizontal className="h-4 w-4" />
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