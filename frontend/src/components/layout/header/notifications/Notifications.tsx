import NotificationList from "@/components/layout/header/notifications/NotificationList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFindUnreadNotificationsCountQuery } from "@/graphql/generated/output";
import { Bell } from "lucide-react";

const Notifications = () => {
  const { data, loading: isLoadingCount } =
    useFindUnreadNotificationsCountQuery();
  const count = data?.findUnreadNotificationsCount ?? 0;
  const displayCount = count > 10 ? "+9" : count;
  if (isLoadingCount) return null;
  return (
    <Popover>
      <PopoverTrigger>
        {count !== 0 && (
          <div className="absolute right-[72px] top-5 rounded-full bg-primary px-[5px] text-xs font-semibold text-white">
            {displayCount}
          </div>
        )}
        <Bell className="size-5 text-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[500px] w-[320px] overflow-y-auto"
      >
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
