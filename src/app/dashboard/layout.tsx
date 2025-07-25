import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/dashboard-sidebar/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { getAuth } from "@/utils/getAuth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = async ({ children }: Props) => {
  const auth = await getAuth();
  if (auth?.user.role !== "admin") {
    redirect("/");
  }
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex gap-2 px-4 items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <p>Your Dashboard</p>
          </div>
        </header>
        <Separator />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
