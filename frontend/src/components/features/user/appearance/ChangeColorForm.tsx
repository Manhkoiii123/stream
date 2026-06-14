"use client";
import CardContainer from "@/components/ui/elements/CardContainer";
import { useConfig } from "@/hooks/use-config";
import { BASE_COLORS } from "@/lib/constants/color.constants";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const ChangeColorForm = () => {
  const t = useTranslations("dashboard.settings.appearance.color");
  const { theme, setTheme } = useConfig();
  return (
    <CardContainer
      heading={t("heading")}
      description={t("description")}
      rightContent={
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {BASE_COLORS.map((color, index) => {
            const isActive = color.name === theme;
            return (
              <button
                key={index}
                onClick={() => setTheme(color.name)}
                style={
                  {
                    "--theme-primary": `hsl(${color.color})`,
                  } as React.CSSProperties
                }
              >
                <span className=" flex size-9 shrink-0 -translate-x-1 items-center justify-center rounded-lg bg-[var(--theme-primary)] hover:border-foreground">
                  {isActive && <CheckIcon className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      }
    ></CardContainer>
  );
};

export default ChangeColorForm;
