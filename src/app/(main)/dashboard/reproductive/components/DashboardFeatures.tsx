"use client";

import Link from "next/link";
import {
  CalendarDays,
  NotebookPen,
  PhoneCall,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "../../../../../components/common/useLanguage";

type FeatureItem = {
  key: "appointment" | "emergencyNumbers" | "notes" | "analytics";
  icon: React.ElementType;
  href: string;
  danger?: boolean;
};

const featureItems: FeatureItem[] = [
  { key: "appointment", icon: CalendarDays, href: "/appointments" },
  { key: "emergencyNumbers", icon: PhoneCall, href: "/emergency-numbers" },
  { key: "notes", icon: NotebookPen, href: "/notes" },
  { key: "analytics", icon: BarChart3, href: "/analytics" },
];

export default function DashboardFeatures() {
  const { t } = useLanguage();

  const getLabel = (key: FeatureItem["key"]) => {
    return t.reproductive.features[key];
  };

  const getDescription = (key: FeatureItem["key"]) => {
    const descriptions = {
      appointment: t.reproductive.features.openAppointment,
      emergencyNumbers: t.reproductive.features.openEmergencyNumbers,
      notes: t.reproductive.features.openNotes,
      analytics: t.reproductive.features.openAnalytics,
    };

    return descriptions[key];
  };

  return (
    <div className="w-full mb-6 mt-6">
      <div
        className="
          flex w-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm
          sm:p-4
          lg:rounded-3xl
        "
      >
        <div
          className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {featureItems.map((item) => {
            const Icon = item.icon;
            const label = getLabel(item.key);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  group flex min-w-0 items-start gap-3 rounded-2xl border p-4 transition
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    item.danger
                      ? "border-red-200 bg-red-50 hover:bg-red-100"
                      : "border-neutral-200 bg-neutral-50 hover:bg-white"
                  }
                `}
              >
                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                    ${
                      item.danger
                        ? "bg-red-500 text-white"
                        : "bg-orange-100 text-orange-600"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3
                    className={`truncate text-sm font-semibold ${
                      item.danger ? "text-red-700" : "text-neutral-900"
                    }`}
                  >
                    {label}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {getDescription(item.key)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}