import { Geist, Geist_Mono } from "next/font/google";
import { ClientFloatingChatbot } from "@/components/ClientFloatingChatbot";
import Navbar from "../(panel)/midwife/components/Navbar";

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