"use client";

import React from "react";
import Link from "next/link";
import {
  NotebookPen,
  PhoneCall,
  BarChart3,
  ClipboardList,
} from "lucide-react";

type FeatureItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  danger?: boolean;
};

const featureItems: FeatureItem[] = [
  { label: "Emergency Numbers", icon: PhoneCall, href: "/emergency-numbers" },
  { label: "Notes", icon: NotebookPen, href: "/notes" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  {
    label: "Protocols & Guidelines",
    icon: ClipboardList,
    href: "/protocols-guidelines",
  },
];

export default function DashboardFeatures() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-5">
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-white/80 sm:text-[18px]">
          Dashboard Features
        </h2>
        <p className="text-[11px] leading-6 text-white/50 sm:text-[12px]">
          Quick access to commonly used tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {featureItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                group flex min-w-0 items-center gap-3 rounded-xl border p-4
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                ${
                  item.danger
                    ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                    : "border-slate-800 bg-slate-950/50 hover:border-white/15 hover:bg-white/[0.07]"
                }
              `}
            >
              <div
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                  transition-colors duration-200
                  ${
                    item.danger
                      ? "bg-red-500 text-white"
                      : "bg-[#fab0a7]/10 text-[#fab0a7] group-hover:bg-[#fab0a7]/20"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className={`truncate text-sm font-semibold ${
                    item.danger ? "text-red-300" : "text-white"
                  }`}
                >
                  {item.label}
                </h3>

                <p className="mt-1 text-xs text-white/55">
                  Open {item.label.toLowerCase()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}