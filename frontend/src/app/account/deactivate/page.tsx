import DeactiveForm from "@/components/features/auth/forms/DeactiveForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.deactivate");
  return {
    title: t("heading"),
  };
}
const DeactivatePage = async () => {
  return <DeactiveForm />;
};

export default DeactivatePage;
