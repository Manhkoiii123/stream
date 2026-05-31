"use client";

import AuthWrapper from "@/components/features/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  TypeResetPasswordSchema,
} from "@/schemas/auth/reset-password.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useResetPasswordMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleCheck } from "lucide-react";

const ResetPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("auth.resetPassword");

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isValid } = form.formState;

  const [resetPassword, { loading: isLoadingReset }] = useResetPasswordMutation(
    {
      onCompleted() {
        setIsSuccess(true);
        toast.success(t("successAlertTitle"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    },
  );

  function onSubmit(data: TypeResetPasswordSchema) {
    resetPassword({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonHref="/account/login"
      backButtonLabel={t("backButtonLabel")}
    >
      {!isSuccess ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder="manhtranduc0202@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>{t("emailDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <Button
              className="mt-2 w-full"
              disabled={!isValid || isLoadingReset}
            >
              {t("submitButton")}
            </Button>
          </form>
        </Form>
      ) : (
        <Alert>
          <CircleCheck className="size-4" />
          <AlertTitle>{t("successAlertTitle")}</AlertTitle>
          <AlertDescription>{t("successAlertDescription")}</AlertDescription>
        </Alert>
      )}
    </AuthWrapper>
  );
};

export default ResetPasswordForm;
