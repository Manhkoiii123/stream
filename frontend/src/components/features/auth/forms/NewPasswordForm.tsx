"use client";

import AuthWrapper from "@/components/features/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import {
  newPasswordSchema,
  TypeNewPasswordSchema,
} from "@/schemas/auth/new-password.schema";
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
import { useNewPasswordMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

const NewPasswordForm = () => {
  const t = useTranslations("auth.newPassword");
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });

  const { isValid } = form.formState;
  const [newPassword, { loading: isLoadingNewPassword }] =
    useNewPasswordMutation({
      onCompleted() {
        toast.success(t("successMessage"));
        router.push("/account/login");
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  function onSubmit(data: TypeNewPasswordSchema) {
    newPassword({
      variables: {
        data: {
          ...data,
          token,
        },
      },
    });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonHref="/account/login"
      backButtonLabel={t("backButtonLabel")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" {...field} type="password" />
                </FormControl>
                <FormDescription>{t("passwordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordRepeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordRepeatLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" {...field} type="password" />
                </FormControl>
                <FormDescription>
                  {t("passwordRepeatDescription")}
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            className="mt-2 w-full"
            disabled={!isValid || isLoadingNewPassword}
          >
            {t("submitButton")}
          </Button>
        </form>
      </Form>
      )
    </AuthWrapper>
  );
};

export default NewPasswordForm;
