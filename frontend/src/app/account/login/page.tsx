import LoginForm from "@/components/features/auth/forms/LoginForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.createAccount");
  return {
    title: t("heading"),
  };
}
const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
