import SessionModal from "@/components/features/user/sessions/SessionModal";
import { Button } from "@/components/ui/button";
import CardContainer from "@/components/ui/elements/CardContainer";
import { FindSessionsByUserQuery } from "@/graphql/generated/output";
import { getBrowserIcon } from "@/utils/get-brower-icon";
import { useTranslations } from "next-intl";

interface SessionItemProps {
  session: FindSessionsByUserQuery["findSessionsByUser"][0];
  isCurrent?: boolean;
}

const SessionItem = ({ session, isCurrent }: SessionItemProps) => {
  const t = useTranslations("dashboard.settings.sessions.sessionItem");
  const Icon = getBrowserIcon(session.metadata.device.browser);
  return (
    <CardContainer
      Icon={Icon}
      heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
      description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
      rightContent={
        <div className="flex items-center gap-x-4">
          <SessionModal session={session}>
            <Button>{t("detailsButton")}</Button>
          </SessionModal>
        </div>
      }
    ></CardContainer>
  );
};

export default SessionItem;
