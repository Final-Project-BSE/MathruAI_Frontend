"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2.5">
        <SidebarMenu className="gap-2.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="">
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
                className="flex !flex-row items-center h-[43px] gap-[10px] data-[active=true]:bg-[#d04f51] hover:bg-[#ffffff] data-[active=true]:text-[#ffffff] data-[active=true]:border-l-[#ffffff] data-[active=true]:border-l-[4px] text-[#ffffff] text-sm rounded-[50px]"
              >
                {/* {item.icon && <item.icon />} */}
                <Link
                  href={item.url}
                  prefetch={true}
                  className="flex flex-row items-center h-full w-full px-[16px] gap-[2px]"
                >
                  <span className="">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}