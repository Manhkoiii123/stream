"use client";

import AuthWrapper from "@/components/features/auth/AuthWrapper";
import { Button } from "@/components/ui/button";
import { loginSchema, TypeLoginSchema } from "@/schemas/auth/login.schema";
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
import { useLoginUserMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/user-auth";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { auth } = useAuth();
  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  const { isValid } = form.formState;
  const [login] = useLoginUserMutation({
    onCompleted(data) {
      if (data.login.message) {
        auth();
        router.push("/dashboard/settings");
        // setIsShowTwoFactor(true);
      } else {
        auth();
        toast.success(t("successMessage"));
        setIsLoading(false);
        router.push("/dashboard/settings");
      }
    },
    onError() {
      toast.error(t("errorMessage"));
      setIsLoading(false);
    },
  });

  function onSubmit(data: TypeLoginSchema) {
    setIsLoading(true);
    login({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonHref="/account/create"
      backButtonLabel={t("backButtonLabel")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          {isShowTwoFactor ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pinLabel")}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex items-center justify-between w-full">
                        <InputOTPSlot index={0}></InputOTPSlot>
                        <InputOTPSlot index={1}></InputOTPSlot>
                        <InputOTPSlot index={2}></InputOTPSlot>
                        <InputOTPSlot index={3}></InputOTPSlot>
                        <InputOTPSlot index={4}></InputOTPSlot>
                        <InputOTPSlot index={5}></InputOTPSlot>
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
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("loginLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com or john_doe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("loginDescription")}</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t("passwordLabel")}</FormLabel>

                      <Link
                        href="/account/forgot-password"
                        className="ml-auto inline-block text-sm"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
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
            </>
          )}
          <div className="flex items-center justify-between mt-2">
            <Button className="flex-1" disabled={!isValid || isLoading}>
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default LoginForm;
