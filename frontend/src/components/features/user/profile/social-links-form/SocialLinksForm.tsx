"use client";
import SocialLinkList from "@/components/features/user/profile/social-links-form/SocialLinkList";
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
import {
  useCreateSocialLinkMutation,
  useFindSocialLinksQuery,
} from "@/graphql/generated/output";
import {
  socialLinkSchema,
  TypeSocialLinkSchema,
} from "@/schemas/user/social-link.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SocialLinksForm = () => {
  const t = useTranslations(
    "dashboard.settings.profile.socialLinks.createForm",
  );
  const { refetch } = useFindSocialLinksQuery();

  const form = useForm<TypeSocialLinkSchema>({
    resolver: zodResolver(socialLinkSchema),
    values: {
      title: "",
      url: "",
    },
  });
  const [createSocialLink, { loading: isLoadingCreateSocialLink }] =
    useCreateSocialLinkMutation({
      onCompleted: () => {
        form.reset();
        refetch();
        toast.success(t("successMessage"));
      },
      onError: () => {
        toast.error(t("errorMessage"));
      },
    });
  const { isValid } = form.formState;
  function onSubmit(data: TypeSocialLinkSchema) {
    createSocialLink({ variables: { data } });
  }
  return isLoadingCreateSocialLink ? (
    <SocialLinksFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("titleLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("titlePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("titleDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("urlLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("urlPlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("urlDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex justify-end p-5">
            <Button
              type="submit"
              disabled={!isValid || isLoadingCreateSocialLink}
            >
              {isLoadingCreateSocialLink ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
      <SocialLinkList />
    </FormWrapper>
  );
};

export default SocialLinksForm;

function SocialLinksFormSkeleton() {
  return <Skeleton className="h-72 w-full" />;
}
