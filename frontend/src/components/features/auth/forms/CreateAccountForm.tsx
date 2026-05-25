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

interface CreateAccountFormProps {}
const CreateAccountForm = ({}: CreateAccountFormProps) => {
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

  function onSubmit(data: TypeCreateAccountSchema) {
    console.log("🚀 ~ onSubmit ~ data:", data);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("usernameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("usernamePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("usernameDescription")}</FormDescription>
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
                <FormDescription>{t("passwordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Button className="mt-2 w-full" disabled={!isValid}>
            {t("submit")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default CreateAccountForm;
