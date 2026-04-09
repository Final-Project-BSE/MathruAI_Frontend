"use client";

import Link from "next/link";
import { NotebookPen, PhoneCall, BarChart3, ClipboardList } from "lucide-react";

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
    { label: "Protocols & Guidelines", icon: ClipboardList, href: "/protocols-guidelines" },
];

export default function DashboardFeatures() {
    return (
        <section className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <div className="w-full border-y border-white/10 py-4 sm:py-5">
                <div
                    className="
            grid grid-cols-2 gap-2
            sm:grid-cols-3 sm:gap-3
            lg:grid-cols-4
            xl:grid-cols-4
          "
                >
                    {featureItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={`${item.label}-${index}`}
                                href={item.href}
                                className={`
                  group flex min-w-0 items-center gap-3 rounded-2xl border p-4
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg
                  sm:p-5
                  ${item.danger
                                        ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15"
                                        : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/[0.07]"
                                    }
                `}
                            >
                                <div
                                    className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    sm:h-11 sm:w-11 transition-colors duration-200
                    ${item.danger
                                            ? "bg-red-500 text-white"
                                            : "bg-[#fab0a7]/20 text-[#d04f51] group-hover:bg-[#fab0a7]/30"
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3
                                        className={`truncate text-sm font-semibold sm:text-base ${item.danger ? "text-red-300" : "text-white"
                                            }`}
                                    >
                                        {item.label}
                                    </h3>

                                    <p className="mt-1 text-xs text-white/55 sm:text-sm">
                                        Open {item.label.toLowerCase()}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}