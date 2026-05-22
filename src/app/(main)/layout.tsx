import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";
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

export default async function RootLayout({ children }: Props) {
  const session = await getSession();
  const userRole = session?.user?.roles?.[0] || "";

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <SidebarProvider>
        <AppSidebar userRole={userRole} />

        <main className="w-full">
          {children}
        </main>

        <ClientFloatingChatbot />
      </SidebarProvider>
    </div>
  );
}