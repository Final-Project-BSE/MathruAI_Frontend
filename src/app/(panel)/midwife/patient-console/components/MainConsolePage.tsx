// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, Plus, MoreVertical, Filter } from "lucide-react";
// import { getSession } from "@/lib/authentication";
// import { getcuruser } from "@/app/api/user/api";
// import { assignmentApi } from "@/app/api/user-assign/api";
// import type { UserResponseDto } from "@/app/api/user-assign/types";

// export default function MainConsolePage() {
//   const router = useRouter();

//   const [token, setToken] = useState<string>("");
//   const [userId, setUserId] = useState<number | null>(null);
//   const [patients, setPatients] = useState<UserResponseDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     let active = true;

//     async function loadPatients() {
//       try {
//         setLoading(true);
//         setError("");

//         const session = await getSession();
//         const jwt = session?.user?.token || "";

//         if (!jwt) {
//           throw new Error("You are not authenticated. Please sign in again.");
//         }

//         if (!active) return;
//         setToken(jwt);

//         const currentUser = await getcuruser(jwt);

//         if (!active) return;
//         setUserId(currentUser.id);

//         const assignedUsers = await assignmentApi.getAssignedUsersForMidwife(
//           currentUser.id,
//           jwt
//         );

//         if (!active) return;
//         setPatients(assignedUsers);
//       } catch (err) {
//         if (!active) return;
//         setError(err instanceof Error ? err.message : "Failed to load patients");
//         setPatients([]);
//       } finally {
//         if (active) {
//           setLoading(false);
//         }
//       }
//     }

//     void loadPatients();

//     return () => {
//       active = false;
//     };
//   }, []);

//   const filteredPatients = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return patients;

//     return patients.filter((patient) => {
//       const fullName = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.toLowerCase();
//       const email = (patient.email ?? "").toLowerCase();
//       const phone = (patient.phoneNumber ?? "").toLowerCase();
//       const district = (patient.district ?? "").toLowerCase();
//       const mohArea = (patient.mohArea ?? "").toLowerCase();
//       const area = (patient.area ?? "").toLowerCase();

//       return (
//         fullName.includes(q) ||
//         email.includes(q) ||
//         phone.includes(q) ||
//         district.includes(q) ||
//         mohArea.includes(q) ||
//         area.includes(q)
//       );
//     });
//   }, [patients, search]);

//   function getAvatarText(patient: UserResponseDto) {
//     const first = patient.firstName?.[0] ?? "";
//     const last = patient.lastName?.[0] ?? "";
//     return `${first}${last}`.toUpperCase() || "?";
//   }

//   function getPatientStage(patient: UserResponseDto) {
//     if (patient.roles.includes("PREGNANT_MOTHER")) return "Pregnant Mother";
//     if (patient.roles.includes("POST_PREGNANT_MOTHER")) return "Post Pregnant Mother";
//     if (patient.roles.includes("HOPE_TO_PREGNANT_MOTHER")) return "Hope To Pregnant Mother";
//     return patient.roles.join(", ") || "Unknown";
//   }

//   function getAreaLabel(patient: UserResponseDto) {
//     if (patient.mohArea && patient.district) return `${patient.mohArea}, ${patient.district}`;
//     if (patient.area) return patient.area;
//     if (patient.mohArea) return patient.mohArea;
//     if (patient.district) return patient.district;
//     return "-";
//   }

//   function handleNavigate(patient: UserResponseDto) {
//     router.push(`/midwife/patient-console/patients/${patient.id}`);
//   }

//   return (
//     <div className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
//       <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
//         <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-3">
//             <h1 className="text-xl font-semibold tracking-tight">Patients</h1>
//             {!loading ? (
//               <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
//                 {filteredPatients.length} shown
//               </span>
//             ) : null}
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 md:w-[300px]">
//               <Search className="h-4 w-4 text-zinc-400" />
//               <input
//                 type="text"
//                 placeholder="Search Patient"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
//               />
//             </div>

//             <button
//               type="button"
//               className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-4 text-sm font-medium text-white transition hover:bg-zinc-700"
//             >
//               <Filter className="h-4 w-4" />
//               Filter
//             </button>

//             <button
//               type="button"
//               className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#d04f51] px-4 text-sm font-semibold text-white transition hover:bg-red-400"
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </button>
//           </div>
//         </div>

//         {error ? (
//           <div className="border-b border-white/10 px-5 py-4 text-sm text-red-400">
//             {error}
//           </div>
//         ) : null}

//         <div className="overflow-x-auto">
//           <table className="min-w-[1200px] w-full">
//             <thead className="bg-zinc-900/80">
//               <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
//                 <th className="px-5 py-4 font-medium">Patient Name</th>
//                 <th className="px-5 py-4 font-medium">Patient ID</th>
//                 <th className="px-5 py-4 font-medium">Phone Number</th>
//                 <th className="px-5 py-4 font-medium">Area</th>
//                 <th className="px-5 py-4 font-medium">District / MOH</th>
//                 <th className="px-5 py-4 font-medium">Stage</th>
//                 <th className="px-5 py-4 font-medium text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-white/5">
//               {loading ? (
//                 Array.from({ length: 6 }).map((_, index) => (
//                   <tr key={index}>
//                     <td className="px-5 py-4" colSpan={7}>
//                       <div className="h-12 animate-pulse rounded-lg bg-white/5" />
//                     </td>
//                   </tr>
//                 ))
//               ) : filteredPatients.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-5 py-10 text-center text-sm text-zinc-500"
//                   >
//                     No assigned patients found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredPatients.map((patient) => (
//                   <tr
//                     key={patient.id}
//                     onClick={() => handleNavigate(patient)}
//                     className="group cursor-pointer transition hover:bg-zinc-900/60"
//                   >
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3 text-left">
//                         {patient.profileImageUrl ? (
//                           <img
//                             src={patient.profileImageUrl}
//                             alt={`${patient.firstName} ${patient.lastName}`}
//                             className="flex h-10 w-10 items-center justify-center rounded-full object-cover ring-1 ring-white/10"
//                           />
//                         ) : (
//                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white ring-1 ring-white/10">
//                             {getAvatarText(patient)}
//                           </div>
//                         )}

//                         <div>
//                           <div className="font-medium text-white group-hover:text-red-400">
//                             {patient.firstName} {patient.lastName}
//                           </div>
//                           <div className="text-xs text-zinc-500">{patient.email}</div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-5 py-4 text-sm text-zinc-300">
//                       {patient.id}
//                     </td>

//                     <td className="px-5 py-4 text-sm text-zinc-300">
//                       {patient.phoneNumber || "-"}
//                     </td>

//                     <td className="px-5 py-4 text-sm text-zinc-300">
//                       {getAreaLabel(patient)}
//                     </td>

//                     <td className="px-5 py-4 text-sm text-zinc-300">
//                       {patient.district || "-"} / {patient.mohArea || "-"}
//                     </td>

//                     <td className="px-5 py-4 text-sm text-zinc-300">
//                       {getPatientStage(patient)}
//                     </td>

//                     <td className="px-5 py-4 text-right">
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                         }}
//                         className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
//                       >
//                         <MoreVertical className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-zinc-400">
//           <span>
//             {loading
//               ? "Loading patients..."
//               : `Displaying ${filteredPatients.length} assigned patient(s)`}
//           </span>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               className="rounded-lg border border-white/10 px-3 py-1.5 opacity-50"
//               disabled
//             >
//               ←
//             </button>
//             <button
//               type="button"
//               className="rounded-lg border border-white/10 px-3 py-1.5 opacity-50"
//               disabled
//             >
//               →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }