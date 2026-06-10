"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal";
import FormWrapper from "@/components/ui/elements/FormWrapper";
import { Form, FormField } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useChangeProfileAvatarMutation,
  useRemoveProfileAvatarMutation,
} from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  TypeUploadFileSchema,
  uploadFileSchema,
} from "@/schemas/upload-file.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangeAvatarForm = () => {
  const t = useTranslations("dashboard.settings.profile.avatar");
  const { user, isLoadingProfile, refetch } = useCurrent();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<TypeUploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    values: {
      file: user?.avatar,
    },
  });
  const [update, { loading: isLoadingUpdate }] = useChangeProfileAvatarMutation(
    {
      onCompleted() {
        refetch();
        toast.success(t("successUpdateMessage"));
      },
      onError() {
        toast.error(t("errorUpdateMessage"));
      },
    },
  );
  const [remove, { loading: isRemoveLoading }] = useRemoveProfileAvatarMutation(
    {
      onCompleted() {
        refetch();
        toast.success(t("successRemoveMessage"));
      },
      onError() {
        toast.error(t("errorRemoveMessage"));
      },
    },
  );
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      update({ variables: { avatar: file } });
    }
  };
  return isLoadingProfile ? (
    <ChangeAvatarFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <div className="px-5 pb-5">
              <div className="w-full items-center lg:flex space-x-6">
                <ChannelAvatar
                  channel={{
                    username: user?.username || "",
                    avatar:
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value!,
                  }}
                  size={"xl"}
                />
                <div className="space-y-3">
                  <div className=" flex items-center gap-x-3">
                    <input
                      type="file"
                      className="hidden"
                      ref={inputRef}
                      onChange={handleImageChange}
                    />
                    <Button
                      variant={"secondary"}
                      onClick={() => inputRef.current?.click()}
                      disabled={isLoadingUpdate}
                    >
                      {t("updateButton")}
                    </Button>
                    {user?.avatar && (
                      <ConfirmModal
                        heading={t("confirmModal.heading")}
                        message={t("confirmModal.message")}
                        onConfirm={() => remove()}
                      >
                        <Button
                          variant={"ghost"}
                          size={"lgIcon"}
                          disabled={isRemoveLoading || isLoadingUpdate}
                        >
                          <Trash className="size-4" />
                        </Button>
                      </ConfirmModal>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("info")}</p>
                </div>
              </div>
            </div>
          )}
        />
      </Form>
    </FormWrapper>
  );
};

export default ChangeAvatarForm;

export function ChangeAvatarFormSkeleton() {
  return <Skeleton className="h-52 w-full "></Skeleton>;
}
