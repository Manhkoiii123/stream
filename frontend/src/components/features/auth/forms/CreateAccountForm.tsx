"use client";

import AuthWrapper from "@/components/features/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import {
  createAccountSchema,
  TypeCreateAccountSchema,
} from "@/schemas/auth/create-account.schema";
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
import Link from "next/link";
import { useCreateUserMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Circle, CircleCheck } from "lucide-react";

const CreateAccountForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("auth.createAccount");
  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { isValid } = form.formState;
  const [create, { loading: isLoadingCreate }] = useCreateUserMutation({
    onCompleted() {
      setIsSuccess(true);
      toast.success(t("successToast"));
    },
    onError() {
      toast.error(t("errorToast"));
    },
  });
  function onSubmit(data: TypeCreateAccountSchema) {
    create({ variables: { data } });
  }
  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonHref="/account/login"
      backButtonLabel={t("backButtonLabel")}
    >
      {!isSuccess ? (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-3"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("usernameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("usernamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("usernameDescription")}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("emailPlaceholder")} {...field} />
                    </FormControl>
                    <FormDescription>{t("emailDescription")}</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("passwordPlaceholder")}
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>
                      {t("passwordDescription")}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                className="mt-2 w-full"
                disabled={!isValid || isLoadingCreate}
              >
                {t("submit")}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <Alert>
          <CircleCheck className="size-4" />
          <AlertTitle>{t("successTitle")}</AlertTitle>
          <AlertDescription>{t("successDescription")}</AlertDescription>
        </Alert>
      )}
    </AuthWrapper>
  );
};

export default CreateAccountForm;
