"use client";

import dynamic from "next/dynamic";

const FloatingChatbot = dynamic(
  () =>
    import("@/components/FloatingChatbot").then((mod) => mod.FloatingChatbot),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ClientFloatingChatbot() {
  return <FloatingChatbot />;
}