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
};

export default function AssignmentTabs({
  activeTab,
  onChange,
  tabs,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {tabs
        .filter((tab) => !tab.hidden)
        .map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "rounded-md border px-4 py-2 text-xs font-medium transition",
              activeTab === tab.key
                ? "border-[#d04f51] bg-[#d04f51] text-white shadow-lg"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
    </div>
  );
}