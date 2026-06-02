import { redirect } from "next/navigation";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "../../../api/user/api";
import type { Role } from "../../../api/user-assign/types";

import TopBar from "./components/TopBar";
import WelcomeHeaderCard from "./components/WelcomeHeaderCard";
import ManagementCards from "./components/ManagementCard";

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

export default async function MidwifeDashboardPage() {
  const session = await getSession();

  if (!session?.user?.token || !session?.user?.roles?.length) {
    redirect("/sign-in");
  }

  const token = session.user.token;
  const roles: Role[] = toRoles(session.user.roles);

  if (!roles.includes("MIDWIFE")) {
    redirect("/sign-in");
  }

  let currentUser;
  try {
    currentUser = await getcuruser(token);
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="bg-[#000000] text-white">
      <WelcomeHeaderCard
        userId={Number(currentUser.id)}
        token={token}
        roles={roles}
      />

      <TopBar />
      <ManagementCards token={token} midwifeId={Number(currentUser.id)} />
    </div>
  );
}