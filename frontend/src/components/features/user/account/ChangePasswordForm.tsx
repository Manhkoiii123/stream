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
import { useChangePasswordMutation } from "@/graphql/generated/output";
import {
  changePasswordSchema,
  TypeChangePasswordSchema,
} from "@/schemas/user/change-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const t = useTranslations("dashboard.settings.account.password");

  const form = useForm<TypeChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    values: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const { isValid } = form.formState;
  const [changePassword, { loading: isLoadingChangePassword }] =
    useChangePasswordMutation({
      onCompleted: () => {
        form.reset();
        toast.success(t("successMessage"));
      },
      onError: () => {
        toast.error(t("errorMessage"));
      },
    });

  function onSubmit(data: TypeChangePasswordSchema) {
    changePassword({ variables: { data } });
  }

  return (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("oldPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("oldPasswordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("newPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("newPasswordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex justify-end p-5">
            <Button
              type="submit"
              disabled={!isValid || isLoadingChangePassword}
            >
              {t("submitButton")}
              {isLoadingChangePassword ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default ChangePasswordForm;
