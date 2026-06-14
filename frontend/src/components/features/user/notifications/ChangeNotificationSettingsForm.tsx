"use client";
import ToggleCard, {
  ToggleCardSkeleton,
} from "@/components/ui/elements/ToggleCard";
import { Form, FormField } from "@/components/ui/form";
import { useChangeNotificationSettingMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  changeNotificationSettingSchema,
  TypeChangeNotificationSettingSchema,
} from "@/schemas/user/change-notification-setting.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangeNotificationSettingsForm = () => {
  const t = useTranslations("dashboard.settings.notifications");
  const { user, isLoadingProfile } = useCurrent();
  const form = useForm<TypeChangeNotificationSettingSchema>({
    resolver: zodResolver(changeNotificationSettingSchema),
    values: {
      siteNotifications: user?.notificationSettings?.siteNotifications || false,
      telegramNotifications:
        user?.notificationSettings?.telegramNotifications || false,
    },
  });

  const [
    changeNotificationSetting,
    { loading: isLoadingChangeNotificationSetting },
  ] = useChangeNotificationSettingMutation({
    onCompleted: () => {
      toast.success(t("successMessage"));
    },
    onError: () => {
      toast.error(t("errorMessage"));
    },
  });
  function onChange(
    field: keyof TypeChangeNotificationSettingSchema,
    value: boolean,
  ) {
    form.setValue(field, value);
    changeNotificationSetting({
      variables: { data: { ...form.getValues(), [field as string]: value } },
    });
  }
  return isLoadingProfile ? (
    Array.from({ length: 2 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ))
  ) : (
    <Form {...form}>
      <FormField
        control={form.control}
        name="siteNotifications"
        render={({ field }) => (
          <ToggleCard
            heading={t("siteNotifications.heading")}
            description={t("siteNotifications.description")}
            value={field.value}
            onChange={(value) => onChange("siteNotifications", value)}
          />
        )}
      />
      <FormField
        control={form.control}
        name="telegramNotifications"
        render={({ field }) => (
          <ToggleCard
            heading={t("telegramNotifications.heading")}
            description={t("telegramNotifications.description")}
            value={field.value}
            onChange={(value) => onChange("telegramNotifications", value)}
          />
        )}
      />
    </Form>
  );
};

export default ChangeNotificationSettingsForm;
