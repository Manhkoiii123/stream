"use client";
import DashboardNav from "@/components/layout/sidebar/DashboardNav";
import SidebarHeader from "@/components/layout/sidebar/SidebarHeader";
import UserNav from "@/components/layout/sidebar/UserNav";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isDashboardPage = pathname.includes("/dashboard");
  return (
    <aside
      className={cn(
        "fixed left-0 z-50 mt-[75px] flex-col h-full border-r border-border bg-card transition-all ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarHeader />
      {isDashboardPage ? <DashboardNav /> : <UserNav />}
    </aside>
  );
};

export default Sidebar;
