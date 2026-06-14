import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FindSessionsByUserQuery } from "@/graphql/generated/output";

import { formatDate } from "@/utils/format-date";

import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";

const SessionLocationMap = dynamic(
  () => import("@/components/features/user/sessions/SessionLocationMap"),

  { ssr: false },
);

interface SessionModalProps {
  session: FindSessionsByUserQuery["findSessionsByUser"][0];

  children?: React.ReactNode;
}

const SessionModal = ({ session, children }: SessionModalProps) => {
  const t = useTranslations("dashboard.settings.sessions.sessionModal");

  const latitude = session.metadata.location.latidute;

  const longitude = session.metadata.location.longitude;

  const hasCoordinates = latitude !== 0 || longitude !== 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("heading")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center">
            <span className="font-medium">{t("device")}</span>

            <span className="ml-2 text-muted-foreground">
              {session.metadata.device.browser}, {session.metadata.device.os}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium">{t("location")}</span>

            <span className="ml-2 text-muted-foreground">
              {session.metadata.location.country},{" "}
              {session.metadata.location.city}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium">{t("ipAddress")}</span>

            <span className="ml-2 text-muted-foreground">
              {session.metadata.ip}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium">{t("createdAt")}</span>

            <span className="ml-2 text-muted-foreground">
              {formatDate(session.createdAt, true)}
            </span>
          </div>

          {hasCoordinates && (
            <SessionLocationMap latitude={latitude} longitude={longitude} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;
