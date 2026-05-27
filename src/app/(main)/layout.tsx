import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";
import { getSession } from "@/lib/authentication";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = { children: React.ReactNode };

export default async function RootLayout({ children }: Props) {
  const session = await getSession();
  const userRole = session?.user?.roles?.[0] || "";

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
        suppressHydrationWarning
      >
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
