"use client";

import ToggleCard, {
  ToggleCardSkeleton,
} from "@/components/ui/elements/ToggleCard";
import { Form, FormField } from "@/components/ui/form";
import { useChangeChatSettingsMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import {
  changeChatSettingsSchema,
  ChangeChatSettingsSchema,
} from "@/schemas/stream/change-chat-settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ChangeChatSettingsForm = () => {
  const t = useTranslations("dashboard.chat");
  const { user, isLoadingProfile } = useCurrent();
  const form = useForm<ChangeChatSettingsSchema>({
    resolver: zodResolver(changeChatSettingsSchema),
    values: {
      isChatEnabled: user?.stream?.isChatEnabled ?? false,
      isChatFollowersOnly: user?.stream?.isChatFollowersOnly ?? false,
      isChatPremiumFollowersOnly:
        user?.stream?.isChatPremiumFollowersOnly ?? false,
    },
  });

  const [changeChatSettings] = useChangeChatSettingsMutation({
    onCompleted: () => {
      toast.success(t("successMessage"));
    },
    onError: () => {
      toast.error(t("errorMessage"));
    },
  });

  const isChatEnabled = form.watch("isChatEnabled");

  function onChange(field: keyof ChangeChatSettingsSchema, value: boolean) {
    form.setValue(field, value);
    changeChatSettings({
      variables: { data: { ...form.getValues(), [field]: value } },
    });
  }

  return isLoadingProfile ? (
    Array.from({ length: 3 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ))
  ) : (
    <Form {...form}>
      <FormField
        control={form.control}
        name="isChatEnabled"
        render={({ field }) => (
          <ToggleCard
            heading={t("isChatEnabled.heading")}
            description={t("isChatEnabled.description")}
            value={field.value}
            onChange={(value) => onChange("isChatEnabled", value)}
          />
        )}
      />
      <FormField
        control={form.control}
        name="isChatFollowersOnly"
        render={({ field }) => (
          <ToggleCard
            heading={t("isChatFollowersOnly.heading")}
            description={t("isChatFollowersOnly.description")}
            value={field.value}
            isDisabled={!isChatEnabled}
            onChange={(value) => onChange("isChatFollowersOnly", value)}
          />
        )}
      />
      <FormField
        control={form.control}
        name="isChatPremiumFollowersOnly"
        render={({ field }) => (
          <ToggleCard
            heading={t("isChatPremiumFollowersOnly.heading")}
            description={t("isChatPremiumFollowersOnly.description")}
            value={field.value}
            isDisabled={!isChatEnabled}
            onChange={(value) => onChange("isChatPremiumFollowersOnly", value)}
          />
        )}
      />
    </Form>
  );
};

export default ChangeChatSettingsForm;
