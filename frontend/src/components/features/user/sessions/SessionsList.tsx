"use client";

import SessionItem from "@/components/features/user/sessions/SessionItem";
import Heading from "@/components/ui/elements/Heading";
import { ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard";
import {
  useFindCurrentSessionQuery,
  useFindSessionsByUserQuery,
} from "@/graphql/generated/output";
import { useTranslations } from "next-intl";

const SessionsList = () => {
  const t = useTranslations("dashboard.settings.sessions");
  const { data: sessionData, loading: isLoadingCurrentSession } =
    useFindCurrentSessionQuery();
  const { data: sessionsData, loading: isLoadingSessions } =
    useFindSessionsByUserQuery();
  const currentSession = sessionData?.findCurrentSession;
  const sessions = sessionsData?.findSessionsByUser;
  return (
    <div className="space-y-6">
      <Heading title={t("info.current")} size={"sm"} />
      {isLoadingCurrentSession ? (
        <ToggleCardSkeleton />
      ) : (
        <SessionItem session={currentSession!} isCurrent={true} />
      )}
      <Heading title={t("info.active")} size={"sm"} />
      {isLoadingSessions ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ToggleCardSkeleton />
        </div>
      ) : sessions && sessions.length > 0 ? (
        sessions.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))
      ) : (
        <div className="text-muted-foreground">{t("info.notFound")}</div>
      )}
    </div>
  );
};

export default SessionsList;
