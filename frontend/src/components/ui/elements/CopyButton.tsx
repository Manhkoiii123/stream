"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface CopyButtonProps {
  value: string;
}
const CopyButton = ({ value }: CopyButtonProps) => {
  const t = useTranslations("components.copyButton");
  const [isCopied, setIsCopied] = useState(false);
  function handleCopy() {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }
  const Icon = isCopied ? Check : Copy;
  return (
    <Button
      variant="ghost"
      size="lgIcon"
      onClick={handleCopy}
      disabled={isCopied || !value}
    >
      <Icon className="size-4" />
    </Button>
  );
};

export default CopyButton;
