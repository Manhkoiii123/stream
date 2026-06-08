"use client";

import { useCurrent } from "@/hooks/useCurrent";

export default function Home() {
  const { isLoadingProfile, user } = useCurrent();
  return <div>{isLoadingProfile ? <div>Loading...</div> : <></>}</div>;
}
