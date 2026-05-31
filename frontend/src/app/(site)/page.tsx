/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import { useCurrent } from "@/hooks/useCurrent";

export default function Home() {
  const { isLoadingProfile, user } = useCurrent();
  return <div>{isLoadingProfile ? <div>Loading...</div> : <></>}</div>;
}
