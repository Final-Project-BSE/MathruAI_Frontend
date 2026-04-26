"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/authentication";
import { triposhaApi } from "@/app/api/triposha/api";
import type { TriposhaRecord } from "@/app/api/triposha/types";

import TopBarFeatures from "@/components/common/TopBarFeatures";
import { Package } from "lucide-react";

import TriposhaCard from "@/app/(panel)/midwife/patient-console/patients/[id]/components/TriposhaCard";

export default function MotherTriposhaPage() {
  const [token, setToken] = useState("");
  const [patientId, setPatientId] = useState<number | null>(null); // 🔥 UPDATED (was userId)
  const [records, setRecords] = useState<TriposhaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 🔥 UPDATED: LOAD LOGIC FIXED
  // ===============================
  useEffect(() => {
    async function init() {
      try {
        const session = await getSession();

        const jwt = session?.user?.token || "";

        const id = session?.user?.patientId || session?.user?.id;

        if (!jwt || !id) throw new Error("Not authenticated");

        setToken(jwt);
        setPatientId(id); // 🔥 UPDATED

        // 🔥 UPDATED API CALL (uses patientId correctly)
        const data = await triposhaApi.getByPatient(jwt, id);
        setRecords(data);
      } catch (err) {
        console.error("Failed to load Triposha:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);
  

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">

      {/* TOP BAR */}
      <TopBarFeatures />

      {/* HEADER */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Package className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold md:text-2xl">
              My Triposha Records
            </h1>
            <p className="text-sm opacity-90 mt-0.5">
              Track your nutrition support and upcoming allocations
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-3xl space-y-6 bg-white/90 p-6 rounded-xl text-white">

        {/* 🔥 UPDATED: READ-ONLY MODE (mother cannot edit/delete) */}
        <TriposhaCard
          records={records}
        />
      </div>
    </div>
  );
}