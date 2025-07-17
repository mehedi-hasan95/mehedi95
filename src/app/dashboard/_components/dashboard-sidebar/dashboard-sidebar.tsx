"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardLogo } from "./dashboard-logo";
import { DashboardLinks } from "./dashboard-links";
import { SettingsUser } from "@/app/settings/_components/settings-sidebar/settings-user";

export const DashboardSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardLogo />
      </SidebarHeader>
      <SidebarContent>
        <DashboardLinks />
      </SidebarContent>
      <SidebarFooter>
        <SettingsUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
