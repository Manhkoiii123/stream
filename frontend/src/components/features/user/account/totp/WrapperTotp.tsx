"use client";
import DisableTotp from "@/components/features/user/account/totp/DisableTotp";
import EnableTotp from "@/components/features/user/account/totp/EnableTotp";
import CardContainer from "@/components/ui/elements/CardContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrent } from "@/hooks/useCurrent";
import { useTranslations } from "next-intl";

const WrapperTotp = () => {
  const t = useTranslations("dashboard.settings.account.twoFactor");
  const { user, isLoadingProfile } = useCurrent();
  console.log("🚀 ~ WrapperTotp ~ user:", user);
  return isLoadingProfile ? (
    <WrapperTotpSkeleton />
  ) : (
    <CardContainer
      heading={t("heading")}
      description={t("description")}
      rightContent={
        <div className="flex items-center gap-x-4">
          {!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}
        </div>
      }
    ></CardContainer>
  );
};

export default WrapperTotp;

function WrapperTotpSkeleton() {
  return <Skeleton className="w-full h-24" />;
}
