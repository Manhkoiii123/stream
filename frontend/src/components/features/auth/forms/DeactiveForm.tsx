"use client";

import AuthWrapper from "@/components/features/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useDeactiveAccountMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import { useAuth } from "@/hooks/user-auth";
import {
  DeactiveSchema,
  DeactiveSchemaType,
} from "@/schemas/auth/deactive.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DeactiveForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPin, setIsShowPin] = useState(false);
  const t = useTranslations("auth.deactivate");
  const router = useRouter();
  const { exit } = useAuth();
  const { user } = useCurrent();

  const form = useForm<DeactiveSchemaType>({
    resolver: zodResolver(DeactiveSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user?.email, form]);

  const [deactivateAccount] = useDeactiveAccountMutation({
    onCompleted(data) {
      setIsLoading(false);

      if (data.deactivateAccount.message) {
        exit();
        toast.success(t("successMessage"));
        router.push("/account/login");
        return;
      }

      setIsShowPin(true);
    },
    onError() {
      toast.error(t("errorMessage"));
      setIsLoading(false);
    },
  });

  function onSubmit(data: DeactiveSchemaType) {
    setIsLoading(true);
    deactivateAccount({
      variables: {
        data: {
          email: data.email,
          password: data.password,
          pin: data.pin || undefined,
        },
      },
    });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonHref="/dashboard/settings"
      backButtonLabel={t("backButtonLabel")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          {isShowPin ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pinLabel")}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex w-full items-center justify-between">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>{t("pinDescription")}</FormDescription>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="manhtranduc0202@gmail.com"
                        {...field}
                      />
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
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("passwordDescription")}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}
          <Button className="mt-2 w-full" type="submit" disabled={isLoading}>
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default DeactiveForm;
