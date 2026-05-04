// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CalendarPlus } from "lucide-react";
// import { appointmentApi } from "@/app/api/appointment/api";
// import type {
//   AppointmentCreateRequestDto,
//   AppointmentResponseDto,
// } from "@/app/api/appointment/types";
// import type { Role } from "@/app/api/user-assign/types";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import CurrentAppointmentsList from "./CurrentAppointmentsList";
// import NewAppointmentForm from "./NewAppointmentForm";
// import { getAppointmentThemeFromRoles, sortAppointmentsByDateTime } from "./utils";

// type AppointmentManagerDialogProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   title?: string;
//   description?: string;
//   token?: string;
//   midwifeId?: number | null;
//   patientId?: number;
//   roles?: Role[];
//   initialAppointments?: AppointmentResponseDto[];
//   defaultLocation?: string;
//   onAppointmentsChange?: (appointments: AppointmentResponseDto[]) => void;
// };

// function byMostRecentFirst(appointments: AppointmentResponseDto[]) {
//   return [...appointments].sort((a, b) => {
//     const aTime = new Date(`${a.appointmentDate}T${a.startTime}`).getTime();
//     const bTime = new Date(`${b.appointmentDate}T${b.startTime}`).getTime();
//     return bTime - aTime;
//   });
// }

// export default function AppointmentManagerDialog({
//   open,
//   onOpenChange,
//   title = "Appointments",
//   description = "Manage current and upcoming patient appointments.",
//   token,
//   midwifeId,
//   patientId,
//   roles,
//   initialAppointments = [],
//   defaultLocation,
//   onAppointmentsChange,
// }: AppointmentManagerDialogProps) {
//   const [appointments, setAppointments] = useState<AppointmentResponseDto[]>(
//     byMostRecentFirst(initialAppointments)
//   );
//   const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
//   const [reasonByDate, setReasonByDate] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [mode, setMode] = useState<"list" | "new">("list");

//   const canUseApi = Boolean(token && midwifeId && patientId);
//   const theme = getAppointmentThemeFromRoles(roles);
//   const isDark = theme === "dark";

//   const scheduledAppointments = useMemo(
//     () => appointments.filter((item) => item.status === "SCHEDULED"),
//     [appointments]
//   );

//   useEffect(() => {
//     setAppointments(byMostRecentFirst(initialAppointments));
//   }, [initialAppointments]);

//   useEffect(() => {
//     if (!open) {
//       setMode("list");
//       setError("");
//       setSuccess("");
//       return;
//     }

//     if (!canUseApi) {
//       return;
//     }

//     let active = true;

//     async function loadData() {
//       try {
//         setLoading(true);
//         setError("");

//         const [appointmentRows, unavailable] = await Promise.all([
//           appointmentApi.getPatientAppointments(token!, midwifeId!, patientId!),
//           appointmentApi.getUnavailableDates(token!, midwifeId!, patientId!),
//         ]);

//         if (!active) return;

//         setAppointments(byMostRecentFirst(appointmentRows));
//         setUnavailableDates(unavailable.dates || []);
//         setReasonByDate(unavailable.reasonByDate || {});
//       } catch (err) {
//         if (!active) return;
//         setError(err instanceof Error ? err.message : "Failed to load appointments.");
//       } finally {
//         if (active) {
//           setLoading(false);
//         }
//       }
//     }

//     void loadData();

//     return () => {
//       active = false;
//     };
//   }, [open, canUseApi, token, midwifeId, patientId]);

//   function pushAppointments(next: AppointmentResponseDto[]) {
//     const sorted = byMostRecentFirst(next);
//     setAppointments(sorted);
//     onAppointmentsChange?.(sorted);
//   }

//   async function handleCreate(payload: AppointmentCreateRequestDto) {
//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       if (canUseApi) {
//         const created = await appointmentApi.createAppointment(
//           token!,
//           midwifeId!,
//           patientId!,
//           payload
//         );

//         pushAppointments([created, ...appointments]);
//       } else {
//         const localAppointment: AppointmentResponseDto = {
//           id: `local-${Date.now()}`,
//           patientId: patientId || 0,
//           midwifeId: midwifeId || undefined,
//           appointmentDate: payload.appointmentDate,
//           startTime: payload.startTime,
//           appointmentType: payload.appointmentType,
//           location: payload.location,
//           notes: payload.notes,
//           status: "SCHEDULED",
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         pushAppointments([localAppointment, ...appointments]);
//       }

//       setSuccess("Appointment created successfully.");
//       setMode("list");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to create appointment.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleCancel(row: AppointmentResponseDto) {
//     try {
//       setActionLoadingId(row.id);
//       setError("");
//       setSuccess("");

//       let updated: AppointmentResponseDto;

//       if (canUseApi) {
//         updated = await appointmentApi.cancelAppointment(
//           token!,
//           midwifeId!,
//           patientId!,
//           row.id
//         );
//       } else {
//         updated = {
//           ...row,
//           status: "CANCELED",
//           updatedAt: new Date().toISOString(),
//         };
//       }

//       pushAppointments(
//         appointments.map((item) => (item.id === row.id ? updated : item))
//       );
//       setSuccess("Appointment canceled.");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to cancel appointment.");
//     } finally {
//       setActionLoadingId(null);
//     }
//   }

//   async function handleComplete(row: AppointmentResponseDto) {
//     try {
//       setActionLoadingId(row.id);
//       setError("");
//       setSuccess("");

//       let updated: AppointmentResponseDto;

//       if (canUseApi) {
//         updated = await appointmentApi.completeAppointment(
//           token!,
//           midwifeId!,
//           patientId!,
//           row.id
//         );
//       } else {
//         updated = {
//           ...row,
//           status: "COMPLETED",
//           updatedAt: new Date().toISOString(),
//         };
//       }

//       pushAppointments(
//         appointments.map((item) => (item.id === row.id ? updated : item))
//       );
//       setSuccess("Appointment marked as completed.");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to complete appointment.");
//     } finally {
//       setActionLoadingId(null);
//     }
//   }

//   async function handleDeleteCompleted(row: AppointmentResponseDto) {
//     try {
//       setActionLoadingId(row.id);
//       setError("");
//       setSuccess("");

//       if (canUseApi) {
//         await appointmentApi.deleteAppointment(token!, midwifeId!, patientId!, row.id);
//       }

//       pushAppointments(appointments.filter((item) => item.id !== row.id));
//       setSuccess("Appointment deleted.");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete appointment.");
//     } finally {
//       setActionLoadingId(null);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className={
//           isDark
//             ? "max-h-[90vh] max-w-4xl overflow-y-auto rounded-xl border border-white/10 bg-black p-6 text-white shadow-lg"
//             : "max-h-[90vh] max-w-4xl overflow-y-auto rounded-xl border-gray-200 bg-pink-50 p-6 text-black shadow-lg"
//         }
//       >
//         <DialogHeader>
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <DialogTitle className={isDark ? "text-zinc-100" : "text-zinc-900"}>{title}</DialogTitle>
//               <DialogDescription className={isDark ? "text-zinc-400" : "text-zinc-600"}>
//                 {description}
//               </DialogDescription>
//             </div>

//             {mode === "list" ? (
//               <Button
//                 type="button"
//                 onClick={() => setMode("new")}
//                 className="bg-[#d04f51] text-white hover:bg-[#b94245]"
//               >
//                 <CalendarPlus className="h-4 w-4" />
//                 New Appointment
//               </Button>
//             ) : null}
//           </div>
//         </DialogHeader>

//         {error ? (
//           <div
//             className={
//               isDark
//                 ? "rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200"
//                 : "rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700"
//             }
//           >
//             {error}
//           </div>
//         ) : null}

//         {success ? (
//           <div
//             className={
//               isDark
//                 ? "rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-200"
//                 : "rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700"
//             }
//           >
//             {success}
//           </div>
//         ) : null}

//         {mode === "list" ? (
//           <div className="space-y-3">
//             <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-600"}>
//               Current scheduled appointments: {scheduledAppointments.length}
//             </p>
//             <CurrentAppointmentsList
//               appointments={sortAppointmentsByDateTime(appointments)}
//               loading={loading}
//               actionLoadingId={actionLoadingId}
//               onCancel={handleCancel}
//               onComplete={handleComplete}
//               onDeleteCompleted={handleDeleteCompleted}
//               glass={true}
//               theme={theme}
//             />
//           </div>
//         ) : (
//           <NewAppointmentForm
//             unavailableDates={unavailableDates}
//             reasonByDate={reasonByDate}
//             defaultLocation={defaultLocation}
//             submitting={saving}
//             theme={theme}
//             onCancel={() => setMode("list")}
//             onSubmit={handleCreate}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
