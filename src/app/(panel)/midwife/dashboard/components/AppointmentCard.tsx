import React from "react";
import { Clock } from "lucide-react";

type Appointment = {
  time: string;
  patient: string;
  type: string;
};

export function AppointmentCard() {
  const upcomingAppointments: Appointment[] = [
    { time: "09:00 AM", patient: "Emma Johnson", type: "Vaccination" },
    { time: "11:30 AM", patient: "Noah Smith", type: "Follow-up" },
    { time: "02:00 PM", patient: "Olivia Brown", type: "Consultation" },
  ];

  const calendarDays = [
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ["", "", "", "1", "2", "3", "4"],
    ["5", "6", "7", "8", "9", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "29", "30", "", ""],
  ];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4 sm:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-white/80 sm:text-[18px]">Appointment</h2>
          <p className="text-[11px] sm:text-[12px] leading-6 text-white/50">
            View schedules, upcoming visits, and manage bookings with a quick calendar view.
          </p>
        </div>
        <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#fab0a7]">
          3 Today
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">April 2026</h3>
            <span className="text-xs text-slate-400">Monthly View</span>
          </div>

          <div className="space-y-2 text-center text-xs">
            <div className="grid grid-cols-7 gap-1 font-medium text-slate-500">
              {calendarDays[0].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {calendarDays.slice(1).map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((date, dateIndex) => {
                  const isSelected = date === "15";
                  const hasEvent = ["10", "15", "22"].includes(date);

                  return (
                    <div
                      key={`${weekIndex}-${dateIndex}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition ${
                        date
                          ? isSelected
                            ? "border-[#d04f51] bg-[#d04f51] font-semibold text-black"
                            : hasEvent
                            ? "border-[#d04f51]/30 bg-[#fab0a7]/10 text-[#fab0a7]"
                            : "border-slate-800 bg-slate-950/50 text-slate-300"
                          : "border-transparent"
                      }`}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Upcoming Appointments</h3>
            <span className="text-xs text-slate-400">Patient List</span>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={`${appointment.time}-${appointment.patient}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fab0a7]/10 p-2 text-[#fab0a7]">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{appointment.patient}</p>
                    <p className="text-xs text-slate-400">{appointment.type}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {appointment.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="mt-6 w-full rounded-xl bg-[#d04f51] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#b94245]">
        View Appointments
      </button>
    </div>
  );
}