import { Separator } from "@/components/ui/separator";
import {
  useFindNotificationsByUserQuery,
  useFindUnreadNotificationsCountQuery,
} from "@/graphql/generated/output";
import { getNotificationIcon } from "@/utils/get-notification-icon";
import { Loader2 } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "use-intl";
import parse from "html-react-parser";

const NotificationList = () => {
  const t = useTranslations("layout.headerMenu.profileMenu.notifications");
  const { refetch } = useFindUnreadNotificationsCountQuery();
  const { data, loading: isLoadingNotifications } =
    useFindNotificationsByUserQuery({
      onCompleted() {
        refetch();
      },
    });
  const notifications = data?.findNotificationsByUser ?? [];
  return (
    <>
      <h2 className="text-center text-lg font-medium">{t("heading")}</h2>
      <Separator className="my-3" />
      {isLoadingNotifications ? (
        <div className="flex items-center justify-center gap-x-2 text-sm text-foreground">
          <Loader2 className="animate-spin size-5" />
          {t("loading")}
        </div>
      ) : notifications.length ? (
        notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <Fragment key={index}>
              <div className="flex items-center gap-x-3 text-sm ">
                <div className="rounded-full bg-foreground p-2">
                  <Icon className="size-6 text-secondary" />
                </div>
                <div>{parse(notification.message)}</div>
              </div>
              {index < notifications.length - 1 && (
                <Separator className="my-3" />
              )}
            </Fragment>
          );
        })
      ) : (
        <div className="text-center text-muted-foreground">{t("empty")}</div>
      )}
    </>
  );
};

export default NotificationList;
