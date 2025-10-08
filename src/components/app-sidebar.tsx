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
import router from "next/router";

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
      title: "Notifications",
      url: "/notifications",
    },
    {
      title: "Announcements",
      url: "/announcement",
    },
    // {
    //   title: "Settings",
    //   url: "/settings",
    // },
    // {
    //   title: "Upgrade Stage",
    //   url: "/upgrade-stage",
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border-r border-[#CFE1EE]"
    >
      <SidebarHeader className="!bg-white">
        <SidebarMenu className="!bg-white">
          <SidebarMenuItem className="!bg-white">
            <SidebarMenuButton
              asChild
              className="!bg-white w-full h-full flex justify-center items-center"
            >
              <a
                href="#"
                className="!bg-white flex justify-center items-center"
              >
                <Image
                  src="/images/logo.jpeg"
                  alt="Logo"
                  width={88}
                  height={88}
                  className="overflow-hidden rounded-full"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="!bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="!bg-white">
        {/* <NavUser user={data.user} /> */}
        <div className="h-[48px] w-full flex flex-row items-center gap-[10px] px-[16px]">
          <i className="logout-icon size-[28px] text-[#757575]" />
              <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="text-[#26262B] cursor-pointer text-[18px] font-[700]"
          >
           Log Out
          </button>
       
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
