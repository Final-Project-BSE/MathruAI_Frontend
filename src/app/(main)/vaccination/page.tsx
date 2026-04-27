// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CalendarDays, Loader2, MapPin, Syringe } from "lucide-react";
// import { getSession } from "@/lib/authentication";
// import { getcuruser } from "@/app/api/user/api";
// import { vaccinationApi } from "@/app/api/vaccination/api";
// import type {
//   VaccinationCardResponseDto,
//   VaccinationStatus,
// } from "@/app/api/vaccination/types";
// import TopBarFeatures from "@/components/common/TopBarFeatures";

// const tabs: VaccinationStatus[] = ["PENDING", "COMPLETED", "MISSED"];

// function statusClass(status: VaccinationStatus) {
//   if (status === "COMPLETED")
//     return "border-emerald-200 bg-emerald-50 text-emerald-700";

//   if (status === "MISSED")
//     return "border-red-200 bg-red-50 text-red-700";

//   return "border-yellow-200 bg-yellow-50 text-yellow-700";
// }

// function label(status: VaccinationStatus) {
//   if (status === "PENDING") return "Pending";
//   if (status === "COMPLETED") return "Completed";
//   return "Missed";
// }

// export default function PatientVaccinationPage() {
//   const [cards, setCards] = useState<VaccinationCardResponseDto[]>([]);
//   const [activeTab, setActiveTab] = useState<VaccinationStatus>("PENDING");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let active = true;

//     async function loadCards() {
//       try {
//         setLoading(true);
//         setError("");

//         const session = await getSession();
//         const token = session?.user?.token || "";

//         if (!token) {
//           throw new Error("You are not authenticated.");
//         }

//         const me = await getcuruser(token);
//         const data = await vaccinationApi.getPatientSideCards(token, me.id);

//         if (!active) return;

//         setCards(data);
//       } catch (err) {
//         if (!active) return;

//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to load vaccination details."
//         );
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     void loadCards();

//     return () => {
//       active = false;
//     };
//   }, []);

//   const groupedCounts = useMemo(() => {
//     return {
//       PENDING: cards.filter((card) => card.status === "PENDING").length,
//       COMPLETED: cards.filter((card) => card.status === "COMPLETED").length,
//       MISSED: cards.filter((card) => card.status === "MISSED").length,
//     };
//   }, [cards]);

//   const visibleCards = useMemo(() => {
//     return cards.filter((card) => card.status === activeTab);
//   }, [cards, activeTab]);

//   return (
//     <main className="min-h-screen bg-[#fed2cc] p-6 text-zinc-950">
//       <TopBarFeatures />
//       <section className="mx-auto max-w-7xl rounded-2xl border border-zinc-200 bg-[#f2bdb6] p-5 shadow-sm">
//         <div className="mb-5">
//           <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-950">
//             <Syringe className="h-5 w-5 text-[#d04f51]" />
//             My Vaccinations
//           </h1>

//           <p className="mt-1 text-sm text-black">
//             View vaccination cards assigned by your midwife.
//           </p>
//         </div>

//         <div className="mb-5 flex flex-wrap gap-2">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setActiveTab(tab)}
//               className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
//                 activeTab === tab
//                   ? "border-[#d04f51] bg-[#d04f51] text-white shadow-sm"
//                   : "border-zinc-200 bg-[#fae6e3] text-black hover:border-[#d04f51] hover:text-[#d04f51]"
//               }`}
//             >
//               {label(tab)} ({groupedCounts[tab]})
//             </button>
//           ))}
//         </div>

//         {error ? (
//           <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         ) : null}

//         {loading ? (
//           <div className="flex justify-center py-10">
//             <Loader2 className="h-6 w-6 animate-spin text-[#d04f51]" />
//           </div>
//         ) : visibleCards.length === 0 ? (
//           <div className="rounded-xl border border-zinc-200 bg-[#fae6e3] px-4 py-8 text-center text-sm text-zinc-500">
//             No {label(activeTab).toLowerCase()} vaccination cards.
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {visibleCards.map((card) => (
//               <article
//                 key={card.id}
//                 className="rounded-2xl border border-zinc-200 bg-[#fae6e3] p-4 shadow-sm"
//               >
//                 <div className="mb-3 flex items-start justify-between gap-3">
//                   <div>
//                     <h3 className="text-sm font-bold text-zinc-950">
//                       {card.vaccineName}
//                     </h3>

//                     <p className="mt-1 text-xs text-zinc-800">
//                       {card.vaccineType || "No type"} • Dose: {card.dose || "-"}
//                     </p>
//                   </div>

//                   <span
//                     className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass(
//                       card.status
//                     )}`}
//                   >
//                     {card.status}
//                   </span>
//                 </div>

//                 <div className="space-y-2 text-xs text-zinc-800">
//                   <p className="flex items-center gap-2">
//                     <CalendarDays className="h-4 w-4 text-zinc-800" />
//                     Due date: {card.dueDate}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <CalendarDays className="h-4 w-4 text-zinc-800" />
//                     Injection date: {card.vaccinationInjectionDate || "-"}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <CalendarDays className="h-4 w-4 text-zinc-800" />
//                     Completed date: {card.completedDate || "-"}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-zinc-800" />
//                     Location: {card.location || "-"}
//                   </p>
//                 </div>

//                 {card.midwifeNote ? (
//                   <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
//                     <p className="text-xs text-zinc-600">Midwife note</p>
//                     <p className="mt-1 text-sm text-zinc-600">
//                       {card.midwifeNote}
//                     </p>
//                   </div>
//                 ) : null}
//               </article>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }
