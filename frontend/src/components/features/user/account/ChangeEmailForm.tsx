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
import { useChangeEmailMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  changeEmailSchema,
  TypeChangeEmailSchema,
} from "@/schemas/user/change-email.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangeEmailForm = () => {
  const t = useTranslations("dashboard.settings.account.email");
  const { user, isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    values: {
      email: user?.email || "",
    },
  });
  const { isValid } = form.formState;
  const [changeEmail, { loading: isLoadingChangeEmail }] =
    useChangeEmailMutation({
      onCompleted: () => {
        refetch();
        toast.success(t("successMessage"));
      },
      onError: () => {
        toast.error(t("errorMessage"));
      },
    });
  function onSubmit(data: TypeChangeEmailSchema) {
    changeEmail({ variables: { data } });
  }
  return isLoadingProfile ? (
    <ChangeEmailFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("emailPlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("emailDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex justify-end p-5">
            <Button type="submit" disabled={!isValid || isLoadingChangeEmail}>
              {t("submitButton")}
              {isLoadingChangeEmail ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default ChangeEmailForm;

function ChangeEmailFormSkeleton() {
  return <Skeleton className="w-full h-10" />;
}
