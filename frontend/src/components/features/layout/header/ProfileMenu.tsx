"use client";
import Notifications from "@/components/features/layout/header/notifications/Notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import { useLogoutUserMutation } from "@/graphql/generated/output";
import { useCurrent } from "@/hooks/useCurrent";
import { useAuth } from "@/hooks/user-auth";
import { LayoutDashboard, Loader2, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProfileMenu = () => {
  const t = useTranslations("layout.headerMenu.profileMenu");
  const router = useRouter();
  const { exit } = useAuth();
  const { user, isLoadingProfile } = useCurrent();
  const [logout] = useLogoutUserMutation({
    onCompleted() {
      exit();
      toast.success(t("logoutSuccess"));
      router.push("/account/login");
    },
    onError() {},
  });
  return isLoadingProfile || !user ? (
    <Loader2 className="size-6 animate-spin text-muted-foreground"></Loader2>
  ) : (
    <>
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ChannelAvatar channel={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[230px]">
          <div className="flex items-center gap-x-3 p-2">
            <ChannelAvatar channel={user} />
            <h2 className="font-medium text-foreground">{user.username}</h2>
          </div>
          <DropdownMenuSeparator />
          <Link href={`/${user.username}`}>
            <DropdownMenuItem>
              <User className="mr-2 size-2" /> {t("channel")}
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/settings`}>
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 size-2" /> {t("dashboard")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onSelect={() => logout()}>
            <LogOut className="mr-2 size-2" /> {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileMenu;
