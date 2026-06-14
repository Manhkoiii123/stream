"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSponsorshipPlanMutation } from "@/graphql/generated/output";
import {
  createPlanSchema,
  CreatePlanSchema,
} from "@/schemas/plan/create-plan.schema";
import { formatPlanPrice } from "@/utils/format-plan-price";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreatePlanFormProps {
  onSuccess?: () => void;
}

const defaultValues: CreatePlanSchema = {
  title: "",
  description: "",
  price: 0,
};

const CreatePlanForm = ({ onSuccess }: CreatePlanFormProps) => {
  const t = useTranslations("dashboard.plans.createForm");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreatePlanSchema>({
    resolver: zodResolver(createPlanSchema),
    defaultValues,
  });
  const { isValid } = form.formState;

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset(defaultValues);
    }
  }

  const [createPlan, { loading: isLoadingCreatePlan }] =
    useCreateSponsorshipPlanMutation({
      onCompleted() {
        toast.success(t("successMessage"));
        setIsOpen(false);
        onSuccess?.();
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  function onSubmit(data: CreatePlanSchema) {
    createPlan({
      variables: {
        data: {
          title: data.title,
          description: data.description || undefined,
          price: data.price,
        },
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("titleDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("descriptionDescription")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("priceLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min={0.01}
                        step={0.01}
                        placeholder="9.99"
                        className="pl-7"
                        {...field}
                        onChange={(event) => {
                          const value = event.target.valueAsNumber;
                          field.onChange(Number.isFinite(value) ? value : 0);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("priceDescription")}
                    {locale === "vi" && field.value >= 0.01 && (
                      <span className="mt-1 block">
                        {t("priceEquivalent", {
                          amount: formatPlanPrice(field.value, "vi"),
                        })}
                      </span>
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isValid || isLoadingCreatePlan}>
                {isLoadingCreatePlan ? (
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

export default CreatePlanForm;
