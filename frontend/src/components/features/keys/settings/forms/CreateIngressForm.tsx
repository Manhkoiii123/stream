"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateIngressMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  CreateIngressSchema,
  IngressType,
  TypeCreateIngressSchema,
} from "@/schemas/stream/create-ingress.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateIngressForm = () => {
  const t = useTranslations("dashboard.keys.createModal");
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useCurrent();
  const form = useForm<TypeCreateIngressSchema>({
    resolver: zodResolver(CreateIngressSchema),
    defaultValues: {
      ingressType: IngressType.RTMP,
    },
  });
  const { isValid } = form.formState;
  const [createIngress, { loading: isLoadingCreateIngress }] =
    useCreateIngressMutation({
      onCompleted() {
        toast.success(t("successMessage"));
        form.reset();
        refetch();
        setIsOpen(false);
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  function onSubmit(data: TypeCreateIngressSchema) {
    createIngress({ variables: { ingressType: data.ingressType } });
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ingressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ingressTypeLabel")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("ingressTypePlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={IngressType.RTMP.toString()}>
                          RTMP
                        </SelectItem>
                        <SelectItem value={IngressType.WHIP.toString()}>
                          WHIP
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {t("ingressTypeDescription")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isValid || isLoadingCreateIngress}
              >
                {isLoadingCreateIngress ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t("submitButton")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIngressForm;
