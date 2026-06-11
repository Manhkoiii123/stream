"use client";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/elements/FormWrapper";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useChangeProfileInfoMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  changeInfoSchema,
  TypeChangeInfoSchema,
} from "@/schemas/user/change-info.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangeInfoForm = () => {
  const t = useTranslations("dashboard.settings.profile.info");
  const { user, isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangeInfoSchema>({
    resolver: zodResolver(changeInfoSchema),
    values: {
      username: user?.username || "",
      displayName: user?.displayName || "",
      bio: user?.bio || "",
    },
  });
  const [changeInfo, { loading: isLoadingChangeInfo }] =
    useChangeProfileInfoMutation({
      onCompleted: () => {
        refetch();
        toast.success(t("successMessage"));
      },
      onError: () => {
        toast.error(t("errorMessage"));
      },
    });
  const { isValid, isDirty } = form.formState;
  function onSubmit(data: TypeChangeInfoSchema) {
    changeInfo({ variables: { data } });
  }
  return isLoadingProfile ? (
    <ChangeInfoFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("usernameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("usernamePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("usernameDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("displayNameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("displayNamePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("displayNameDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("bioLabel")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("bioPlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("bioDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex justify-end p-5">
            <Button
              type="submit"
              disabled={!isValid || !isDirty || isLoadingChangeInfo}
            >
              {isLoadingChangeInfo ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default ChangeInfoForm;

export function ChangeInfoFormSkeleton() {
  return <Skeleton className="h-96 w-full "></Skeleton>;
}

