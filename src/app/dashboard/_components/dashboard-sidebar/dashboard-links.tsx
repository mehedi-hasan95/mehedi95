"use client";
import { Info, LayoutDashboard, MessageCircleCode } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
export const DashboardLinks = () => {
  const pathName = usePathname();
  const settingLink = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Messages", url: "/dashboard/messages", icon: MessageCircleCode },
    { name: "User Info", url: "/dashboard/info", icon: Info },
  ];
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:block">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {settingLink.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={pathName === item.url}>
              <Link href={item.url} prefetch>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
