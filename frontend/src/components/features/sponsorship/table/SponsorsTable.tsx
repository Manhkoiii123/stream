"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import ChannelVerified from "@/components/ui/elements/ChannelVerified";
import {
  DataTable,
  DataTableSkeleton,
} from "@/components/ui/elements/DataTable";
import Heading from "@/components/ui/elements/Heading";
import {
  FindMySponsorsQuery,
  useFindMySponsorsQuery,
} from "@/graphql/generated/output";
import { formatDate } from "@/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SponsorsTable = () => {
  const t = useTranslations("dashboard.sponsors");
  const { data: sponsorsData, loading: isLoadingSponsors } =
    useFindMySponsorsQuery();

  const sponsors = sponsorsData?.findMySponsors ?? [];

  const columns: ColumnDef<FindMySponsorsQuery["findMySponsors"][0]>[] = [
    {
      header: t("columns.date"),
      accessorKey: "expiresAt",
      cell: ({ row }) => {
        return <div>{formatDate(row.original.expiresAt as Date)}</div>;
      },
    },
    {
      header: t("columns.user"),
      accessorKey: "user",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <ChannelAvatar channel={row.original.user} size={"sm"} />
            <h2 className="truncate">{row.original.user.username}</h2>
            {row.original.user.isVerified && <ChannelVerified size={"sm"} />}
          </div>
        );
      },
    },
    {
      header: t("columns.plan"),
      accessorKey: "plan",
      cell: ({ row }) => {
        return <div>{row.original.plan.title}</div>;
      },
    },
    {
      header: t("columns.actions"),
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"} className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <Link href={`/${row.original.user.username}`} target="_blank">
                <DropdownMenuItem>
                  <Users className="size-4 mr-2" />
                  {t("columns.viewChannel")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
        {isLoadingSponsors ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={columns} data={sponsors} />
        )}
      </div>
    </div>
  );
};

export default SponsorsTable;
