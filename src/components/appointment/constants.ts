import type { AppointmentStatus, AppointmentTypeCode } from "@/app/api/appointment/types";

export const APPOINTMENT_TYPE_OPTIONS: Array<{
  value: AppointmentTypeCode;
  label: string;
}> = [
  { value: "ANTENATAL_CHECKUP", label: "Antenatal Checkup" },
  { value: "FERTILITY_CONSULT", label: "Fertility Consult" },
  { value: "POSTPARTUM_FOLLOW_UP", label: "Postpartum Follow-up" },
  { value: "LACTATION_SUPPORT", label: "Lactation Support" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
  { value: "URGENT_ADVICE", label: "Urgent Advice" },
  { value: "VIRTUAL_CHAT", label: "Virtual Chat" },
  { value: "HOME_VISIT", label: "Home Visit" },
  { value: "CLINIC_VISIT", label: "Clinic Visit" },
];

export const APPOINTMENT_TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const APPOINTMENT_STATUS_STYLES: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  },
  CANCELED: {
    label: "Canceled",
    className: "border-red-500/30 bg-red-500/10 text-red-700",
  },
};
