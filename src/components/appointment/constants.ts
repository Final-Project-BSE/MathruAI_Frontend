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
  {
    label: string;
    lightClassName: string;
    darkClassName: string;
  }
> = {
  SCHEDULED: {
    label: "Scheduled",
    lightClassName: "border-blue-500/30 bg-blue-500/10 text-blue-700",
    darkClassName: "border-blue-400/30 bg-blue-500/10 text-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    lightClassName: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    darkClassName: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  },
  CANCELED: {
    label: "Canceled",
    lightClassName: "border-red-500/30 bg-red-500/10 text-red-700",
    darkClassName: "border-red-400/30 bg-red-500/10 text-red-200",
  },
};
