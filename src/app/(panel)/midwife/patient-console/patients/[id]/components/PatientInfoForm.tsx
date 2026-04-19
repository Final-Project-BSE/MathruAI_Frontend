"use client";

import type { AssignedUserProfileUpdateRequestDto } from "@/app/api/midwife-patient/types";

type PatientInfoFormProps = {
  form: AssignedUserProfileUpdateRequestDto;
  email: string;
  setForm: React.Dispatch<React.SetStateAction<AssignedUserProfileUpdateRequestDto>>;
};

export default function PatientInfoForm({ form, email, setForm }: PatientInfoFormProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm text-zinc-400">First name</span>
        <input
          value={form.firstName || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">Last name</span>
        <input
          value={form.lastName || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">Phone number</span>
        <input
          value={form.phoneNumber || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">Date of birth</span>
        <input
          type="date"
          value={form.dateOfBirth || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm text-zinc-400">Email</span>
        <input
          value={email}
          readOnly
          className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">National ID</span>
        <input
          value={form.nationalIdNumber || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, nationalIdNumber: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">Area</span>
        <input
          value={form.area || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">District</span>
        <input
          value={form.district || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-400">MOH area</span>
        <input
          value={form.mohArea || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, mohArea: e.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm text-zinc-400">Address</span>
        <textarea
          value={form.address || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
      </label>
    </div>
  );
}