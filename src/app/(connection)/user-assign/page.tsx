import { redirect } from "next/navigation";
import Assignment from "../components/assignment";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "../../api/user/api";
import type { Role } from "../../api/user-assign/types";

const VALID_ROLES: Role[] = [
  "MIDWIFE",
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

function toRoles(input: string[]): Role[] {
  return input.filter((role): role is Role =>
    VALID_ROLES.includes(role as Role)
  );
}

export default async function Page() {
  const session = await getSession();

  if (!session?.user?.token || !session?.user?.roles?.length) {
    redirect("/sign-in");
  }

  const token = session.user.token;
  const roles: Role[] = toRoles(session.user.roles);

  if (roles.length === 0) {
    redirect("/sign-in");
  }

  let currentUser;
  try {
    currentUser = await getcuruser(token);
  } catch {
    redirect("/sign-in");
  }

  return <Assignment userId={currentUser.id} token={token} roles={roles} />;
}