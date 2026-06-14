"use client";

import ChangeChatSettingsForm from "@/components/features/chat/settings/ChangeChatSettingsForm";
import Heading from "@/components/ui/elements/Heading";
import { useTranslations } from "next-intl";

const ChatSetting = () => {
  const t = useTranslations("dashboard.chat.header");

  return (
    <div className="lg:px-10">
      <Heading title={t("heading")} description={t("description")} size="lg" />
      <div className="mt-5 space-y-6">
        <ChangeChatSettingsForm />
      </div>
    </div>
  );
};

export default ChatSetting;
