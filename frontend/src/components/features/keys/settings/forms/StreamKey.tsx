"use client";
import { Button } from "@/components/ui/button";
import CardContainer from "@/components/ui/elements/CardContainer";
import CopyButton from "@/components/ui/elements/CopyButton";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
interface StreamKeyProps {
  value: string | null;
}

const StreamKey = ({ value }: StreamKeyProps) => {
  const t = useTranslations("dashboard.keys.key");
  const [isShow, setIsShow] = useState(false);

  return (
    <CardContainer heading={t("heading")}>
      <div className="flex w-full items-center gap-x-4">
        <Input
          value={value ?? ""}
          disabled
          placeholder={t("heading")}
          type={isShow ? "text" : "password"}
        />
        <CopyButton value={value ?? ""} />
        <Button
          variant="outline"
          size="lgIcon"
          onClick={() => setIsShow(!isShow)}
        >
          {isShow ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </Button>
      </div>
    </CardContainer>
  );
};

export default StreamKey;
