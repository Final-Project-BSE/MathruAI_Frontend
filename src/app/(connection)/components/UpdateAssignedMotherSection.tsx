"use client";

import type {
  AssignedUserProfileUpdateRequestDto,
  UserResponseDto,
} from "../../api/user-assign/types";
import type { AssignmentTranslations } from "./assignmentLang";
import { cn } from "./utils";

type Props = {
  assignedUsers: UserResponseDto[];
  selectedMotherId: number | "";
  setSelectedMotherId: (value: number | "") => void;
  updateForm: AssignedUserProfileUpdateRequestDto;
  setUpdateForm: React.Dispatch<
    React.SetStateAction<AssignedUserProfileUpdateRequestDto>
  >;
  onSubmit: (e: React.FormEvent) => void;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function UpdateAssignedMotherSection({
  assignedUsers,
  selectedMotherId,
  setSelectedMotherId,
  updateForm,
  setUpdateForm,
  onSubmit,
  theme,
  labels,
}: Props) {
  const isLightTheme = theme === "light";

  const inputClass = cn(
    "w-full rounded-md border px-4 py-2 text-xs outline-none",
    isLightTheme
      ? "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#d04f51]"
      : "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-[#d04f51]"
  );

  return (
    <section
      className={cn(
        "rounded-lg border p-5 shadow-xl",
        isLightTheme ? "border-gray-200 bg-white" : "border-white/10 bg-zinc-950"
      )}
    >
      <h2
        className={cn(
          "mb-4 text-md font-semibold",
          isLightTheme ? "text-gray-900" : "text-white"
        )}
      >
        {labels.assignment.updateAssignedMotherProfile}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            className={cn(
              "mb-2 block text-xs font-medium",
              isLightTheme ? "text-gray-700" : "text-gray-300"
            )}
          >
            {labels.assignment.selectAssignedUser}
          </label>
          <select
            value={selectedMotherId}
            onChange={(e) =>
              setSelectedMotherId(e.target.value ? Number(e.target.value) : "")
            }
            className={inputClass}
          >
            <option value="">{labels.assignment.chooseAssignedUser}</option>
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
            placeholder={labels.common.firstName}
            value={updateForm.firstName || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder={labels.common.lastName}
            value={updateForm.lastName || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder={labels.common.phoneNumber}
            value={updateForm.phoneNumber || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder={labels.common.area}
            value={updateForm.area || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, area: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder={labels.common.district}
            value={updateForm.district || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, district: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder={labels.common.mohArea}
            value={updateForm.mohArea || ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({ ...prev, mohArea: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="number"
            step="any"
            placeholder={labels.common.latitude}
            value={updateForm.latitude ?? ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({
                ...prev,
                latitude: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className={inputClass}
          />
          <input
            type="number"
            step="any"
            placeholder={labels.common.longitude}
            value={updateForm.longitude ?? ""}
            onChange={(e) =>
              setUpdateForm((prev) => ({
                ...prev,
                longitude: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            className={inputClass}
          />
        </div>

        <textarea
          placeholder={labels.common.address}
          value={updateForm.address || ""}
          onChange={(e) =>
            setUpdateForm((prev) => ({ ...prev, address: e.target.value }))
          }
          rows={3}
          className={inputClass}
        />

        <button
          type="submit"
          className="rounded-md bg-[#d04f51] px-5 py-2 text-sm text-white transition hover:bg-[#e86466]"
        >
          {labels.assignment.updateProfile}
        </button>
      </form>
    </section>
  );
}
