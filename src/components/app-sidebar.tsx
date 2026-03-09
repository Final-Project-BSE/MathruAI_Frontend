"use client";

import * as React from "react";

import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/authentication";
import { canAccessRoute } from "@/lib/roleConfig";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Reproductive Dashboard",
      url: "/dashboard/reproductive",
    },
    {
      title: "Pregnancy Dashboard",
      url: "/dashboard/pregnancy",
    },
    {
      title: "Postpartum Dashboard",
      url: "/dashboard/postpartum",
    },
    {
      title: "Cycle Tracker",
      url: "/cycle-tracker",
    },
    {
      title: "Health Monitoring",
      url: "/health-monitoring",
    },
    {
      title: "Daily Recommendations",
      url: "/daily-recommendations",
    },
    {
      title: "Midwife Connection",
      url: "/midwife-connection",
    },
    {
      title: "AI Assistant",
      url: "/chatbot",
    },
    {
      title: "Health Records",
      url: "/health-records",
    },
    {
      title: "Announcements",
      url: "/announcement",
    },
    {
      title: "Analytics",
      url: "/analytics",
    },
    // {
    //   title: "Upgrade Stage",
    //   url: "/upgrade-stage",
    // },
  ],
};

export function AppSidebar({ userRole, ...props }: React.ComponentProps<typeof Sidebar> & { userRole: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  const accessibleNavItems = data.navMain.filter((item) => canAccessRoute(userRole, item.url));

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-[#CFE1EE]">
      <div
        className="bg-[#210321] h-full w-full bg-cover bg-center bg-no-repeat"
      >
        <SidebarHeader className="bg-transparent">
          <SidebarMenu className="bg-transparent">
            <SidebarMenuItem className="bg-transparent">
              <SidebarMenuButton
                asChild
                tooltip="Logo"
                className="bg-transparent w-full h-full flex justify-center items-center hover:bg-transparent active:bg-transparent focus:bg-transparent"
              >
                <a
                  href="#"
                  className="bg-transparent flex justify-center items-center pointer-events-auto"
                >
                  <Image
                    src="/images/logo.jpeg"
                    alt="Logo"
                    width={88}
                    height={88}
                    className="overflow-hidden rounded-full pointer-events-none select-none"
                    priority
                  />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="bg-transparent">
          <NavMain items={accessibleNavItems} />
        </SidebarContent>

        <SidebarFooter className="bg-transparent">
  <div className="px-3 pb-3">
    <button
      type="button"
      onClick={handleLogout}
      className="
        w-full h-10
        flex items-center gap-3
        rounded-xl px-4
        bg-[#3a063a] 
        text-white
        hover:bg-[#d04f51]
        active:bg-[#b74446]
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
      "
      aria-label="Log out"
    >
      <i className="logout-icon size-[22px] text-white/90" />
      <span className="text-sm font-semibold tracking-wide">Log out</span>
    </button>
  </div>
</SidebarFooter>
      </div>
    </Sidebar>
  );
}