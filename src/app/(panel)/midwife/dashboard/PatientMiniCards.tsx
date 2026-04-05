import React from "react";
import { Users, CalendarDays, Activity, Stethoscope } from "lucide-react";

type MiniCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
};

function MiniCard({ title, value, subtitle, icon }: MiniCardProps) {
  return (
    <div className="flex h-full flex-col rounded-[16px] border border-white/8 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-white/80">
        {icon}
      </div>

      <p className="text-[11px] text-white/45 sm:text-[12px]">{title}</p>
      <h3 className="mt-1 text-[18px] font-semibold leading-none tracking-tight text-white sm:text-[20px]">
        {value}
      </h3>
    </div>
  );
}

export default function PatientMiniCards() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
      <MiniCard
        title="Total Patients"
        value="1,284"
        subtitle="+12% this month"
        icon={<Users className="h-4 w-4" />}
      />
      <MiniCard
        title="Appointments"
        value="86"
        subtitle="18 scheduled today"
        icon={<CalendarDays className="h-4 w-4" />}
      />
      <MiniCard
        title="Critical Cases"
        value="07"
        subtitle="Needs review"
        icon={<Activity className="h-4 w-4" />}
      />
      <MiniCard
        title="Doctors On Duty"
        value="24"
        subtitle="Across departments"
        icon={<Stethoscope className="h-4 w-4" />}
      />
    </div>
  );
}