import type { Role } from "../../api/user-assign/types";
import type { AssignmentTranslations } from "./assignmentLang";
import { motherRoles } from "./constants";

export function hasMidwifeRole(roles: Role[]) {
  return roles.includes("MIDWIFE");
}

export function hasMotherRole(roles: Role[]) {
  return roles.some((role) => motherRoles.includes(role));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function getReadableRoleLabel(
  roles: Role[],
  t?: AssignmentTranslations
) {
  if (roles.includes("MIDWIFE")) return t?.roleLabels.MIDWIFE ?? "Midwife";
  if (roles.includes("PREGNANT_MOTHER")) {
    return t?.roleLabels.PREGNANT_MOTHER ?? "Pregnant Mother";
  }
  if (roles.includes("POST_PREGNANT_MOTHER")) {
    return t?.roleLabels.POST_PREGNANT_MOTHER ?? "Post Pregnant Mother";
  }
  if (roles.includes("HOPE_TO_PREGNANT_MOTHER")) {
    return t?.roleLabels.HOPE_TO_PREGNANT_MOTHER ?? "Hope To Pregnant Mother";
  }
  return roles.join(", ");
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getRequestStatusClass(status?: string) {
  return cn(
    "rounded-full px-3 py-1 text-xs font-medium",
    status === "PENDING" && "bg-yellow-500/15 text-yellow-300",
    status === "APPROVED" && "bg-emerald-500/15 text-emerald-300",
    status === "REJECTED" && "bg-red-500/15 text-red-300",
    status === "ASSIGNED" && "bg-green-400 text-white",
    status === "AVAILABLE" && "bg-emerald-500/15 text-emerald-300",
    !status && "bg-blue-500/15 text-blue-300"
  );
}
