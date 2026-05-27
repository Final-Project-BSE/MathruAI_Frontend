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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Midwife Dashboard",
      url: "/midwife-dashboard",
    },
    {
      title: "Patient Management",
      url: "/patient-management",
    },
    {
      title: "Reports & Analysis",
      url: "/reports-analysis",
    },

    {
      title: "Communications",
      url: "/communications",
    },
    {
      title: "Settings",
      url: "/settings",
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

export function MidwifeAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

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
            onClick={handleLogout}
            className="text-[#26262B] cursor-pointer text-[18px] font-[700]"
          >
            Log Out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
