import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import { useDisableTotpMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const DisableTotp = () => {
  const t = useTranslations("dashboard.settings.account.twoFactor.disable");
  const { refetch } = useCurrent();

  const [disableTotp, { loading: isLoadingDisableTotp }] =
    useDisableTotpMutation({
      onCompleted() {
        toast.success(t("successMessage"));
        refetch();
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  return (
    <ConfirmModal
      heading={t("heading")}
      message={t("message")}
      onConfirm={() => disableTotp()}
    >
      <Button disabled={isLoadingDisableTotp}>{t("trigger")}</Button>
    </ConfirmModal>
  );
};

export default DisableTotp;
