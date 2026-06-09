import Heading from "@/components/ui/elements/Heading";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const UserSettings = () => {
  const t = useTranslations("dashboard.settings.header");
  return (
    <div className="lg:px-10">
      <Heading
        title={t("heading")}
        description={t("description")}
        size="lg"
      ></Heading>

      <Tabs defaultValue="profile" className="w-full mt-3">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          <TabsTrigger value="account">{t("account")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          <TabsTrigger value="sessions">{t("sessions")}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">profile</TabsContent>
        <TabsContent value="account">account</TabsContent>
        <TabsContent value="appearance">appearance</TabsContent>
        <TabsContent value="notifications">notifications</TabsContent>
        <TabsContent value="sessions">sessions</TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
