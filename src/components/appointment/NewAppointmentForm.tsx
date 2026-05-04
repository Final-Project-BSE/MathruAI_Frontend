"use client";

import { useEffect, useMemo, useState } from "react";
import { parse } from "date-fns";
import type {
  AppointmentCreateRequestDto,
  AppointmentTypeCode,
} from "@/app/api/appointment/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPOINTMENT_TIME_OPTIONS, APPOINTMENT_TYPE_OPTIONS } from "./constants";
import type { AppointmentTheme } from "./utils";
import { isDateUnavailable, isPastDate, toIsoDate } from "./utils";
import UnavailableDateCalendar from "./UnavailableDateCalendar";

type NewAppointmentFormProps = {
  unavailableDates: string[];
  bookedSlots?: string[];
  reasonByDate?: Record<string, string>;
  defaultLocation?: string;
  submitting?: boolean;
  slotLoading?: boolean;
  theme?: AppointmentTheme;
  onDateChange?: (date?: Date) => void;
  onCancel: () => void;
  onSubmit: (payload: AppointmentCreateRequestDto) => void | Promise<void>;
};

export default function NewAppointmentForm({
  unavailableDates,
  bookedSlots = [],
  reasonByDate = {},
  defaultLocation = "",
  submitting = false,
  slotLoading = false,
  theme = "light",
  onDateChange,
  onCancel,
  onSubmit,
}: NewAppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentType, setAppointmentType] =
    useState<AppointmentTypeCode>("ANTENATAL_CHECKUP");
  const [location, setLocation] = useState(defaultLocation);
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const unavailableDateSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const bookedSlotSet = useMemo(
    () => new Set(bookedSlots.map((slot) => String(slot).trim().slice(0, 5))),
    [bookedSlots]
  );

  const availableSlots = useMemo(
    () => APPOINTMENT_TIME_OPTIONS.filter((time) => !bookedSlotSet.has(time)),
    [bookedSlotSet]
  );

  useEffect(() => {
    if (!startTime) return;
    if (availableSlots.includes(startTime as (typeof APPOINTMENT_TIME_OPTIONS)[number])) {
      return;
    }

    // If availability changed and selected slot is no longer valid, clear it.
    setStartTime("");
  }, [availableSlots, startTime]);

  function handleDateChange(nextDate?: Date) {
    setSelectedDate(nextDate);
    setStartTime("");
    onDateChange?.(nextDate);
  }

  async function handleSubmit() {
    setError("");

    if (!selectedDate) {
      setError("Please select an appointment date.");
      return;
    }

    if (isPastDate(selectedDate)) {
      setError("Past dates cannot be booked.");
      return;
    }

    if (isDateUnavailable(selectedDate, unavailableDateSet)) {
      setError("This date is unavailable. Please choose another date.");
      return;
    }

    if (!startTime) {
      setError("Please select an available time.");
      return;
    }

    if (bookedSlotSet.has(startTime)) {
      setError("Selected time slot is already booked.");
      return;
    }

    const combinedDateTime = parse(
      `${toIsoDate(selectedDate)} ${startTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    if (Number.isNaN(combinedDateTime.getTime()) || combinedDateTime < new Date()) {
      setError("Past date/time cannot be booked.");
      return;
    }

    if (!location.trim()) {
      setError("Please add a location.");
      return;
    }

    await onSubmit({
      appointmentDate: toIsoDate(selectedDate),
      startTime,
      endTime: endTime || null,
      appointmentType,
      location: location.trim(),
    });
  }

  const panelClassName = isDark
    ? "rounded-lg border border-white/10 bg-black p-4 shadow-sm"
    : "rounded-lg bg-white p-4 shadow-sm";

  const labelClassName = isDark
    ? "text-xs font-medium uppercase tracking-wide text-zinc-200"
    : "text-xs font-medium uppercase tracking-wide text-zinc-900";

  const fieldClassName = isDark
    ? "rounded-lg border border-white/10 bg-white/5 text-zinc-100 shadow-sm"
    : "rounded-lg border border-[#d04f51]/20 bg-[#d04f51]/10 text-zinc-900 shadow-sm";

  const selectContentClassName = isDark
    ? "rounded-lg border-white/10 bg-zinc-950 text-zinc-100 shadow"
    : "rounded-lg border-gray-200 bg-white text-black shadow";

  return (
    <div className="space-y-6">
      <div className={panelClassName}>
        <div className="grid gap-4 md:grid-cols-2">
          <UnavailableDateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            unavailableDates={unavailableDates}
            reasonByDate={reasonByDate}
            theme={theme}
          />

          <div className="space-y-2">
            <label className={labelClassName}>Available Time</label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className={`w-full ${fieldClassName}`}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                {availableSlots.length ? (
                  availableSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="NO_SLOTS" disabled>
                    No available slots
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {slotLoading ? (
              <p className={isDark ? "text-[11px] text-zinc-400" : "text-[11px] text-zinc-600"}>
                Loading booked slots...
              </p>
            ) : null}

            {!slotLoading && selectedDate && availableSlots.length === 0 ? (
              <p className={isDark ? "text-[11px] text-amber-300" : "text-[11px] text-amber-600"}>
                All time slots are booked for this date.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName}>End Time (Optional)</label>
            <Input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className={`${fieldClassName} ${isDark ? "[color-scheme:dark]" : ""}`}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName}>Appointment Type</label>
            <Select
              value={appointmentType}
              onValueChange={(value) => setAppointmentType(value as AppointmentTypeCode)}
            >
              <SelectTrigger className={`w-full ${fieldClassName}`}>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                {APPOINTMENT_TYPE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>Location</label>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ex: Nawala Clinic"
              className={
                isDark
                  ? "rounded-lg border border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 shadow-sm"
                  : "rounded-lg border border-[#d04f51]/20 bg-[#d04f51]/10 text-zinc-900 placeholder:text-zinc-500 shadow-sm"
              }
            />
          </div>
        </div>

        {error ? (
          <div
            className={
              isDark
                ? "rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200"
                : "rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700"
            }
          >
            {error}
          </div>
        ) : null}

        <div className="mt-3 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={
              isDark
                ? "border-white/10 bg-white/5 text-zinc-100 shadow-sm hover:bg-white/10"
                : "border-gray-200 bg-white text-zinc-700 shadow-sm hover:bg-pink-50"
            }
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#d04f51] text-white shadow hover:bg-[#b94245]"
          >
            {submitting ? "Saving..." : "Create Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
