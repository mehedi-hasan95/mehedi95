"use client";
import { CreditCard, Settings, ShieldQuestionMarkIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
export const SettingLinks = () => {
  const pathName = usePathname();
  const settingLink = [
    { name: "Profile", url: "/settings", icon: Settings },
    {
      name: "Security",
      url: "/settings/security",
      icon: ShieldQuestionMarkIcon,
    },
    {
      name: "Billing",
      url: "/settings/billing",
      icon: CreditCard,
    },
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
