import React from "react";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";

export function VaccinationCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-semibold text-white/80">Vaccination</h2>
          <p className="text-[11px] sm:text-[12px] leading-6 text-white/50">
            Today’s vaccination summary, eligible patients and next session details.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Today’s Vaccinations</p>
          <p className="text-lg font-semibold text-white">05</p>
          <p className="text-xs" style={{ color: "#fab0a7" }}>
            3 completed, 2 pending for today
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Eligible Patients</p>
          <p className="text-lg font-semibold text-white">24</p>
          <p className="text-xs" style={{ color: "#fab0a7" }}>
            Ready for vaccination today
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] sm:text-[12px] font-medium text-white/80">Today’s Basic Details</p>

        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <User size={16} style={{ color: "#fab0a7" }} />
            <span>Assigned Nurse: A. Perera</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Clock size={16} style={{ color: "#fab0a7" }} />
            <span>Session Time: 9:00 AM - 4:00 PM</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <MapPin size={16} style={{ color: "#fab0a7" }} />
            <span>Vaccination Room: Clinic A</span>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full rounded-xl bg-[#d04f51] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#b94245]">
        Manage Vaccinations
      </button>
    </div>
  );
}