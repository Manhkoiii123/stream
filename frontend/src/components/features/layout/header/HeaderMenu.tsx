"use client";
import ProfileMenu from "@/components/features/layout/header/ProfileMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/user-auth";
import { useTranslations } from "next-intl";
import Link from "next/link";

const HeaderMenu = () => {
  const t = useTranslations("layout.headerMenu");
  const { isAuthenticated } = useAuth();
  return (
    <div className="ml-auto flex items-center gap-x-4">
      {isAuthenticated ? (
        <ProfileMenu />
      ) : (
        <>
          <Link href={"/account/login"}>
            <Button variant={"secondary"}>{t("login")}</Button>
          </Link>
          <Link href={"/account/create"}>
            <Button>{t("register")}</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderMenu;
