import SponsorsTable from "@/components/features/sponsorship/table/SponsorsTable";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.sponsors.header");
  return {
    title: t("heading"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

const SponsorsPage = () => {
  return <SponsorsTable />;
};

export default SponsorsPage;
