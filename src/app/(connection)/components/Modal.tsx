"use client";

import type { ReactNode } from "react";
import { cn } from "./utils";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  theme?: "light" | "dark";
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  theme = "dark",
}: Props) {
  if (!open) return null;

  const isLightTheme = theme === "light";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div
        className={cn(
          "max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-md border shadow-2xl",
          isLightTheme
            ? "border-gray-200 bg-white"
            : "border-white/10 bg-zinc-950"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-5 py-4",
            isLightTheme ? "border-gray-200" : "border-white/10"
          )}
        >
          <h3
            className={cn(
              "text-md font-semibold",
              isLightTheme ? "text-gray-900" : "text-white"
            )}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-lg border px-3 py-1 text-xs",
              isLightTheme
                ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                : "border-white/10 text-gray-300 hover:bg-white/10"
            )}
          >
            Close
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}