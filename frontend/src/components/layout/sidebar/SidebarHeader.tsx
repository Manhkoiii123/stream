"use client";
import { Button } from "@/components/ui/button";
import Hints from "@/components/ui/elements/Hints";
import { useSidebar } from "@/hooks/useSidebar";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const SidebarHeader = () => {
  const t = useTranslations("layout.sidebarHeader");
  const pathname = usePathname();
  const { close, isCollapsed, open } = useSidebar();
  const label = isCollapsed ? t("expand") : t("collapse");
  return isCollapsed ? (
    <div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
      <Hints label={label} side="right" asChild>
        <Button onClick={() => open()} variant={"ghost"} size={"icon"}>
          <ArrowRightFromLine className="size-4" />
        </Button>
      </Hints>
    </div>
  ) : (
    <div className="mb-2 flex w-full items-center justify-between p-3 pl-4">
      <h2 className="text-lg font-semibold text-foreground">
        {t("navigation")}
      </h2>
      <Hints label={label} side="right" asChild>
        <Button onClick={() => close()} variant={"ghost"} size={"icon"}>
          <ArrowLeftFromLine className="size-4" />
        </Button>
      </Hints>
    </div>
  );
};

export default SidebarHeader;
