import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider } from "@/components/ui/sidebar";
import { MidwifeAppSidebar } from "@/components/midwife/midwife-app-sidebar";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";


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
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SidebarProvider>
          <MidwifeAppSidebar/>
          {children}
          <ClientFloatingChatbot />
        </SidebarProvider> 
      </body>
    </html>
  );
}