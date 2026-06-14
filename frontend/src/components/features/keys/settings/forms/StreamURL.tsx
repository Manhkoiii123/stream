import CardContainer from "@/components/ui/elements/CardContainer";
import CopyButton from "@/components/ui/elements/CopyButton";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface StreamURLProps {
  value: string | null;
}
const StreamURL = ({ value }: StreamURLProps) => {
  const t = useTranslations("dashboard.keys.url");
  return (
    <CardContainer heading={t("heading")}>
      <div className="flex w-full items-center gap-x-4">
        <Input value={value ?? ""} disabled placeholder={t("heading")} />
        <CopyButton value={value ?? ""} />
      </div>
    </CardContainer>
  );
};

export default StreamURL;
