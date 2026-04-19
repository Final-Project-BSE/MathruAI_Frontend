// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Activity,
//   AlertTriangle,
//   HeartPulse,
//   Loader2,
//   Pencil,
//   Plus,
//   ShieldAlert,
//   X,
// } from "lucide-react";
// import type {
//   HealthMonitoringResponseDto,
//   HealthMonitoringUpsertRequestDto,
// } from "../../../../../../api/healthmonitor/types";
// import { formatDate } from "./lib/utils";
// import {
//   getCachedHealthMonitoringBundle,
//   setCachedHealthMonitoringBundle,
// } from "./lib/patientConsoleCache";

// type HealthMonitoringCardProps = {
//   patientId: number;
//   monitoring: HealthMonitoringResponseDto | null;
//   history?: HealthMonitoringResponseDto[];
//   loadingHistory?: boolean;
//   saving?: boolean;
//   canEdit?: boolean;
//   onSave: (payload: HealthMonitoringUpsertRequestDto) => void | Promise<void>;
//   onSelectHistory?: (record: HealthMonitoringResponseDto) => void;
// };

// type FormState = {
//   age: string;
//   systolicBP: string;
//   diastolicBP: string;
//   bs: string;
//   bodyTemp: string;
//   bmi: string;
//   heartRate: string;
//   previousComplications: string;
//   preexistingDiabetes: string;
//   gestationalDiabetes: string;
//   mentalHealth: string;
// };

// function buildFormState(
//   monitoring: HealthMonitoringResponseDto | null
// ): FormState {
//   return {
//     age: monitoring?.age?.toString() ?? "",
//     systolicBP: monitoring?.systolicBP?.toString() ?? "",
//     diastolicBP: monitoring?.diastolicBP?.toString() ?? "",
//     bs: monitoring?.bs?.toString() ?? "",
//     bodyTemp: monitoring?.bodyTemp?.toString() ?? "",
//     bmi: monitoring?.bmi?.toString() ?? "",
//     heartRate: monitoring?.heartRate?.toString() ?? "",
//     previousComplications: String(monitoring?.previousComplications ?? 0),
//     preexistingDiabetes: String(monitoring?.preexistingDiabetes ?? 0),
//     gestationalDiabetes: String(monitoring?.gestationalDiabetes ?? 0),
//     mentalHealth: String(monitoring?.mentalHealth ?? 0),
//   };
// }

// function toNumber(value: string) {
//   return Number(value);
// }

// function Metric({
//   label,
//   value,
//   suffix,
// }: {
//   label: string;
//   value: string | number | undefined | null;
//   suffix?: string;
// }) {
//   const display =
//     value === undefined || value === null || value === "" ? "-" : value;

//   return (
//     <div className="rounded-xl border border-white/10 bg-zinc-900 p-3">
//       <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
//       <div className="mt-1 text-base font-semibold text-white">
//         {display}
//         {display !== "-" && suffix ? (
//           <span className="ml-1 text-sm text-zinc-400">{suffix}</span>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// function BinaryBadge({ label, value }: { label: string; value?: number }) {
//   const active = value === 1;

//   return (
//     <div
//       className={`rounded-lg border px-3 py-2 text-xs ${
//         active
//           ? "border-red-500/30 bg-red-500/10 text-red-200"
//           : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
//       }`}
//     >
//       <span className="font-medium">{label}:</span> {active ? "Yes" : "No"}
//     </div>
//   );
// }

// function riskTone(riskLevel?: string) {
//   const level = (riskLevel || "").toLowerCase();

//   if (level.includes("high")) {
//     return {
//       badge: "border-red-500/30 bg-red-500/10 text-red-200",
//       alert: "border-red-500/20 bg-red-500/10 text-red-100",
//       icon: <ShieldAlert className="h-4 w-4" />,
//       title: "High-risk condition detected",
//     };
//   }

//   if (level.includes("mid") || level.includes("moderate")) {
//     return {
//       badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
//       alert: "border-amber-500/20 bg-amber-500/10 text-amber-100",
//       icon: <AlertTriangle className="h-4 w-4" />,
//       title: "Patient needs closer observation",
//     };
//   }

//   return {
//     badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
//     alert: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
//     icon: <HeartPulse className="h-4 w-4" />,
//     title: "Current condition looks stable",
//   };
// }

// function Select01({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
// }) {
//   return (
//     <label className="space-y-2">
//       <span className="text-sm text-zinc-400">{label}</span>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//       >
//         <option value="0">No</option>
//         <option value="1">Yes</option>
//       </select>
//     </label>
//   );
// }

// export default function HealthMonitoringCard({
//   patientId,
//   monitoring,
//   history = [],
//   loadingHistory = false,
//   saving = false,
//   canEdit = true,
//   onSave,
//   onSelectHistory,
// }: HealthMonitoringCardProps) {
//   const initialCache = useMemo(
//     () => getCachedHealthMonitoringBundle(patientId),
//     [patientId]
//   );

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedHistoryMonitoring, setSelectedHistoryMonitoring] =
//     useState<HealthMonitoringResponseDto | null>(null);
//   const [latestMonitoring, setLatestMonitoring] =
//     useState<HealthMonitoringResponseDto | null>(
//       monitoring ?? initialCache?.monitoring ?? null
//     );
//   const [form, setForm] = useState<FormState>(
//     buildFormState(monitoring ?? initialCache?.monitoring ?? null)
//   );
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (monitoring) {
//       setLatestMonitoring(monitoring);
//     }
//   }, [monitoring]);

//   const historyOptions = useMemo(() => {
//     const cachedHistory = initialCache?.history ?? [];
//     const items = [monitoring, latestMonitoring, ...history, ...cachedHistory].filter(
//       (item): item is HealthMonitoringResponseDto => Boolean(item)
//     );

//     const unique = new Map<number | string, HealthMonitoringResponseDto>();
//     items.forEach((item) => {
//       unique.set(item.id, item);
//     });

//     return Array.from(unique.values()).sort((a, b) => {
//       const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
//       const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
//       return bTime - aTime;
//     });
//   }, [initialCache?.history, monitoring, latestMonitoring, history]);

//   useEffect(() => {
//     if (!latestMonitoring && historyOptions.length === 0) return;

//     setCachedHealthMonitoringBundle(patientId, {
//       monitoring: latestMonitoring,
//       history: historyOptions,
//     });
//   }, [patientId, latestMonitoring, historyOptions]);

//   useEffect(() => {
//     if (!showDetailsModal) {
//       setSelectedHistoryMonitoring(null);
//     }
//   }, [showDetailsModal]);

//   const popupMonitoring = selectedHistoryMonitoring ?? latestMonitoring;

//   const mainTone = useMemo(
//     () => riskTone(latestMonitoring?.riskLevel),
//     [latestMonitoring?.riskLevel]
//   );

//   const popupTone = useMemo(
//     () => riskTone(popupMonitoring?.riskLevel),
//     [popupMonitoring?.riskLevel]
//   );

//   const mainHighRiskBreakdown = useMemo(() => {
//     if (!latestMonitoring?.riskProbabilities) return [];

//     return Object.entries(latestMonitoring.riskProbabilities).filter(([label]) =>
//       label.toLowerCase().includes("high")
//     );
//   }, [latestMonitoring?.riskProbabilities]);

//   const popupHighRiskBreakdown = useMemo(() => {
//     if (!popupMonitoring?.riskProbabilities) return [];

//     return Object.entries(popupMonitoring.riskProbabilities).filter(([label]) =>
//       label.toLowerCase().includes("high")
//     );
//   }, [popupMonitoring?.riskProbabilities]);

//   async function handleSubmit() {
//     try {
//       setError("");

//       const requiredEntries: Array<[string, string]> = [
//         ["Age", form.age],
//         ["Systolic BP", form.systolicBP],
//         ["Diastolic BP", form.diastolicBP],
//         ["Blood Sugar", form.bs],
//         ["Body Temperature", form.bodyTemp],
//         ["BMI", form.bmi],
//         ["Heart Rate", form.heartRate],
//       ];

//       const missing = requiredEntries.find(([, value]) => value.trim() === "");
//       if (missing) {
//         setError(`${missing[0]} is required.`);
//         return;
//       }

//       const payload: HealthMonitoringUpsertRequestDto = {
//         age: toNumber(form.age),
//         systolicBP: toNumber(form.systolicBP),
//         diastolicBP: toNumber(form.diastolicBP),
//         bs: toNumber(form.bs),
//         bodyTemp: toNumber(form.bodyTemp),
//         bmi: toNumber(form.bmi),
//         heartRate: toNumber(form.heartRate),
//         previousComplications: toNumber(form.previousComplications),
//         preexistingDiabetes: toNumber(form.preexistingDiabetes),
//         gestationalDiabetes: toNumber(form.gestationalDiabetes),
//         mentalHealth: toNumber(form.mentalHealth),
//       };

//       const invalid = Object.entries(payload).find(([, value]) =>
//         Number.isNaN(value)
//       );

//       if (invalid) {
//         setError(`Invalid value for ${invalid[0]}.`);
//         return;
//       }

//       await onSave(payload);
//       setShowEditModal(false);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to save health monitoring data."
//       );
//     }
//   }

//   const editTarget = showDetailsModal ? popupMonitoring : latestMonitoring;

//   return (
//     <>
//       <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
//         <div className="mb-4 flex items-start justify-between gap-3">
//           <div>
//             <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
//               <Activity className="h-5 w-5 text-zinc-300" />
//               Health Monitoring
//             </h2>
//             <p className="mt-1 text-sm text-zinc-500">
//               Latest risk summary for this patient.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             {latestMonitoring ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedHistoryMonitoring(latestMonitoring);
//                   setShowDetailsModal(true);
//                 }}
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
//               >
//                 See More Details
//               </button>
//             ) : null}

//             {canEdit ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setForm(buildFormState(editTarget));
//                   setError("");
//                   setShowEditModal(true);
//                 }}
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
//               >
//                 {latestMonitoring ? (
//                   <Pencil className="h-4 w-4" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 {latestMonitoring ? "Update Data" : "Add Data"}
//               </button>
//             ) : null}
//           </div>
//         </div>

//         {!latestMonitoring ? (
//           <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-sm text-zinc-500">
//             No health monitoring data available yet.
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex flex-wrap items-center gap-3">
//               <span className={`rounded-full border px-3 py-1 text-xs font-medium ${mainTone.badge}`}>
//                 Risk Level: {latestMonitoring.riskLevel || "Unknown"}
//               </span>

//               <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
//                 Risk Confidence: {Math.round((latestMonitoring.riskConfidence || 0) * 100)}%
//               </span>

//               <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
//                 Updated: {formatDate(latestMonitoring.updatedAt || latestMonitoring.createdAt)}
//               </span>
//             </div>

//             {mainHighRiskBreakdown.length > 0 ? (
//               <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
//                 <div className="mb-3 text-sm font-medium text-zinc-200">Risk Level</div>
//                 <div className="space-y-2">
//                   {mainHighRiskBreakdown.map(([label, value]) => {
//                     const percent = Math.max(0, Math.min(100, Number(value) * 100));

//                     return (
//                       <div key={label}>
//                         <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
//                           <span>{Math.round(percent)}%</span>
//                         </div>
//                         <div className="h-2 overflow-hidden rounded-full bg-black/40">
//                           <div
//                             className="h-full rounded-full bg-white"
//                             style={{ width: `${percent}%` }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         )}
//       </section>

//       {showDetailsModal && popupMonitoring ? (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
//           <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
//             <div className="sticky top-0 border-b border-white/10 bg-black px-5 py-4">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="w-full">
//                   <h3 className="text-lg font-semibold text-white">
//                     Health Monitoring Details
//                   </h3>
//                   <p className="text-sm text-zinc-400">
//                     Select a record to view historical details.
//                   </p>

//                   <div className="mt-4 max-w-md">
//                     <label className="space-y-2">
//                       <span className="text-sm text-zinc-400">Select History Record</span>
//                       <select
//                         value={String(popupMonitoring.id)}
//                         onChange={(e) => {
//                           const selected = historyOptions.find(
//                             (item) => String(item.id) === e.target.value
//                           );
//                           if (selected) {
//                             setSelectedHistoryMonitoring(selected);
//                             onSelectHistory?.(selected);
//                           }
//                         }}
//                         className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                       >
//                         {historyOptions.map((item) => (
//                           <option key={item.id} value={String(item.id)}>
//                             {formatDate(item.updatedAt || item.createdAt)} -{" "}
//                             {item.riskLevel || "Unknown"} Risk
//                           </option>
//                         ))}
//                       </select>
//                     </label>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setShowDetailsModal(false)}
//                   className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
//                   aria-label="Close"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-4 p-5">
//               <div className="flex flex-wrap items-center gap-3">
//                 <span className={`rounded-full border px-3 py-1 text-xs font-medium ${popupTone.badge}`}>
//                   Risk Level: {popupMonitoring.riskLevel || "Unknown"}
//                 </span>

//                 <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
//                   Risk Confidence: {Math.round((popupMonitoring.riskConfidence || 0) * 100)}%
//                 </span>

//                 <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
//                   Updated: {formatDate(popupMonitoring.updatedAt || popupMonitoring.createdAt)}
//                 </span>
//               </div>

//               {popupHighRiskBreakdown.length > 0 ? (
//                 <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
//                   <div className="mb-3 text-sm font-medium text-zinc-200">Risk Level</div>
//                   <div className="space-y-2">
//                     {popupHighRiskBreakdown.map(([label, value]) => {
//                       const percent = Math.max(0, Math.min(100, Number(value) * 100));

//                       return (
//                         <div key={label}>
//                           <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
//                             <span>{Math.round(percent)}%</span>
//                           </div>
//                           <div className="h-2 overflow-hidden rounded-full bg-black/40">
//                             <div
//                               className="h-full rounded-full bg-white"
//                               style={{ width: `${percent}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ) : null}

//               <div className={`rounded-xl border px-4 py-3 ${popupTone.alert}`}>
//                 <div className="flex items-start gap-2">
//                   <span className="mt-0.5">{popupTone.icon}</span>
//                   <div>
//                     <div className="font-medium">{popupTone.title}</div>
//                     <div className="mt-1 text-sm opacity-90">
//                       {popupMonitoring.healthAdvice || "No health advice available."}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
//                 <Metric label="Age" value={popupMonitoring.age} suffix="years" />
//                 <Metric label="Systolic BP" value={popupMonitoring.systolicBP} suffix="mmHg" />
//                 <Metric label="Diastolic BP" value={popupMonitoring.diastolicBP} suffix="mmHg" />
//                 <Metric label="Blood Sugar" value={popupMonitoring.bs} suffix="mg/dL" />
//                 <Metric label="Body Temp" value={popupMonitoring.bodyTemp} suffix="°F" />
//                 <Metric label="BMI" value={popupMonitoring.bmi} />
//                 <Metric label="Heart Rate" value={popupMonitoring.heartRate} suffix="bpm" />
//                 <Metric label="Record ID" value={popupMonitoring.id} />
//               </div>

//               <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
//                 <BinaryBadge label="Previous Complications" value={popupMonitoring.previousComplications} />
//                 <BinaryBadge label="Preexisting Diabetes" value={popupMonitoring.preexistingDiabetes} />
//                 <BinaryBadge label="Gestational Diabetes" value={popupMonitoring.gestationalDiabetes} />
//                 <BinaryBadge label="Mental Health Concerns" value={popupMonitoring.mentalHealth} />
//               </div>

//               {popupMonitoring.patientProfile &&
//               Object.keys(popupMonitoring.patientProfile).length > 0 ? (
//                 <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
//                   <div className="mb-3 text-sm font-medium text-zinc-200">
//                     Patient Profile Summary
//                   </div>
//                   <div className="grid gap-2 md:grid-cols-2">
//                     {Object.entries(popupMonitoring.patientProfile).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
//                       >
//                         <span className="text-zinc-400">{key}: </span>
//                         <span className="text-white">
//                           {Array.isArray(value) ? value.join(", ") : String(value)}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : null}

//               {loadingHistory ? (
//                 <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
//                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                   Loading history
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {showEditModal ? (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
//           <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
//             <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black px-5 py-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-white">
//                   {editTarget ? "Update Health Monitoring" : "Add Health Monitoring"}
//                 </h3>
//                 <p className="text-sm text-zinc-400">
//                   Record vitals and risk factors for the assigned patient.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowEditModal(false)}
//                 className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="space-y-5 p-5">
//               {error ? (
//                 <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
//                   {error}
//                 </div>
//               ) : null}

//               <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Age</span>
//                   <input
//                     type="number"
//                     value={form.age}
//                     onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Systolic BP</span>
//                   <input
//                     type="number"
//                     value={form.systolicBP}
//                     onChange={(e) => setForm((prev) => ({ ...prev, systolicBP: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Diastolic BP</span>
//                   <input
//                     type="number"
//                     value={form.diastolicBP}
//                     onChange={(e) => setForm((prev) => ({ ...prev, diastolicBP: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Blood Sugar</span>
//                   <input
//                     type="number"
//                     value={form.bs}
//                     onChange={(e) => setForm((prev) => ({ ...prev, bs: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Body Temperature</span>
//                   <input
//                     type="number"
//                     value={form.bodyTemp}
//                     onChange={(e) => setForm((prev) => ({ ...prev, bodyTemp: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">BMI</span>
//                   <input
//                     type="number"
//                     value={form.bmi}
//                     onChange={(e) => setForm((prev) => ({ ...prev, bmi: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <label className="space-y-2">
//                   <span className="text-sm text-zinc-400">Heart Rate</span>
//                   <input
//                     type="number"
//                     value={form.heartRate}
//                     onChange={(e) => setForm((prev) => ({ ...prev, heartRate: e.target.value }))}
//                     className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
//                   />
//                 </label>

//                 <Select01
//                   label="Previous Complications"
//                   value={form.previousComplications}
//                   onChange={(value) => setForm((prev) => ({ ...prev, previousComplications: value }))}
//                 />

//                 <Select01
//                   label="Preexisting Diabetes"
//                   value={form.preexistingDiabetes}
//                   onChange={(value) => setForm((prev) => ({ ...prev, preexistingDiabetes: value }))}
//                 />

//                 <Select01
//                   label="Gestational Diabetes"
//                   value={form.gestationalDiabetes}
//                   onChange={(value) => setForm((prev) => ({ ...prev, gestationalDiabetes: value }))}
//                 />

//                 <Select01
//                   label="Mental Health"
//                   value={form.mentalHealth}
//                   onChange={(value) => setForm((prev) => ({ ...prev, mentalHealth: value }))}
//                 />
//               </div>

//               <div className="flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={saving}
//                   className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-70"
//                 >
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//                   {editTarget ? "Save Changes" : "Save Data"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </>
//   );
// }