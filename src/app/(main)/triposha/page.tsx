// "use client";

// import { useEffect, useState } from "react";
// import { Package, Loader2 } from "lucide-react";

// import { getSession } from "@/lib/authentication";
// import { getcuruser } from "@/app/api/user/api";
// import { triposhaApi } from "@/app/api/triposha/api";
// import type { TriposhaRecord } from "@/app/api/triposha/types";

// import TopBarFeatures from "@/components/common/TopBarFeatures";
// import TriposhaCard from "@/app/(panel)/midwife/patient-console/patients/[id]/components/TriposhaCard";

// export default function MotherTriposhaPage() {
//   const [records, setRecords] = useState<TriposhaRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let active = true;

//     async function loadTriposha() {
//       try {
//         setLoading(true);
//         setError("");

//         const session = await getSession();
//         const jwt = session?.user?.token || "";

//         if (!jwt) {
//           throw new Error("You are not authenticated. Please sign in again.");
//         }

//         const currentUser = await getcuruser(jwt);
//         const patientId = currentUser.id;

//         const data = await triposhaApi.getByPatient(jwt, patientId);

//         if (!active) return;
//         setRecords(data);
//       } catch (err) {
//         if (!active) return;

//         console.error("Failed to load Triposha:", err);
//         setRecords([]);
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to load Triposha records."
//         );
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     void loadTriposha();

//     return () => {
//       active = false;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#fed2cc] text-[#d04f51]">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fed2cc] p-4 md:p-6">
//       <TopBarFeatures />

//       <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
//         <div className="relative z-10 flex items-center gap-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
//             <Package className="h-7 w-7 text-white" />
//           </div>

//           <div>
//             <h1 className="text-xl font-bold md:text-2xl">
//               My Triposha Records
//             </h1>
//             <p className="mt-0.5 text-sm opacity-90">
//               Track your nutrition support and upcoming allocations
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-3xl space-y-4">
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <TriposhaCard records={records} readOnly />
//       </div>
//     </div>
//   );
// }