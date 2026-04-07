import React from "react";
import { Clock, MapPin, User } from "lucide-react";

export function HomeVisitCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(250,176,167,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-semibold text-white">
            Home Visit
          </h2>
          <p className="text-[11px] sm:text-[12px] leading-6 text-[#fab0a7]/75">
            Organize field staff, patient addresses, and visit priorities for
            better routing.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#fab0a7]/40 bg-[#d04f51] shadow-lg shadow-[#d04f51]/25">
            <span className="text-lg font-bold text-white">7</span>
          </div>
          <p className="mt-2 text-xs text-[#fab0a7]/80">Pending Visits</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Next Home Visit</p>
          <p className="mt-1 text-sm font-semibold text-white">
            Michael Wilson
          </p>

          <div className="mt-3 space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#fab0a7]" />
              <span>24 Lake Street, Colombo</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#fab0a7]" />
              <span>04:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#fab0a7]" />
              <span>Nurse Priya Fernando</span>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full rounded-xl bg-[#d04f51] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#b94245]">
        Manage Home Visits
      </button>
    </div>
  );
}