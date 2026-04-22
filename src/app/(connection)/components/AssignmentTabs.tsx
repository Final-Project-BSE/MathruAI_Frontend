"use client";

import type { MainTab } from "./constants";
import { cn } from "./utils";

type TabItem = {
  key: MainTab;
  label: string;
  hidden?: boolean;
};

type Props = {
  activeTab: MainTab;
  onChange: (tab: MainTab) => void;
  tabs: TabItem[];
  theme: "light" | "dark";
};

export default function AssignmentTabs({
  activeTab,
  onChange,
  tabs,
  theme,
}: Props) {
  const isLightTheme = theme === "light";

  const visibleTabs = tabs.filter((tab) => !tab.hidden);

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition",
              isActive
                ? "border-[#d04f51] bg-[#d04f51] text-white"
                : isLightTheme
                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                : "border-white/10 bg-zinc-950 text-gray-300 hover:bg-white/10"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}