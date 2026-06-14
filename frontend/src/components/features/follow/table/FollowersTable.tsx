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
import { Skeleton } from "@/components/ui/skeleton";
import {
  FindMyFollowersQuery,
  useFindMyFollowersQuery,
} from "@/graphql/generated/output";
import { formatDate } from "@/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FollowersTable = () => {
  const t = useTranslations("dashboard.followers");
  const { data: followersData, loading: isLoadingFollowers } =
    useFindMyFollowersQuery();

  const followers = followersData?.findMyFollowers ?? [];

  const columns: ColumnDef<FindMyFollowersQuery["findMyFollowers"][0]>[] = [
    {
      header: t("columns.date"),
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return <div>{formatDate(row.original.createdAt as Date)}</div>;
      },
    },
    {
      header: t("columns.user"),
      accessorKey: "follower",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <ChannelAvatar channel={row.original.follower} size={"sm"} />
            <h2 className="truncate">{row.original.follower.username}</h2>
            {row.original.follower.isVerified && (
              <ChannelVerified size={"sm"} />
            )}
          </div>
        );
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
              <Link href={`/${row.original.follower.username}`} target="_blank">
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
        {isLoadingFollowers ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={columns} data={followers} />
        )}
      </div>
    </div>
  );
};

export default FollowersTable;
