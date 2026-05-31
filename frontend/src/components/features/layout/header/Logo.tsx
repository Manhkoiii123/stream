"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const t = useTranslations("layout.logo");
  return (
    <Link
      href={"/"}
      className="flex items-center gap-x-4 transition-opacity hover:opacity-75"
    >
      <Image src={"/images/logo.svg"} alt="" width={35} height={35} />
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
