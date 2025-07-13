"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SettingsLogo } from "./settings-logo";
import { SettingLinks } from "./setting-links";
import { SettingsUser } from "./settings-user";

export const SettingsSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SettingsLogo />
      </SidebarHeader>
      <SidebarContent>
        <SettingLinks />
      </SidebarContent>
      <SidebarFooter>
        <SettingsUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
