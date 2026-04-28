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
import { isDateUnavailable, isPastDate, toIsoDate } from "./utils";
import UnavailableDateCalendar from "./UnavailableDateCalendar";

type NewAppointmentFormProps = {
  unavailableDates: string[];
  bookedSlots?: string[];
  reasonByDate?: Record<string, string>;
  defaultLocation?: string;
  submitting?: boolean;
  slotLoading?: boolean;
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <UnavailableDateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          unavailableDates={unavailableDates}
          reasonByDate={reasonByDate}
        />

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Available Time
          </label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-white">
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
            <p className="text-[11px] text-zinc-400">Loading booked slots...</p>
          ) : null}

          {!slotLoading && selectedDate && availableSlots.length === 0 ? (
            <p className="text-[11px] text-amber-300">All time slots are booked for this date.</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            End Time Optional
          </label>
          <Input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="border-white/10 bg-white/5 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Appointment Type
          </label>
          <Select
            value={appointmentType}
            onValueChange={(value) => setAppointmentType(value as AppointmentTypeCode)}
          >
            <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-white">
              {APPOINTMENT_TYPE_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Location
          </label>
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Ex: Nawala Clinic"
            className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#d04f51] text-white hover:bg-[#b94245]"
        >
          {submitting ? "Saving..." : "Create Appointment"}
        </Button>
      </div>
    </div>
  );
}
