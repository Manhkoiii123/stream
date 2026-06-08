import { Route } from "@/components/layout/sidebar/route.interface";
import SidebarItem from "@/components/layout/sidebar/SidebarItem";
import {
  Banknote,
  DollarSign,
  KeyRound,
  Medal,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

const DashboardNav = () => {
  const t = useTranslations("layout.dashboardNav");
  const routes: Route[] = [
    {
      label: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      label: t("keys"),
      href: "/dashboard/keys",
      icon: KeyRound,
    },
    {
      label: t("chatSettings"),
      href: "/dashboard/chat",
      icon: MessageSquare,
    },
    {
      label: t("followers"),
      href: "/dashboard/followers",
      icon: Users,
    },
    {
      label: t("sponsors"),
      href: "/dashboard/sponsors",
      icon: Medal,
    },
    {
      label: t("premium"),
      href: "/dashboard/plans",
      icon: DollarSign,
    },
    {
      label: t("transactions"),
      href: "/dashboard/transactions",
      icon: Banknote,
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

export default DashboardNav;
