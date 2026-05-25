import VerifyAccountForm from "@/components/features/auth/forms/VerifyAccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.createAccount");
  return {
    title: t("heading"),
  };
}

const VerifyAccountPage = async (props: {
  searchParams: Promise<{ token: string }>;
}) => {
  const searchParams = await props.searchParams;
  if (!searchParams.token) {
    return redirect("/account/create");
  }
  return <VerifyAccountForm />;
};

export default VerifyAccountPage;
