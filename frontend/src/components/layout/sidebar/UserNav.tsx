import { Route } from "@/components/layout/sidebar/route.interface";
import SidebarItem from "@/components/layout/sidebar/SidebarItem";
import { Folder, Home, Radio } from "lucide-react";
import { useTranslations } from "next-intl";

const UserNav = () => {
  const t = useTranslations("layout.userNav");
  const routes: Route[] = [
    {
      label: t("home"),
      href: "/",
      icon: Home,
    },
    {
      label: t("categories"),
      href: "/categories",
      icon: Folder,
    },
    {
      label: t("streams"),
      href: "/streams",
      icon: Radio,
    },
  ];
  return (
    <div className="space-y-2 px2 pt-4 lg:pt-0">
      {routes.map((route, index) => (
        <SidebarItem route={route} key={index} />
      ))}
    </div>
  );
};

export default UserNav;
