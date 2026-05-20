"use client";

import { useEffect, useState } from "react";
import BirthControlPagination from "./components/BirthControlPagination";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { ShieldCheck } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/common/useLanguage";

export default function Page() {
  const [pageReady, setPageReady] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setPageReady(true);
  }, []);

  if (!pageReady) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#fed2cc] p-4 md:p-6">
      <TopBarFeatures />

      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold md:text-2xl">
              {t.birthControl.pageTitle}
            </h1>

            <p className="mt-0.5 text-sm opacity-90">
              {t.birthControl.pageSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen rounded-lg bg-gray-100 p-5">
        <BirthControlPagination />
      </div>
    </div>
  );
}