import type { Role } from "../../api/user-assign/types";

export type MainTab =
  | "search-connect"
  | "assignment"
  | "requests"
  | "update-profile";

export const motherRoles: Role[] = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];
