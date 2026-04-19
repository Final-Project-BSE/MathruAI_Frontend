import { Geist, Geist_Mono } from "next/font/google";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";
import Navbar from "./midwife/components/Navbar";

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
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-full overflow-hidden bg-black text-white">
        <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
          <div className="shrink-0">
            <Navbar />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {children}
          </div>

          <ClientFloatingChatbot />
        </div>
      </body>
    </html>
  );
}