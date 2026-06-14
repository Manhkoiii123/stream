"use client";

import CreateIngressForm from "@/components/features/keys/settings/forms/CreateIngressForm";
import StreamKey from "@/components/features/keys/settings/forms/StreamKey";
import StreamURL from "@/components/features/keys/settings/forms/StreamURL";
import InstructionModal from "@/components/features/keys/settings/InstructionModal";
import Heading from "@/components/ui/elements/Heading";
import { ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrent } from "@/hooks/useCurrent";
import { useTranslations } from "next-intl";

const KeysSetting = () => {
  const t = useTranslations("dashboard.keys.header");
  const { user, isLoadingProfile } = useCurrent();
  return (
    <div className="lg:px-10">
      <div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">
        <Heading
          title={t("heading")}
          description={t("description")}
          size="lg"
        />
        <div className="flex items-center gap-x-4">
          <InstructionModal />
          <CreateIngressForm />
        </div>
      </div>
      <div className="mt-5 space-y-6">
        {isLoadingProfile ? (
          <ToggleCardSkeleton />
        ) : (
          <>
            <StreamURL value={user?.stream.serverUrl ?? null} />
            <StreamKey value={user?.stream.streamKey ?? null} />
          </>
        )}
      </div>
    </div>
  );
};

export default KeysSetting;
