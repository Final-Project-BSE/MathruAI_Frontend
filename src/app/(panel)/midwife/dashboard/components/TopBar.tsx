"use client";

import React, { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { assets } from "./data";
import AIAssistantCard from "./AIAssistantCard";
import PatientsConsoleCard from "./PatientsConsoleCard";
import Link from "next/link";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";

export default function TopBar() {
  const [token, setToken] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!mounted) return;
        setToken(jwt);

        if (!jwt) {
          setCurrentUserId(null);
          return;
        }

        const currentUser = await getcuruser(jwt);

        if (!mounted) return;
        setCurrentUserId(currentUser.id);
      } catch (error) {
        console.error("Failed to load session/current user:", error);
        if (mounted) {
          setToken("");
          setCurrentUserId(null);
        }
      }
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 h-full">
            <div className="grid h-full gap-4 grid-rows-[auto_1fr]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {assets.map((asset, index) => (
                  <AssetCard key={index} {...asset} />
                ))}
              </div>

              <div className="grid min-h-0">
                <Link href="/midwife/patient-console">
                  {token && currentUserId ? (
                    <PatientsConsoleCard token={token} userId={currentUserId} />
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-white/10 bg-[#0b0b0f] text-sm text-white/50">
                      Loading patient console...
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </section>

          <aside className="h-full w-full">
            <AIAssistantCard
              token={token}
              sessionId={activeSessionId}
              onSessionChange={setActiveSessionId}
              onResponse={(response) => {
                console.log("AI response:", response);
              }}
              onError={(message) => {
                console.error(message);
              }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}