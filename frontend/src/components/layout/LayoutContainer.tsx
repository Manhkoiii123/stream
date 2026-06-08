"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface LayoutContainerProps {
  children?: React.ReactNode;
}
const LayoutContainer = ({ children }: LayoutContainerProps) => {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const { close, isCollapsed, open } = useSidebar();
  useEffect(() => {
    if (isMobile) {
      if (!isCollapsed) {
        close();
      }
    } else {
      if (isCollapsed) open();
    }
  }, [isMobile]);
  return (
    <main
      className={cn(
        "mt-[75px] flex-1 p-8",
        isCollapsed ? "ml-16" : "ml-16 lg:ml-64",
      )}
    >
      {children}
    </main>
  );
};

export default LayoutContainer;
