"use client";

import { useFindChannelByUsernameQuery } from "@/graphql/generated/output";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  const { data, loading } = useFindChannelByUsernameQuery({
    variables: {
      username: "silentblade",
    },
  });
  return (
    <div>
      {t("title")}
      {loading ? <div>Loading</div> : JSON.stringify(data)}
    </div>
  );
}
