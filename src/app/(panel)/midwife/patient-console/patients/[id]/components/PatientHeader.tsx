// "use client";

// import { ArrowLeft, Loader2, RefreshCw, Save } from "lucide-react";

// type PatientHeaderProps = {
//   fullName: string;
//   patientStage: string;
//   saving: boolean;
//   canEditProfile?: boolean;
//   onBack: () => void;
//   onRefresh: () => void;
//   onSave: () => void;
// };

// export default function PatientHeader({
//   fullName,
//   patientStage,
//   saving,
//   canEditProfile,
//   onBack,
//   onRefresh,
//   onSave,
// }: PatientHeaderProps) {
//   return (
//     <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
//       <div className="space-y-1">
//         <button
//           onClick={onBack}
//           className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to patients
//         </button>

//         <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
//         <p className="text-sm text-zinc-400">{patientStage}</p>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           onClick={onRefresh}
//           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </button>

//         <button
//           onClick={onSave}
//           disabled={saving || !canEditProfile}
//           className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }