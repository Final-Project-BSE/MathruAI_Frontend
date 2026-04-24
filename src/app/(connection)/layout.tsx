import { Geist, Geist_Mono } from "next/font/google";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";
import Navbar from "../(panel)/midwife/components/Navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/authentication";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
};

const PATIENT_ROLES = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

export default async function RootLayout({ children }: Props) {
  const session = await getSession();
  const roles = session?.user?.roles ?? [];
  const userRole = roles[0] ?? "";

  const isPatientUser = roles.some((role) => PATIENT_ROLES.includes(role));

  if (isPatientUser) {
    return (
      <html
        lang="en"
        className={`h-full ${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <body className="h-full antialiased" suppressHydrationWarning>
          <SidebarProvider>
            <div className="flex min-h-svh w-full">
              <AppSidebar userRole={userRole} />
              <main className="flex-1 min-w-0 w-full">
                {children}
              </main>
            </div>
            <ClientFloatingChatbot />
          </SidebarProvider>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-full text-white">
        <div className="flex h-dvh min-h-0 flex-col">
          <div className="shrink-0">
            <Navbar />
          </div>

          <div className="min-h-0 flex-1">
            {children}
          </div>

          <ClientFloatingChatbot />
        </div>
      </body>
    </html>
  );
}