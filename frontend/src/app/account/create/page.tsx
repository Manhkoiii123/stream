import CreateAccountForm from "@/components/features/auth/forms/CreateAccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login");
  return {
    title: t("heading"),
  };
}
const CreateAccountPage = () => {
  return <CreateAccountForm />;
};

export default CreateAccountPage;
