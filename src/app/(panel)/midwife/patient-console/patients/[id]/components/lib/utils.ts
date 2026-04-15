export function getRoleLabel(roles: string[]) {
  if (roles.includes("PREGNANT_MOTHER")) return "Pregnant Mother";
  if (roles.includes("POST_PREGNANT_MOTHER")) return "Post Pregnant Mother";
  if (roles.includes("HOPE_TO_PREGNANT_MOTHER")) return "Hope To Pregnant Mother";
  return roles.join(", ") || "Unknown";
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}