import { redirect } from "next/navigation";
import { getSession } from "@/lib/authentication";
import AdminUsersMapPage from "../components/AdminUsersMapPage";

export default async function RegisteredUsersMapAdminPage() {
  const session = await getSession();

  if (!session?.user?.token || !session.user.roles?.includes("ADMIN")) {
    redirect("/sign-in");
  }

  return <AdminUsersMapPage token={session.user.token} />;
}
