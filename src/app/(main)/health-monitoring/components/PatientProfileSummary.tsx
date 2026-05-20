"use client";

import React, { useEffect, useState } from "react";
import { User, Calendar, Heart, Activity } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface PatientProfileSummaryProps {
  patientProfile: Record<string, any>;
}

const PatientProfileSummary: React.FC<PatientProfileSummaryProps> = ({
  patientProfile,
}) => {
  const { language, t } = useLanguage();
  const text = t.healthMonitor.profile;

  const [translatedValues, setTranslatedValues] = useState<Record<string, string>>({});

  const getIconForField = (key: string) => {
    const keyLower = key.toLowerCase();

    if (keyLower.includes("age") || keyLower.includes("date")) {
      return <Calendar className="h-5 w-5 text-slate-500" />;
    }

    if (keyLower.includes("heart") || keyLower.includes("cardiac")) {
      return <Heart className="h-5 w-5 text-slate-500" />;
    }

    if (keyLower.includes("activity") || keyLower.includes("exercise")) {
      return <Activity className="h-5 w-5 text-slate-500" />;
    }

    return <User className="h-5 w-5 text-slate-500" />;
  };

  const formatFallbackKey = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatKey = (key: string): string => {
    return text.fields[key] || formatFallbackKey(key);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return text.empty;
    if (Array.isArray(value)) return value.length ? value.join(", ") : text.empty;
    if (typeof value === "boolean") return value ? text.yes : text.no;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  useEffect(() => {
    let cancelled = false;

    const translateValues = async () => {
      if (!patientProfile || Object.keys(patientProfile).length === 0) {
        setTranslatedValues({});
        return;
      }

      const entries = Object.entries(patientProfile);

      if (language === "en") {
        setTranslatedValues(
          Object.fromEntries(entries.map(([key, value]) => [key, formatValue(value)]))
        );
        return;
      }

      const translatedEntries = await Promise.all(
        entries.map(async ([key, value]) => {
          const formatted = formatValue(value);

          if (
            formatted === text.empty ||
            formatted === text.yes ||
            formatted === text.no ||
            !Number.isNaN(Number(formatted))
          ) {
            return [key, formatted];
          }

          const translated = await translateText(formatted, language);
          return [key, translated];
        })
      );

      if (!cancelled) {
        setTranslatedValues(Object.fromEntries(translatedEntries));
      }
    };

    void translateValues();

    return () => {
      cancelled = true;
    };
  }, [patientProfile, language, text.empty, text.yes, text.no]);

  if (!patientProfile || Object.keys(patientProfile).length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-slate-500" />
        <h3 className="text-base font-semibold text-slate-900">
          {text.title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
        {Object.entries(patientProfile).map(([key, value]) => (
          <div
            key={key}
            className="
              flex w-full flex-col items-center justify-center
              rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm
              min-h-[150px]
              sm:aspect-square sm:min-h-0
            "
          >
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-slate-50 sm:h-12 sm:w-12">
              {getIconForField(key)}
            </div>

            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-[11px]">
              {formatKey(key)}
            </p>

            <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
              {translatedValues[key] ?? formatValue(value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientProfileSummary;