import { redirect } from "next/navigation";
import { getSession } from "@/lib/authentication";
import AdminKnowledgeBasePage from "../components/AdminKnowledgeBasePage";

export default async function AdminKnowledgeBaseUploadPage() {
  const session = await getSession();

  if (!session?.user?.token || !session.user.roles?.includes("ADMIN")) {
    redirect("/sign-in");
  }

  return <AdminKnowledgeBasePage token={session.user.token} />;
}
