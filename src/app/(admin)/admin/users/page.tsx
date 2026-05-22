import { redirect } from "next/navigation";
import { getSession } from "@/lib/authentication";
import AdminUsersPage from "../components/AdminUsersPage";

export default async function UsersManagementPage() {
  const session = await getSession();

  if (!session?.user?.token || !session.user.roles?.includes("ADMIN")) {
    redirect("/sign-in");
  }

  return <AdminUsersPage token={session.user.token} />;
}
