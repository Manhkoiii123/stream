"use client";
import { Route } from "@/components/layout/sidebar/route.interface";
import { Button } from "@/components/ui/button";
import Hints from "@/components/ui/elements/Hints";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  route: Route;
}
const SidebarItem = ({ route }: SidebarItemProps) => {
  const pathName = usePathname();
  const { isCollapsed } = useSidebar();
  const isActive = pathName === route.href;
  return isCollapsed ? (
    <Hints label={route.label} side="right" asChild>
      <Button
        className={cn("h-11 w-full justify-center", isActive && "bg-accent")}
        variant={"ghost"}
        asChild
      >
        <Link href={route.href}>
          <route.icon className="mr-0 size-5" />
        </Link>
      </Button>
    </Hints>
  ) : (
    <Button
      className={cn("h-11 w-full justify-start", isActive && "bg-accent")}
      variant={"ghost"}
      asChild
    >
      <Link href={route.href} className="flex items-center gap-x-4">
        <route.icon className="mr-0 size-5" />
        {route.label}
      </Link>
    </Button>
  );
};

export default SidebarItem;
