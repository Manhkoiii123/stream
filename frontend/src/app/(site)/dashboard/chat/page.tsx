import ChatSetting from "@/components/features/chat/settings/ChatSetting";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.chat.header");
  return {
    title: t("heading"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

const ChatPage = () => {
  return <ChatSetting />;
};

export default ChatPage;
