"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  Loader2,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import adminApi from "@/app/api/admin/api";
import type { Role, UserResponseDto, UserUpdateRequest } from "@/app/api/admin/types";

type Props = {
  token: string;
};

const ROLE_OPTIONS: Role[] = [
  "ADMIN",
  "MIDWIFE",
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

type EditState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationalIdNumber: string;
  address: string;
  area: string;
  district: string;
  mohArea: string;
  latitude: string;
  longitude: string;
  roles: Role[];
};

function toEditState(user: UserResponseDto): EditState {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: user.dateOfBirth || "",
    nationalIdNumber: user.nationalIdNumber || "",
    address: user.address || "",
    area: user.area || "",
    district: user.district || "",
    mohArea: user.mohArea || "",
    latitude: user.latitude === undefined || user.latitude === null ? "" : String(user.latitude),
    longitude: user.longitude === undefined || user.longitude === null ? "" : String(user.longitude),
    roles: user.roles || [],
  };
}

function isMother(user: UserResponseDto) {
  return user.roles?.some((role) =>
    ["HOPE_TO_PREGNANT_MOTHER", "PREGNANT_MOTHER", "POST_PREGNANT_MOTHER"].includes(role)
  );
}

function roleBadge(role: string) {
  if (role === "ADMIN") return "bg-zinc-950 text-white";
  if (role === "MIDWIFE") return "bg-[#d04f51]/10 text-[#d04f51]";
  return "bg-rose-50 text-rose-700";
}

export default function AdminUsersPage({ token }: Props) {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [form, setForm] = useState<EditState | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const admins = users.filter((user) => user.roles?.includes("ADMIN")).length;
    const midwives = users.filter((user) => user.roles?.includes("MIDWIFE")).length;
    const patients = users.filter(isMother).length;
    const mapped = users.filter((user) => user.latitude && user.longitude).length;

    return { admins, midwives, patients, mapped, total: users.length };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users.filter((user) => {
      const roleMatch = roleFilter === "ALL" || user.roles?.includes(roleFilter);
      const searchMatch =
        !q ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phoneNumber?.toLowerCase().includes(q) ||
        user.district?.toLowerCase().includes(q) ||
        user.mohArea?.toLowerCase().includes(q);

      return roleMatch && searchMatch;
    });
  }, [users, query, roleFilter]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [token]);

  function startEdit(user: UserResponseDto) {
    setEditingUser(user);
    setForm(toEditState(user));
  }

  function closeEdit() {
    setEditingUser(null);
    setForm(null);
  }

  function toggleRole(role: Role) {
    if (!form) return;

    setForm((prev) => {
      if (!prev) return prev;
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists
          ? prev.roles.filter((item) => item !== role)
          : [...prev.roles, role],
      };
    });
  }

  function buildPayload(): UserUpdateRequest {
    if (!form) return {};

    return {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      dateOfBirth: form.dateOfBirth || undefined,
      nationalIdNumber: form.nationalIdNumber.trim() || undefined,
      address: form.address.trim() || undefined,
      area: form.area.trim() || undefined,
      district: form.district.trim() || undefined,
      mohArea: form.mohArea.trim() || undefined,
      latitude: form.latitude.trim() ? Number(form.latitude) : undefined,
      longitude: form.longitude.trim() ? Number(form.longitude) : undefined,
      roles: form.roles,
    };
  }

  async function saveUser() {
    if (!editingUser || !form) return;

    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert("First name and last name are required.");
      return;
    }

    if (!form.roles.length) {
      alert("A user must have at least one role.");
      return;
    }

    try {
      setSavingId(editingUser.id);
      await adminApi.updateUser(token, editingUser.id, buildPayload());
      closeEdit();
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUser(user: UserResponseDto) {
    const name = `${user.firstName} ${user.lastName}`.trim() || user.email;
    const confirmed = confirm(
      `Delete ${name}?`
    );

    if (!confirmed) return;

    try {
      setSavingId(user.id);
      await adminApi.deleteUser(token, user.id);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="mb-6 overflow-hidden rounded-3xl bg-[#d04f51] p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Admin / User Management
            </p>
            <h1 className="text-xl font-black md:text-2xl">
              Manage every registered user.
            </h1>
            <p className="mt-2 max-w-2xl text-xs text-white/85">
              Edit roles, contact details, service areas, and map coordinates for admins,
              midwives and patients.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5 lg:min-w-[560px]">
            {[
              ["Total", stats.total],
              ["Admins", stats.admins],
              ["Midwives", stats.midwives],
              ["Patients", stats.patients],
              ["Mapped", stats.mapped],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/15 px-4 py-3">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-[11px] font-semibold text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#d04f51]/10 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff2f2] text-[#d04f51]">
              <Users size={19} />
            </div>
            <div>
              <h2 className="text-base font-black">Users</h2>
              <p className="text-xs text-zinc-500">{filteredUsers.length} visible</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-[260px] items-center rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              <Search size={15} className="text-[#d04f51]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, district..."
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "ALL" | Role)}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#d04f51]"
            >
              <option value="ALL">All roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={16} />
            {error}
          </div>
        ) : loading ? (
          <div className="flex min-h-[360px] items-center justify-center text-[#d04f51]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-100">
            <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
              <thead className="bg-[#fff7f7] text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Map</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="align-top hover:bg-[#fffafa]">
                    <td className="px-4 py-4">
                      <p className="font-bold text-zinc-950">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                      <p className="text-xs text-zinc-400">{user.phoneNumber || "No phone"}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex max-w-[280px] flex-wrap gap-1.5">
                        {user.roles?.map((role) => (
                          <span
                            key={`${user.id}-${role}`}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${roleBadge(role)}`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-zinc-600">
                      <p>{user.district || "No district"}</p>
                      <p>{user.mohArea || "No MOH area"}</p>
                      <p>{user.area || "No area"}</p>
                    </td>

                    <td className="px-4 py-4 text-xs text-zinc-600">
                      {user.latitude && user.longitude ? (
                        <>
                          <p>{user.latitude}</p>
                          <p>{user.longitude}</p>
                        </>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                          No coordinates
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(user)}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#fff2f2] px-3 py-2 text-xs font-bold text-[#d04f51] hover:bg-[#ffe7e7]"
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={savingId === user.id}
                          onClick={() => deleteUser(user)}
                          className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredUsers.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                      No users match your filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingUser && form ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white p-5">
              <div>
                <h3 className="text-lg font-black text-zinc-950">Edit User</h3>
                <p className="text-xs text-zinc-500">{editingUser.email}</p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              {[
                ["firstName", "First name"],
                ["lastName", "Last name"],
                ["phoneNumber", "Phone number"],
                ["dateOfBirth", "Date of birth"],
                ["nationalIdNumber", "National ID"],
                ["area", "Area"],
                ["district", "District"],
                ["mohArea", "MOH area"],
                ["latitude", "Latitude"],
                ["longitude", "Longitude"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs font-bold text-zinc-600">
                    {label}
                  </span>
                  <input
                    type={key === "dateOfBirth" ? "date" : "text"}
                    value={String(form[key as keyof EditState] ?? "")}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev ? { ...prev, [key]: e.target.value } : prev
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#d04f51]"
                  />
                </label>
              ))}

              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-bold text-zinc-600">
                  Address
                </span>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev ? { ...prev, address: e.target.value } : prev
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#d04f51]"
                />
              </label>

              <div className="md:col-span-2">
                <p className="mb-2 text-xs font-bold text-zinc-600">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => {
                    const checked = form.roles.includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                          checked
                            ? "border-[#d04f51] bg-[#d04f51] text-white"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-[#fff2f2]"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-zinc-100 bg-white p-5">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingId === editingUser.id}
                onClick={saveUser}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#d04f51] px-5 py-2 text-sm font-bold text-white hover:bg-[#bf4446] disabled:opacity-60"
              >
                {savingId === editingUser.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
