"use client";

import { Button } from "@/components/ui/button";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import ChannelVerified from "@/components/ui/elements/ChannelVerified";
import Hints from "@/components/ui/elements/Hints";
import LiveBadge from "@/components/ui/elements/LiveBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { FindRecommendedChannelsQuery } from "@/graphql/generated/output";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChannelItemProps {
  channel: FindRecommendedChannelsQuery["findRecommendedChannels"][0];
}

export function ChannelItem({ channel }: ChannelItemProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const isActive = pathname === `/${channel.username}`;

  return isCollapsed ? (
    <Hints label={channel.username} side="right" asChild>
      <Link
        href={`/${channel.username}`}
        className="mt-3 flex w-full items-center justify-center"
      >
        <ChannelAvatar channel={channel} isLive={channel.stream.isLive} />
      </Link>
    </Hints>
  ) : (
    <Button
      className={cn("h-11  mt-2 w-full justify-start", isActive && "bg-accent")}
      variant={"ghost"}
      asChild
    >
      <Link href={`/${channel.username}`} className="flex w-full  items-center">
        <ChannelAvatar
          size={"sm"}
          channel={channel}
          isLive={channel.stream.isLive}
        />
        <h2 className="truncate pl-2 pr-1">{channel.username}</h2>
        {channel.isVerified && <ChannelVerified size={"sm"} />}
        {channel.stream.isLive && (
          <div className="absolute right-5">
            <LiveBadge />
          </div>
        )}
      </Link>
    </Button>
  );
}

export function ChangeAvatarSkeleton() {
  return <Skeleton className="mt-3 h-11 w-full rounded-full"></Skeleton>;
}
