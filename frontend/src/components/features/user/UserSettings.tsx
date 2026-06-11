import Heading from "@/components/ui/elements/Heading";
import { useTranslations } from "next-intl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangeAvatarForm from "@/components/features/user/profile/ChangeAvatarForm";
import ChangeInfoForm from "@/components/features/user/profile/ChangeInfoForm";
import SocialLinksForm from "@/components/features/user/profile/social-links-form/SocialLinksForm";
const UserSettings = () => {
  const t = useTranslations("dashboard.settings");
  return (
    <div className="lg:px-10">
      <Heading
        title={t("header.heading")}
        description={t("header.description")}
        size="lg"
      ></Heading>

      <Tabs defaultValue="profile" className="w-full mt-3">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="profile">{t("header.profile")}</TabsTrigger>
          <TabsTrigger value="account">{t("header.account")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("header.appearance")}</TabsTrigger>
          <TabsTrigger value="header.notifications">
            {t("header.notifications")}
          </TabsTrigger>
          <TabsTrigger value="sessions">{t("header.sessions")}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="mt-5 space-y-6">
            <Heading
              title={t("profile.header.heading")}
              description={t("profile.header.description")}
            />
            <ChangeAvatarForm />
            <ChangeInfoForm />
            <SocialLinksForm />
          </div>
        </TabsContent>
        <TabsContent value="account">account</TabsContent>
        <TabsContent value="appearance">appearance</TabsContent>
        <TabsContent value="notifications">notifications</TabsContent>
        <TabsContent value="sessions">sessions</TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
