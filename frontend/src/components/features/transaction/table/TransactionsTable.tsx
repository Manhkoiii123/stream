"use client";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableSkeleton,
} from "@/components/ui/elements/DataTable";
import Heading from "@/components/ui/elements/Heading";
import {
  FindMyTransactionsQuery,
  useFindMyTransactionsQuery,
} from "@/graphql/generated/output";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import { formatPlanPrice } from "@/utils/format-plan-price";
import {
  getTransactionStatusLabelKey,
  getTransactionStatusStyle,
} from "@/utils/get-transaction-status";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";

const TransactionsTable = () => {
  const t = useTranslations("dashboard.transactions");
  const locale = useLocale();
  const { data, loading } = useFindMyTransactionsQuery();

  const transactions = data?.findMyTransactions ?? [];

  const columns: ColumnDef<
    FindMyTransactionsQuery["findMyTransactions"][0]
  >[] = [
    {
      header: t("columns.date"),
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div>{formatDate(row.original.createdAt as Date)}</div>
      ),
    },
    {
      header: t("columns.status"),
      accessorKey: "status",
      cell: ({ row }) => {
        const statusKey = getTransactionStatusLabelKey(row.original.status);

        return (
          <Badge
            variant="outline"
            className={cn(getTransactionStatusStyle(row.original.status))}
          >
            {t(`columns.${statusKey}`)}
          </Badge>
        );
      },
    },
    {
      header: t("columns.amount"),
      accessorKey: "amount",
      cell: ({ row }) => (
        <div>{formatPlanPrice(row.original.amount, locale)}</div>
      ),
    },
  ];

  return (
    <div className="lg:px-10">
      <Heading
        title={t("header.heading")}
        description={t("header.description")}
        size="lg"
      />
      <div className="mt-5">
        {loading ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={columns} data={transactions} />
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
