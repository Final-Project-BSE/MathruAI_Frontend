import { format, isValid, parse } from "date-fns";
import type {
  AppointmentResponseDto,
  AppointmentTypeCode,
} from "@/app/api/appointment/types";
import { APPOINTMENT_TYPE_OPTIONS } from "./constants";

export function normalizeDateString(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "yyyy-MM-dd");
}

export function formatAppointmentDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }
  return format(date, "EEE, MMM d, yyyy");
}

export function formatTimeLabel(time24: string) {
  const [hoursRaw, minutesRaw] = time24.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time24;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
  const minuteLabel = String(minutes).padStart(2, "0");
  return `${normalizedHour}:${minuteLabel} ${suffix}`;
}

export function getAppointmentTypeLabel(type: AppointmentTypeCode | string) {
  return (
    APPOINTMENT_TYPE_OPTIONS.find((item) => item.value === type)?.label ||
    String(type)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  return selected < today;
}

export function isDateUnavailable(date: Date, unavailableDateSet: Set<string>) {
  return unavailableDateSet.has(format(date, "yyyy-MM-dd"));
}

export function toIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function toAppointmentTimestamp(
  appointmentDate: string,
  startTime: string
) {
  const dateValue = String(appointmentDate || "").trim();
  const timeValue = String(startTime || "").trim();
  const candidates: Date[] = [];

  if (dateValue && timeValue) {
    candidates.push(new Date(`${dateValue}T${timeValue}`));

    const combined = `${dateValue} ${timeValue}`;
    candidates.push(parse(combined, "yyyy-MM-dd HH:mm", new Date()));
    candidates.push(parse(combined, "yyyy-MM-dd HH:mm:ss", new Date()));
    candidates.push(parse(combined, "yyyy-MM-dd hh:mm a", new Date()));
    candidates.push(parse(combined, "yyyy-MM-dd h:mm a", new Date()));
    candidates.push(parse(combined, "yyyy/MM/dd HH:mm", new Date()));
    candidates.push(parse(combined, "yyyy/MM/dd hh:mm a", new Date()));
  }

  if (dateValue) {
    candidates.push(new Date(dateValue));
  }

  for (const candidate of candidates) {
    if (!Number.isNaN(candidate.getTime()) && isValid(candidate)) {
      return candidate.getTime();
    }
  }

  return null;
}

export function sortAppointmentsByDateTime(appointments: AppointmentResponseDto[]) {
  return [...appointments].sort((a, b) => {
    const aTime = toAppointmentTimestamp(a.appointmentDate, a.startTime);
    const bTime = toAppointmentTimestamp(b.appointmentDate, b.startTime);

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;

    return aTime - bTime;
  });
}
