"use client";

import CardContainer from "@/components/ui/elements/CardContainer";
import { Form, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setLanguage } from "@/lib/i18n/language";
import {
  changeLanguageSchema,
  TypeChangeLanguageSchema,
} from "@/schemas/user/change-language.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const languages = {
  vi: "Vietnamese",
  en: "English",
};
const ChangeLanguageForm = () => {
  const t = useTranslations("dashboard.settings.appearance.language");
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const form = useForm<TypeChangeLanguageSchema>({
    resolver: zodResolver(changeLanguageSchema),
    values: {
      language: locale as TypeChangeLanguageSchema["language"],
    },
  });
  function onSubmit(data: TypeChangeLanguageSchema) {
    startTransition(async () => {
      try {
        await setLanguage(data.language);
        toast.success(t("successMessage"));
      } catch {
        toast.error(t("errorMessage"));
      }
    });
  }
  return (
    <CardContainer
      heading={t("heading")}
      description={t("description")}
      rightContent={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("selectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </form>
        </Form>
      }
    ></CardContainer>
  );
};

export default ChangeLanguageForm;
