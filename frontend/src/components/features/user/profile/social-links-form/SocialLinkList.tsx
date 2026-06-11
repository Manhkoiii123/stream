/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useFindSocialLinksQuery,
  useReorderSocialLinksMutation,
} from "@/graphql/generated/output";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Separator } from "@/components/ui/separator";
import SocialLinkItem from "@/components/features/user/profile/social-links-form/SocialLinkItem";
import { toast } from "sonner";
const SocialLinkList = () => {
  const t = useTranslations("dashboard.settings.profile.socialLinks");
  const { data, loading, refetch } = useFindSocialLinksQuery();
  const items = data?.findSocialLinks ?? [];
  const [socialLinks, setSocialLinks] = useState(items);
  useEffect(() => {
    if (items.length > 0) {
      setSocialLinks(items);
    }
  }, [items]);
  const [reorderSocialLinks, { loading: isLoadingReorderSocialLinks }] =
    useReorderSocialLinksMutation({
      onCompleted: () => {
        refetch();
        toast.success(t("successReorderMessage"));
      },
      onError: () => {
        toast.error(t("errorReorderMessage"));
      },
    });
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(socialLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const bulkUpdateData = items.map((item, index) => ({
      id: item.id,
      position: index,
    }));
    setSocialLinks(items);
    reorderSocialLinks({ variables: { list: bulkUpdateData } });
  }

  return loading ? (
    <SocialLinkListSkeleton />
  ) : (
    <>
      <Separator />
      <div className="px-5">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="social-links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {socialLinks.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <SocialLinkItem item={item} provided={provided} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default SocialLinkList;

function SocialLinkListSkeleton() {
  return (
    <div className="flex flex-col gap-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
