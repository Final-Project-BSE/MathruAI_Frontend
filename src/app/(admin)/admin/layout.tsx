import { redirect } from "next/navigation";
import AdminNavbar from "./components/AdminNavbar";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";

function isAdminRole(roles: string[] | undefined) {
  return Boolean(roles?.some((role) => role === "ADMIN"));
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.token || !isAdminRole(session.user.roles)) {
    redirect("/sign-in");
  }

  let currentUser;

  try {
    currentUser = await getcuruser(session.user.token);
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#fff7f7] text-zinc-950">
      <AdminNavbar
        token={session.user.token}
        currentUser={{
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          profileImageUrl: currentUser.profileImageUrl,
        }}
      />

      {children}
    </div>
  );
}