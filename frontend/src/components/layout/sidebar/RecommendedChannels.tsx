"use client";
import {
  ChangeAvatarSkeleton,
  ChannelItem,
} from "@/components/layout/sidebar/ChannelItem";
import { Separator } from "@/components/ui/separator";
import { useFindRecommendedChannelsQuery } from "@/graphql/generated/output";
import { useSidebar } from "@/hooks/useSidebar";
import { useTranslations } from "next-intl";

const RecommendedChannels = () => {
  const t = useTranslations("layout.recommended");
  const { isCollapsed } = useSidebar();
  const { data, loading: isLoadingRecommended } =
    useFindRecommendedChannelsQuery();
  const channels = data?.findRecommendedChannels ?? [];
  return (
    <div>
      <Separator className="mb-3" />
      {!isCollapsed && (
        <h2 className="text-lg font-semibold text-foreground">
          {t("heading")}
        </h2>
      )}
      {isLoadingRecommended ? (
        Array.from({ length: 7 }).map((_, index) => (
          <ChangeAvatarSkeleton key={index} />
        ))
      ) : (
        <>
          {channels.map((item, index) => (
            <ChannelItem channel={item} key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default RecommendedChannels;
