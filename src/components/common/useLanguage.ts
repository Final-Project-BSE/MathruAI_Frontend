"use client";

import { useEffect, useMemo, useState } from "react";
import { dashboardTranslations } from "@/app/(main)/dashboard/dashboardLang";
import { pregnancyTranslations } from "@/app/(main)/dashboard/pregnancy/components/pregDashLang";
import { reproductiveTranslations } from "@/app/(main)/dashboard/reproductive/components/reproDashLang";
import { postpartumTranslations } from "@/app/(main)/dashboard/postpartum/components/postDashLang";
import { announcementTranslations } from "@/app/(main)/announcement/announcementLang";
import { birthControlTranslations } from "@/app/(main)/birth-control/components/birthControlLang";
import { cycleTrackerTranslations } from "@/app/(main)/cycle-tracker/components/cycleTrackerLang";
import { healthMonitorTranslations } from "@/app/(main)/health-monitoring/components/healthMonitorLang";
import { assignmentTranslations } from "@/app/(connection)/components/assignmentLang";
import { healthRecordTranslations } from "@/app/(main)/health-records/healthRecordLang";
import { profileTranslations } from "@/app/(main)/profile/components/profileLang";
import { triposhaTranslations } from "@/app/(main)/triposha/triposhaLang";
import { vaccinationTranslations } from "@/app/(main)/vaccination/vaccinationLang";
import { appointmentTranslations } from "@/components/appointment/appointmentLang";
import { sidebarTranslations } from "@/components/sidebarLang";
import { dailyRecommendationTranslations } from "@/app/(main)/daily-recommendations/components/dailyRecommendationLang";
import { recoveryTrackingTranslations } from "@/app/(main)/recovery-tracking/recoveryTrackingLang";
import { breastfeedingTranslations } from "@/app/(main)/breastfeeding-support/components/breastfeedingLang";

export type LanguageCode = "en" | "si" | "ta";

const STORAGE_KEY = "app-language";

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "en" || value === "si" || value === "ta";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (isLanguageCode(saved)) {
      setLanguageState(saved);
    }

    const handleLanguageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);

      if (isLanguageCode(updated)) {
        setLanguageState(updated);
      }
    };

    window.addEventListener("language:changed", handleLanguageChange);

    return () => {
      window.removeEventListener("language:changed", handleLanguageChange);
    };
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
    window.dispatchEvent(new Event("language:changed"));
  };

  const t = useMemo(
    () => ({
      dashboard: dashboardTranslations[language],
      pregnancy: pregnancyTranslations[language],
      reproductive: reproductiveTranslations[language],
      postpartum: postpartumTranslations[language],
      announcement: announcementTranslations[language],

      birthControl: birthControlTranslations[language],
      cycleTracker: cycleTrackerTranslations[language],
      healthMonitor: healthMonitorTranslations[language],
      assignment: assignmentTranslations[language],
      healthRecords: healthRecordTranslations[language],
      profile: profileTranslations[language],
      triposha: triposhaTranslations[language],
      vaccination: vaccinationTranslations[language],
      appointment: appointmentTranslations[language],
      sidebar: sidebarTranslations[language],
      dailyRecommendation: dailyRecommendationTranslations[language],
      recoveryTracking: recoveryTrackingTranslations[language],
      breastfeeding: breastfeedingTranslations[language],
    }),
    [language]
  );

  return {
    language,
    setLanguage,
    t,
  };
}