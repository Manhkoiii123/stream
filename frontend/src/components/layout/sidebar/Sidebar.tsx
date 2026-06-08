"use client";
import SidebarHeader from "@/components/layout/sidebar/SidebarHeader";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  return (
    <aside
      className={cn(
        "fixed left-0 z-50 mt-[75px] flex-col h-ful border-r border-border bg-card transition-all ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarHeader />
    </aside>
  );
};

export default Sidebar;
