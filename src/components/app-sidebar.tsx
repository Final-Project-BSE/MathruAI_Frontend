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
import { useLanguage } from "@/components/common/useLanguage";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      key: "reproductiveDashboard",
      url: "/dashboard/reproductive",
    },
    {
      key: "pregnancyDashboard",
      url: "/dashboard/pregnancy",
    },
    {
      key: "postpartumDashboard",
      url: "/dashboard/postpartum",
    },
    {
      key: "cycleTracker",
      url: "/cycle-tracker",
    },
    {
      key: "healthMonitoring",
      url: "/health-monitoring",
    },
    {
      key: "dailyRecommendations",
      url: "/daily-recommendations",
    },
    {
      key: "midwifeConnection",
      url: "/midwife-assign",
    },
    {
      key: "aiAssistant",
      url: "/chatbot",
    },
    {
      key: "healthRecords",
      url: "/health-records",
    },
    {
      key: "timelineMilestone",
      url: "/timeline-milestone",
    },
    {
      key: "announcements",
      url: "/announcement",
    },
    {
      key: "recoveryTracking",
      url: "/recovery-tracking",
    },
    {
      key: "breastfeedingSupport",
      url: "/breastfeeding-support",
    },
    {
      key: "threePosha",
      url: "/three-posha",
    },
    {
      key: "birthControl",
      url: "/birth-control",
    },
    {
      key: "analytics",
      url: "/analytics",
    },
  ],
} as const;

type SidebarNavKey = keyof ReturnType<typeof useLanguage>["t"]["sidebar"]["nav"];

export function AppSidebar({
  userRole,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userRole: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const sidebarText = t.sidebar;

  const handleLogout = async () => {
    localStorage.setItem("app-language", "en");
    window.dispatchEvent(new Event("language:changed"));
    
    await logout();
    router.push("/sign-in");
  };

  const accessibleNavItems = data.navMain
    .filter((item) => canAccessRoute(userRole, item.url))
    .map((item) => ({
      title: sidebarText.nav[item.key as SidebarNavKey],
      url: item.url,
    }));

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border-r border-[#CFE1EE]"
    >
      <div className="h-full w-full bg-[#210321] bg-cover bg-center bg-no-repeat">
        <SidebarHeader className="bg-transparent">
          <SidebarMenu className="bg-transparent">
            <SidebarMenuItem className="bg-transparent">
              <SidebarMenuButton
                asChild
                tooltip={sidebarText.logo}
                className="flex h-full w-full items-center justify-center bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent"
              >
                <a
                  href="#"
                  className="pointer-events-auto flex items-center justify-center bg-transparent"
                >
                  <Image
                    src="/images/logo.jpeg"
                    alt={sidebarText.logo}
                    width={88}
                    height={88}
                    className="pointer-events-none select-none overflow-hidden rounded-full"
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
                flex h-10 w-full items-center gap-3
                rounded-xl bg-[#3a063a] px-4
                text-white
                transition-colors duration-200
                hover:bg-[#d04f51]
                active:bg-[#b74446]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
              aria-label={sidebarText.logout}
            >
              <i className="logout-icon size-[22px] text-white/90" />
              <span className="text-sm font-semibold tracking-wide">
                {sidebarText.logout}
              </span>
            </button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}