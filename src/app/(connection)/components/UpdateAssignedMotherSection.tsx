"use client";

import type {
  AssignedUserProfileUpdateRequestDto,
  UserResponseDto,
} from "../../api/user-assign/types";

type Props = {
  assignedUsers: UserResponseDto[];
  selectedMotherId: number | "";
  setSelectedMotherId: (value: number | "") => void;
  updateForm: AssignedUserProfileUpdateRequestDto;
  setUpdateForm: React.Dispatch<
    React.SetStateAction<AssignedUserProfileUpdateRequestDto>
  >;
  onSubmit: (e: React.FormEvent) => void;
};

export default function UpdateAssignedMotherSection({
  assignedUsers,
  selectedMotherId,
  setSelectedMotherId,
  updateForm,
  setUpdateForm,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
      <h2 className="mb-4 text-md font-semibold">Update Assigned Mother Profile</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-300">
            Select Assigned User
          </label>
          <select
            value={selectedMotherId}
            onChange={(e) =>
              setSelectedMotherId(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white outline-none focus:border-[#d04f51]"
          >
            <option value="">Choose assigned user</option>
            {assignedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="First name"
            value={updateForm.firstName || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="text"
            placeholder="Last name"
            value={updateForm.lastName || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="text"
            placeholder="Phone number"
            value={updateForm.phoneNumber || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="text"
            placeholder="Area"
            value={updateForm.area || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, area: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="text"
            placeholder="District"
            value={updateForm.district || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, district: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="text"
            placeholder="MOH Area"
            value={updateForm.mohArea || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, mohArea: e.target.value }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={updateForm.latitude ?? ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({
                ...prev,
                latitude: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={updateForm.longitude ?? ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({
                ...prev,
                longitude: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
          />
        </div>

        <textarea
          placeholder="Address"
          value={updateForm.address || ""}
          onChange={(e) =>
            setUpdateForm((prev) => ({ ...prev, address: e.target.value }))
          }
          rows={3}
          className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
        />

        <button
          type="submit"
          className="rounded-md bg-[#d04f51] px-5 py-1 text-sm text-white transition hover:bg-[#e86466]"
        >
          Update Assigned User
        </button>
      </form>
    </section>
  );
}