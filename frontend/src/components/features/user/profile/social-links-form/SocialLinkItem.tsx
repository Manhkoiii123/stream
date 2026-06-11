/* eslint-disable react-hooks/refs */
"use client";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FindSocialLinksQuery,
  useDeleteSocialLinkMutation,
  useFindSocialLinksQuery,
  useReorderSocialLinksMutation,
  useUpdateSocialLinkMutation,
} from "@/graphql/generated/output";
import {
  socialLinkSchema,
  TypeSocialLinkSchema,
} from "@/schemas/user/social-link.schema";
import { DraggableProvided } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SocialLinkItemProps {
  item: FindSocialLinksQuery["findSocialLinks"][0];
  provided: DraggableProvided;
}

const SocialLinkItem = ({ item, provided }: SocialLinkItemProps) => {
  const t = useTranslations("dashboard.settings.profile.socialLinks.editForm");
  const { refetch } = useFindSocialLinksQuery();
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useForm<TypeSocialLinkSchema>({
    resolver: zodResolver(socialLinkSchema),
    values: {
      title: item.title,
      url: item.url,
    },
  });
  const { isValid } = form.formState;

  const [deleteSocialLink, { loading: isLoadingDeleteSocialLink }] =
    useDeleteSocialLinkMutation({
      onCompleted: () => {
        refetch();
        toast.success(t("successRemoveMessage"));
      },
      onError: () => {
        toast.error(t("errorRemoveMessage"));
      },
    });

  const [updateSocialLink, { loading: isLoadingUpdateSocialLink }] =
    useUpdateSocialLinkMutation({
      onCompleted: () => {
        form.reset();
        refetch();
        toast.success(t("successUpdateMessage"));
      },
      onError: () => {
        toast.error(t("errorUpdateMessage"));
      },
    });
  function toggleEditing(id: string | null) {
    setEditingId(id);
  }
  function onSubmit(data: TypeSocialLinkSchema) {
    updateSocialLink({ variables: { id: item.id, data } });
    toggleEditing(null);
  }

  return (
    <div
      className="mb-4 flex items-center gap-x-2 rounded-md border border-border bg-background text-sm"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div
        {...provided.dragHandleProps}
        className="rounded-l-md border-r border-r-border px-2 py-9 text-foreground transition"
      >
        <GripVertical className="size-5" />
      </div>
      <div className="space-y-1 px-2">
        {editingId === item.id ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-x-6"
            >
              <div className="w-96 space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-8"
                          placeholder={t("titlePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-8"
                          placeholder={t("urlPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-x-4">
                <Button variant="secondary" onClick={() => toggleEditing(null)}>
                  {t("cancelButton")}
                </Button>
                <Button>{t("submitButton")}</Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <h2 className="text-lg tracking-wide font-semibold text-foreground">
              {item.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              <Link href={item.url} target="_blank" className="hover:underline">
                {item.url}
              </Link>
            </p>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-2 pr-4">
        {editingId !== item.id && (
          <Button
            variant="ghost"
            size="lgIcon"
            onClick={() => toggleEditing(item.id)}
          >
            <Pencil className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="lgIcon"
          onClick={() => deleteSocialLink({ variables: { id: item.id } })}
          disabled={isLoadingDeleteSocialLink}
        >
          <Trash className="size-4 " />
        </Button>
      </div>
    </div>
  );
};

export default SocialLinkItem;
