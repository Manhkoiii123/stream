"use client";

import CreatePlanForm from "@/components/features/plans/forms/CreatePlanForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import {
  DataTable,
  DataTableSkeleton,
} from "@/components/ui/elements/DataTable";
import Heading from "@/components/ui/elements/Heading";
import {
  FindMySponsorshipPlansQuery,
  useFindMySponsorshipPlansQuery,
  useRemoveSponsorshipPlanMutation,
} from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import { formatDate } from "@/utils/format-date";
import { formatPlanPrice } from "@/utils/format-plan-price";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

const PlansTable = () => {
  const t = useTranslations("dashboard.plans");
  const locale = useLocale();
  const { user, isLoadingProfile } = useCurrent();
  const { data, loading, refetch } = useFindMySponsorshipPlansQuery();

  const [removePlan] = useRemoveSponsorshipPlanMutation({
    onCompleted() {
      toast.success(t("columns.successMessage"));
      refetch();
    },
    onError() {
      toast.error(t("columns.removeMessage"));
    },
  });

  const plans = data?.findMySponsorshipPlans ?? [];
  const isVerified = user?.isVerified ?? false;

  const columns: ColumnDef<
    FindMySponsorshipPlansQuery["findMySponsorshipPlans"][0]
  >[] = [
    {
      header: t("columns.date"),
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div>{formatDate(row.original.createdAt as Date)}</div>
      ),
    },
    {
      header: t("columns.title"),
      accessorKey: "title",
      cell: ({ row }) => <div>{row.original.title}</div>,
    },
    {
      header: t("columns.price"),
      accessorKey: "price",
      cell: ({ row }) => (
        <div>{formatPlanPrice(row.original.price, locale)}</div>
      ),
    },
    {
      header: t("columns.actions"),
      accessorKey: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right">
            <ConfirmModal
              heading={t("columns.remove")}
              message={row.original.title}
              onConfirm={() =>
                removePlan({ variables: { planId: row.original.id } })
              }
            >
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <Trash2 className="mr-2 size-4" />
                {t("columns.remove")}
              </DropdownMenuItem>
            </ConfirmModal>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="lg:px-10">
      <div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">
        <Heading
          title={t("header.heading")}
          description={t("header.description")}
          size="lg"
        />
        {isVerified && <CreatePlanForm onSuccess={() => refetch()} />}
      </div>

      {!isLoadingProfile && !isVerified && (
        <Alert className="mt-5">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("alert.heading")}</AlertTitle>
          <AlertDescription>{t("alert.description")}</AlertDescription>
        </Alert>
      )}

      <div className="mt-5">
        {loading || isLoadingProfile ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={columns} data={plans} />
        )}
      </div>
    </div>
  );
};

export default PlansTable;
