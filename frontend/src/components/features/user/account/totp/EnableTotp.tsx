import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useEnableTotpMutation,
  useGenerateTotpSecretQuery,
} from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  enableTotpSchema,
  TypeEnableTotpSchema,
} from "@/schemas/user/enable-totp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EnableTotp = () => {
  const t = useTranslations("dashboard.settings.account.twoFactor.enable");
  const { refetch } = useCurrent();
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading: isLoadingGenerateTotpSecret } =
    useGenerateTotpSecretQuery();
  const twoFactorAuth = data?.generateTotp;
  const form = useForm<TypeEnableTotpSchema>({
    resolver: zodResolver(enableTotpSchema),
    defaultValues: {
      pin: "",
    },
  });
  const { isValid } = form.formState;
  const [enableTotp, { loading: isLoadingEnableTotp }] = useEnableTotpMutation({
    onCompleted() {
      setIsOpen(false);
      toast.success(t("successMessage"));
      refetch();
    },
    onError() {
      toast.error(t("errorMessage"));
    },
  });
  function onSubmit(data: TypeEnableTotpSchema) {
    enableTotp({
      variables: {
        data: {
          secret: twoFactorAuth?.secret ?? "",
          pin: data.pin ?? "",
        },
      },
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("heading")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">
                {twoFactorAuth?.qrcodeUrl ? t("qrInstructions") : ""}
              </span>
              <Image
                src={twoFactorAuth?.qrcodeUrl ?? ""}
                alt={t("qrInstructions")}
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-center text-sm text-muted-foreground">
                {twoFactorAuth?.secret
                  ? t("secretCodeLabel") + twoFactorAuth.secret
                  : ""}
              </span>
            </div>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center max-sm:items-center">
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={!isValid || isLoadingGenerateTotpSecret || isLoadingEnableTotp}
              >
                {t("submitButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnableTotp;
