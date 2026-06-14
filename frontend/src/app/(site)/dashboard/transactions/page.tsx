import TransactionsTable from "@/components/features/transaction/table/TransactionsTable";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.transactions.header");
  return {
    title: t("heading"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

const TransactionsPage = () => {
  return <TransactionsTable />;
};

export default TransactionsPage;
