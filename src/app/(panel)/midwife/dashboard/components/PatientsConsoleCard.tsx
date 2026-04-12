import React from "react";
import {
    ArrowUpRight,
    Clock3,
    Activity,
    ShieldCheck,
    ChevronRight,
    CircleDot,
} from "lucide-react";

const recentPatients = [
    {
        id: 1,
        name: "Amara Silva",
        image: "https://i.pravatar.cc/80?img=32",
        status: "Under Observation",
        ward: "Ward 03",
        time: "10 min ago",
    },
    {
        id: 2,
        name: "Nethmi Perera",
        image: "https://i.pravatar.cc/80?img=47",
        status: "Vitals Updated",
        ward: "ICU 02",
        time: "22 min ago",
    },
    {
        id: 3,
        name: "Kavindu Fernando",
        image: "https://i.pravatar.cc/80?img=14",
        status: "Discharge Review",
        ward: "Ward 07",
        time: "48 min ago",
    },
];

export default function PatientsConsoleCard() {
    return (
        <section
            className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0b0f] shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:rounded-[24px]"
            style={{
                backgroundImage: "url('/images/midwife/midwife_card.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                backgroundSize: "contain",
            }}
        >
            {/* dark overlay for readability */}
            <div className="absolute inset-0 bg-[#0b0b0f]/72" />

            {/* soft left-to-right gradient so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/88 to-transparent" />

            {/* optional bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f]/45 via-transparent to-transparent" />

            <div className="relative z-10 p-4 sm:p-5">
                <div className="max-w-[920px]">


                    <div className="mt-2 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                        {/* Left column */}

                        <div>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] text-white/45 sm:text-[12px]">
                                        Patient Management
                                    </p>

                                    <h2 className="mt-1 text-[16px] font-semibold tracking-tight text-white/80 sm:text-[18px]">
                                        Patients Console
                                    </h2>
                                </div>

                                <button className="inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 text-[12px] text-white/80 transition hover:bg-white/[0.08]">
                                    Open
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <p className="mt-2 max-w-xl text-[11px] leading-6 text-white/50 sm:text-[12px]">
                                Monitor registrations, care progress, patient movement, and recent
                                updates from one focused view.
                            </p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-[22px] font-semibold leading-none tracking-tight text-white/80 sm:text-[30px]">
                                    1,248
                                </h3>
                                <div className="">
                                    <p className="text-[11px] text-emerald-400">+18 today</p>
                                    <p className="text-[10px] text-white/40">
                                        Registered patients
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                <div className="flex h-full w-full">
                                    <div className="h-full w-[58%] rounded-full bg-white/80" />
                                    <div className="h-full w-[24%] bg-white/55" />
                                    <div className="h-full w-[18%] bg-white/20" />
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                                    <CircleDot className="h-3.5 w-3.5 text-emerald-400" />
                                    93 live
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    17 pending reports
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    08 critical watch
                                </span>
                            </div>
                        </div>

                        {/* Right column */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-[12px] font-medium text-white/82">
                                    Recent patient updates
                                </p>

                                <button className="inline-flex items-center gap-1 text-[11px] text-white/45 transition hover:text-white/75">
                                    View all
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="grid gap-2.5">
                                {recentPatients.map((patient) => (
                                    <button
                                        key={patient.id}
                                        className="flex w-full items-center gap-3 rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
                                    >
                                        <img
                                            src={patient.image}
                                            alt={patient.name}
                                            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-[12px] font-medium text-white/80">
                                                    {patient.name}
                                                </p>
                                                <p className="shrink-0 text-[10px] text-white/40">
                                                    {patient.time}
                                                </p>
                                            </div>

                                            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
                                                <span className="truncate">{patient.status}</span>
                                                <span className="h-1 w-1 rounded-full bg-white/25" />
                                                <span>{patient.ward}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}