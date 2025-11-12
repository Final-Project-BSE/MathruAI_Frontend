// redirect to dashboard
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/sign-in");
}
