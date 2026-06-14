"use client";
import LogoImage from "@/components/images/LogoImage";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Logo = () => {
  const t = useTranslations("layout.logo");
  return (
    <Link
      href={"/"}
      className="flex items-center gap-x-4 transition-opacity hover:opacity-75"
    >
      <LogoImage />
      <div className="hidden lg:block leading-tight">
        <h2 className="text-lg font-semibold tracking-wider text-accent-foreground">
          ManhStream
        </h2>
        <p className="text-sm text-muted-foreground">{t("platform")}</p>
      </div>
    </Link>
  );
};

export default Logo;
